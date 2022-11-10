from monkey_island.cc.resources.AbstractResource import AbstractResource


class Plugins(AbstractResource):
    urls = ["/api/plugin/configs/<string:plugin_type>"]

    def get(self, plugin_type):
        # We probably don't need this.
        # Instead of having plugin configs, we could probably just include this into the
        # config upon loading the plugins
        return {
            "rdp_exploiter": {"enabled": True, "scan_timeout": 10, "rdp_versions": ["2.*", "3.*"]}
        }
