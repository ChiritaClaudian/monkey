from dataclasses import dataclass
from typing import Any, Sequence

# Validation can be added here as with any pydantic object.
# TODO The problem is how do we convert this to the front-end validation?
# TODO how do we validate objects/dict? disable nested config for now?


@dataclass
class ConfigField:
    title: str
    description: str


@dataclass
class BoolField(ConfigField):
    def validate(value):
        assert isinstance(value, bool)


@dataclass
class NumericField(ConfigField):
    def validate(value):
        assert isinstance(value, int)


@dataclass
class ListField(ConfigField):
    all_values: Sequence[Any]

    def validate(value):
        # Make sure that value is a subset of all available values
        ...
