const protoConfig = {
  'zero_logon': {
    'enabled': true,
    // These are not configuration options. The problem is that json-schema describes json,
    // but we don't need 'safe' or 'url' in json
    'safe': false,
    'link': 'www.pork-face.com',
    'plugin_options': {
      'attempt_count': 2000,
      'password_to_set': 'SeCuRe'
    }
  },
  'rdp': {
    'enabled': true,
    // These are not configuration options. The problem is that json-schema describes json,
    // but we don't need 'safe' or 'url' in json
    'safe': false,
    'link': 'www.pork-face.com',
    'plugin_options': {
      'timeout': 2000,
      'rdp_versions': '1, 2'
    }
  }
}

export default protoConfig;
