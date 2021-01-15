import json

from monkey_island.cc.database import mongo
from monkey_island.cc.models.zero_trust.scoutsuite_data_json import ScoutSuiteDataJson
from ...zero_trust.scoutsuite_findings.consts.findings_list import SCOUTSUITE_FINDINGS
from ...zero_trust.scoutsuite_findings.data_parsing.rule_parser import RuleParser
from ...zero_trust.scoutsuite_findings.scoutsuite_zt_finding_service import ScoutSuiteZTFindingService
from ...zero_trust.scoutsuite_findings.scoutsuite_rule_service import ScoutSuiteRuleService


def process_scoutsuite_telemetry(telemetry_json):
    # Encode data to json, because mongo can't save it as document (invalid document keys)
    telemetry_json['data'] = json.dumps(telemetry_json['data'])
    ScoutSuiteDataJson.add_scoutsuite_data(telemetry_json['data'])
    scoutsuite_data = json.loads(telemetry_json['data'])['data']
    create_scoutsuite_findings(scoutsuite_data)
    update_data(telemetry_json)


def create_scoutsuite_findings(scoutsuite_data):
    for finding in SCOUTSUITE_FINDINGS:
        for rule in finding.rules:
            rule_data = RuleParser.get_rule_data(scoutsuite_data, rule)
            rule = ScoutSuiteRuleService.get_rule_from_rule_data(rule_data)
            ScoutSuiteZTFindingService.process_rule(finding, rule)


def update_data(telemetry_json):
    mongo.db.scoutsuite.insert_one(
        {'guid': telemetry_json['monkey_guid']},
        {'results': telemetry_json['data']})
