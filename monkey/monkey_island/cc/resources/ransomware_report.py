from flask import jsonify

from monkey_island.cc.repositories import IAgentEventRepository, IMachineRepository
from monkey_island.cc.resources.AbstractResource import AbstractResource
from monkey_island.cc.resources.request_authentication import jwt_required
from monkey_island.cc.services.ransomware import ransomware_report


class RansomwareReport(AbstractResource):
    urls = ["/api/report/ransomware"]

    def __init__(
        self, event_repository: IAgentEventRepository, machine_repository: IMachineRepository
    ):
        self._event_repository = event_repository
        self._machine_repository = machine_repository

    @jwt_required
    def get(self):
        return jsonify(
            {
                "propagation_stats": ransomware_report.get_propagation_stats(
                    self._event_repository, self._machine_repository
                ),
            }
        )
