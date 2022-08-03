from pathlib import Path

import bcrypt

from common.utils.exceptions import (
    IncorrectCredentialsError,
    InvalidRegistrationCredentialsError,
    UnknownUserError,
)
from monkey_island.cc.models import UserCredentials
from monkey_island.cc.models.user import User
from monkey_island.cc.repository import IUserRepository
from monkey_island.cc.server_utils.encryption import (
    ILockableEncryptor,
    reset_datastore_encryptor,
    unlock_datastore_encryptor,
)
from monkey_island.cc.setup.mongo.database_initializer import reset_database


class AuthenticationService:
    def __init__(
        self,
        data_dir: Path,
        user_repository: IUserRepository,
        repository_encryptor: ILockableEncryptor,
    ):
        self._data_dir = data_dir
        self._user_repository = user_repository
        self._repository_encryptor = repository_encryptor

    def needs_registration(self) -> bool:
        return not User.objects.first()

    def register_new_user(self, username: str, password: str):
        if not username or not password:
            raise InvalidRegistrationCredentialsError("Username or password can not be empty.")

        credentials = UserCredentials(username, _hash_password(password))
        # self._user_repository.add_user(credentials)
        User(username=username, password_hash=_hash_password(password)).save()
        self._reset_repository_encryptor(username, password)
        reset_database()

    def authenticate(self, username: str, password: str):
        try:
            registered_user = User.objects.first()
        except UnknownUserError:
            raise IncorrectCredentialsError()

        if not _credentials_match_registered_user(username, password, registered_user):
            raise IncorrectCredentialsError()

        self._unlock_repository_encryptor(username, password)
        return registered_user

    def _unlock_repository_encryptor(self, username: str, password: str):
        secret = _get_secret_from_credentials(username, password)
        self._repository_encryptor.unlock(secret.encode())

        # Legacy datastore encryptor will be removed soon
        unlock_datastore_encryptor(self._data_dir, secret)

    def _reset_repository_encryptor(self, username: str, password: str):
        secret = _get_secret_from_credentials(username, password)
        self._repository_encryptor.reset_key()
        self._repository_encryptor.unlock(secret.encode())

        # Legacy datastore encryptor will be removed soon
        reset_datastore_encryptor(self._data_dir, secret)


def _hash_password(plaintext_password: str) -> str:
    salt = bcrypt.gensalt()
    password_hash = bcrypt.hashpw(plaintext_password.encode("utf-8"), salt)

    return password_hash.decode()


def _credentials_match_registered_user(
    username: str, password: str, registered_user: UserCredentials
) -> bool:
    return (registered_user.username == username) and _password_matches_hash(
        password, registered_user.password_hash
    )


def _password_matches_hash(plaintext_password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(plaintext_password.encode("utf-8"), password_hash.encode("utf-8"))


def _get_secret_from_credentials(username: str, password: str) -> str:
    return f"{username}:{password}"
