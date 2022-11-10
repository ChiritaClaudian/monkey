from dataclasses import dataclass
from typing import Dict


# This will be pydantic
@dataclass
class BruteForceExploiterManifest:
    plugin_name: str
    title: str
    description: str
    is_safe: bool
    link_to_docs: str
    options: Dict

    def validate_name():
        # Name must be url encodable, like something_something
        ...
