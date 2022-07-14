from common.credentials import Credentials, LMHash, NTHash, Password, SSHKeypair, Username

username = "m0nk3y_user"
special_username = "m0nk3y.user"
nt_hash = "C1C58F96CDF212B50837BC11A00BE47C"
lm_hash = "299BD128C1101FD6299BD128C1101FD6"
password_1 = "trytostealthis"
password_2 = "password"
PUBLIC_KEY = "MY_PUBLIC_KEY"
PRIVATE_KEY = "MY_PRIVATE_KEY"

PROPAGATION_CREDENTIALS_1 = Credentials(identity=Username(username), secret=Password(password_1))
PROPAGATION_CREDENTIALS_2 = Credentials(identity=Username(special_username), secret=LMHash(lm_hash))
PROPAGATION_CREDENTIALS_3 = Credentials(identity=Username(username), secret=NTHash(nt_hash))
PROPAGATION_CREDENTIALS_4 = Credentials(identity=Username(username), secret=Password(password_2))
PROPAGATION_CREDENTIALS_5 = Credentials(
    identity=Username(username), secret=SSHKeypair(PRIVATE_KEY, PUBLIC_KEY)
)

PROPAGATION_CREDENTIALS = [
    PROPAGATION_CREDENTIALS_1,
    PROPAGATION_CREDENTIALS_2,
    PROPAGATION_CREDENTIALS_3,
    PROPAGATION_CREDENTIALS_4,
    PROPAGATION_CREDENTIALS_5,
]
