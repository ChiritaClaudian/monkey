export const zerologonManifest = {
  'safe': false,
  'name': 'zerologon',
  'link': 'www.pork-face.com',
  'title': 'Zerologon',
  'plugin_type': 'Exploiter',
  'description': 'A dummy exploiter',
  'supported_operating_systems': ['linux', 'windows'],
  'plugin_options': {
    'attempt_count': 2000,
    'password_to_set': 'SeCuRe'
  }
}

export const rdpManifest = {
  'safe': false,
  'name': 'rdp',
  'link': 'www.pork-face.com',
  'title': 'RDP exploiter',
  'plugin_type': 'Exploiter',
  'description': 'A dummy exploiter',
  'supported_operating_systems': ['windows'],
  'plugin_options': {
    'timeout': 2000,
    'rdp_versions': []
  },
  'mode': 'silent',
  'scan_period': 10
}
