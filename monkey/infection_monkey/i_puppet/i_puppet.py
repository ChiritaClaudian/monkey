import abc
import threading
from dataclasses import dataclass, field
from enum import Enum
from typing import Dict, Iterable, List, Mapping, Optional, Sequence, Tuple

from common import OperatingSystem
from common.credentials import Credentials
from infection_monkey.model import VictimHost

from . import PluginType


class PortStatus(Enum):
    OPEN = 1
    CLOSED = 2


class UnknownPluginError(Exception):
    pass


@dataclass
class ExploiterResultData:
    exploitation_success: bool = False
    propagation_success: bool = False
    interrupted: bool = False
    os: str = ""
    info: Mapping = field(default_factory=lambda: {})
    attempts: Iterable = field(default_factory=lambda: [])
    error_message: str = ""


@dataclass(frozen=True)
class FingerprintData:
    os_type: Optional[OperatingSystem]
    os_version: str
    services: Mapping = field(default_factory=lambda: {})


@dataclass(frozen=True)
class PingScanData:
    response_received: bool
    os: Optional[OperatingSystem]


@dataclass(frozen=True)
class PortScanData:
    port: int
    status: PortStatus
    banner: str
    service: str


@dataclass(frozen=True)
class PostBreachData:
    display_name: str
    command: str
    result: Tuple[str, bool]


class IPuppet(metaclass=abc.ABCMeta):
    @abc.abstractmethod
    def load_plugin(self, plugin_name: str, plugin: object, plugin_type: PluginType) -> None:
        """
        Loads a plugin into the puppet

        :param str plugin_name: The plugin class name
        :param object plugin: The plugin object to load
        :param PluginType plugin_type: The type of plugin being loaded
        """

    @abc.abstractmethod
    def run_credential_collector(self, name: str, options: Dict) -> Sequence[Credentials]:
        """
        Runs a credential collector

        :param str name: The name of the credential collector to run
        :param Dict options: A dictionary containing options that modify the behavior of the
                             Credential collector
        :return: A sequence of Credentials that have been collected from the system
        :rtype: Sequence[Credentials]
        """

    @abc.abstractmethod
    def run_pba(self, name: str, options: Dict) -> Iterable[PostBreachData]:
        """
        Runs a post-breach action (PBA)

        :param str name: The name of the post-breach action to run
        :param Dict options: A dictionary containing options that modify the behavior of the PBA
        :rtype: Iterable[PostBreachData]
        """

    @abc.abstractmethod
    def ping(self, host: str, timeout: float) -> PingScanData:
        """
        Sends a ping (ICMP packet) to a remote host

        :param str host: The domain name or IP address of a host
        :param float timeout: The maximum amount of time (in seconds) to wait for a response
        :return: The data collected by attempting to ping the target host
        :rtype: PingScanData
        """

    @abc.abstractmethod
    def scan_tcp_ports(
        self, host: str, ports: List[int], timeout: float = 3
    ) -> Mapping[int, PortScanData]:
        """
        Scans a list of TCP ports on a remote host

        :param str host: The domain name or IP address of a host
        :param int ports: List of TCP port numbers to scan
        :param float timeout: The maximum amount of time (in seconds) to wait for a response
        :return: The data collected by scanning the provided host:ports combination
        :rtype: Mapping[int, PortScanData]
        """

    @abc.abstractmethod
    def fingerprint(
        self,
        name: str,
        host: str,
        ping_scan_data: PingScanData,
        port_scan_data: Dict[int, PortScanData],
        options: Dict,
    ) -> FingerprintData:
        """
        Runs a specific fingerprinter to attempt to gather detailed information about a host and its
        services

        :param str name: The name of the fingerprinter to run
        :param str host: The domain name or IP address of a host
        :param PingScanData ping_scan_data: Data retrieved from the target host via ICMP
        :param Dict[int, PortScanData] port_scan_data: Data retrieved from the target host via a TCP
                                                       port scan
        :param Dict options: A dictionary containing options that modify the behavior of the
                             fingerprinter
        :return: Detailed information about the target host
        :rtype: FingerprintData
        """

    @abc.abstractmethod
    def exploit_host(
        self,
        name: str,
        host: VictimHost,
        current_depth: int,
        servers: Sequence[str],
        options: Dict,
        interrupt: threading.Event,
    ) -> ExploiterResultData:
        """
        Runs an exploiter against a remote host

        :param str name: The name of the exploiter to run
        :param VictimHost host: A VictimHost object representing the target to exploit
        :param int current_depth: The current propagation depth
        :param Dict options: A dictionary containing options that modify the behavior of the
                             exploiter
        :param threading.Event interrupt: A threading.Event object that signals the exploit to stop
                                          executing and clean itself up.
        :return: True if exploitation was successful, False otherwise
        :rtype: ExploiterResultData
        """

    @abc.abstractmethod
    def run_payload(self, name: str, options: Dict, interrupt: threading.Event):
        """
        Runs a payload

        :param str name: The name of the payload to run
        :param Dict options: A dictionary containing options that modify the behavior of the payload
        :param threading.Event interrupt: A threading.Event object that signals the payload to stop
                                          executing and clean itself up.
        """

    @abc.abstractmethod
    def cleanup(self) -> None:
        """
        Revert any changes made to the system by the puppet.
        """
