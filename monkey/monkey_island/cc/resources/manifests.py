from monkey_island.cc.resources.AbstractResource import AbstractResource


class Manifests(AbstractResource):
    urls = ["/api/plugin/manifests/<string:plugin_type>"]

    def get(self, plugin_type):
        # This returns exploiter type plugins manifests
        # We can't just form a one big manifest describing everything, because some
        # plugins are still legacy

        # IMP should return a pydantic manifest object, but due to the lack of time the
        # implementation of manifest objects is skipped.
        # If you're interested in that, refer to the design doc.
        return {
            "rdp_exploiter": {
                "title": "RDP Exploiter",
                "description": "Exploits RDP connections by brute-forcing. " "Warning! it's slow.",
                "link_to_docs": "www.beef.face",
                "is_safe": True,
                "options": {
                    "scan_timeout": {
                        "description": "How much time to wait between each "
                        "brute-force attempt. Increase to make "
                        "the exploitation process quieter",
                        "title": "RDP timeout",
                    },
                    "rdp_versions": {
                        "all_values": ["1.*", "2.*", "3.*"],
                        "title": "Target versions",
                        "description": "Which versions of RDP this plugin " "should target",
                    },
                },
            }
        }
