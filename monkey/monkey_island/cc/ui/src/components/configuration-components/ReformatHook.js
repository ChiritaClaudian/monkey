import {defaultCredentials} from '../../services/configuration/propagation/credentials';
import {PlaintextType, SecretType} from '../utils/CredentialTitle.tsx';
import _ from 'lodash';


export function addExploiterPluginsToSchema(schema, configs, manifests){
  schema['properties']['propagation']['properties']['exploitation']['properties']['brute_force']['items']['pluginDefs'] = getExploiterPluginDefinitions(configs);
  schema['properties']['propagation']['properties']['exploitation']['properties']['brute_force']['items']['anyOf'] = getExploiterSchema(manifests);
  return schema;
}

function getExploiterSchema(manifests) {
  // At the moment we don't have exploiters with nested options.
  // Once we need those, we should put them in a separate sections and show/hide those sections
  // based on the selected plugin. BUT it would require a bigger refactoring of UI and plugin
  // selectors, so postpone it for now.

  let exploiters = [];
  for (const [key, value] of Object.entries(manifests)) {
    exploiters.push({
            'type': 'string',
            'enum': [key],
            'title': value['title'],
            'safe': value['is_safe'],
            'info': value['description'],
            'link': value['link_to_docs']
        });
  }
  return exploiters;
}

function getExploiterPluginDefinitions(configs){
  let definitions = {};
  for (const [key, value] of Object.entries(configs)) {
    definitions[key] = {'name': key, 'options': value}
  }
  return definitions
}


export function reformatConfig(config, reverse = false) {
  let formattedConfig = _.clone(config);

  if (reverse) {
    if (formattedConfig['payloads'].length === 1) {
      // Second click on Export
      formattedConfig['payloads'] = [{
        'name': 'ransomware',
        'options': formattedConfig['payloads'][0]['options']
      }];
    } else {
      formattedConfig['payloads'] = [{
        'name': 'ransomware',
        'options': formattedConfig['payloads']
      }];
    }
    formattedConfig['keep_tunnel_open_time'] = formattedConfig['advanced']['keep_tunnel_open_time'];
  } else {
    if (formattedConfig['payloads'].length !== 0) {
      formattedConfig['payloads'] = formattedConfig['payloads'][0]['options'];
    } else {
      formattedConfig['payloads'] = {'encryption': {}, 'other_behaviors': {}}
    }
    formattedConfig['advanced'] = {};
    formattedConfig['advanced']['keep_tunnel_open_time'] = formattedConfig['keep_tunnel_open_time'];
  }
  return formattedConfig;
}

export function formatCredentialsForForm(credentials) {
  let formattedCredentials = _.cloneDeep(defaultCredentials);
  for (let i = 0; i < credentials.length; i++) {
    let identity = credentials[i]['identity'];
    if (identity !== null) {
      formattedCredentials['exploit_user_list'].push(identity.username)
    }

    let secret = credentials[i]['secret'];
    if (secret !== null) {
      if (Object.prototype.hasOwnProperty.call(secret, SecretType.Password)) {
        formattedCredentials['exploit_password_list'].push(secret[SecretType.Password])
      }
      if (Object.prototype.hasOwnProperty.call(secret, SecretType.NTHash)) {
        formattedCredentials['exploit_ntlm_hash_list'].push(secret[SecretType.NTHash])
      }
      if (Object.prototype.hasOwnProperty.call(secret, SecretType.LMHash)) {
        formattedCredentials['exploit_lm_hash_list'].push(secret[SecretType.LMHash])
      }
      if (Object.prototype.hasOwnProperty.call(secret, SecretType.PrivateKey)) {
        let keypair = {
          'public_key': secret[PlaintextType.PublicKey],
          'private_key': secret[SecretType.PrivateKey]
        }
        formattedCredentials['exploit_ssh_keys'].push(keypair)
      }
    }
  }

  formattedCredentials['exploit_user_list'] = [...new Set(formattedCredentials['exploit_user_list'])];
  formattedCredentials['exploit_password_list'] = [...new Set(formattedCredentials['exploit_password_list'])];
  formattedCredentials['exploit_ntlm_hash_list'] = [...new Set(formattedCredentials['exploit_ntlm_hash_list'])];
  formattedCredentials['exploit_lm_hash_list'] = [...new Set(formattedCredentials['exploit_lm_hash_list'])];

  return formattedCredentials;
}

export function formatCredentialsForIsland(credentials) {
  let formattedCredentials = [];
  let usernames = credentials['exploit_user_list'];
  for (let i = 0; i < usernames.length; i++) {
    formattedCredentials.push({
      'identity': {'username': usernames[i]},
      'secret': null
    })
  }

  formattedCredentials.push(...getFormattedCredentials(credentials['exploit_password_list'], SecretType.Password))
  formattedCredentials.push(...getFormattedCredentials(credentials['exploit_ntlm_hash_list'], SecretType.NTHash))
  formattedCredentials.push(...getFormattedCredentials(credentials['exploit_lm_hash_list'], SecretType.LMHash))

  let ssh_keys = credentials['exploit_ssh_keys'];
  for (let i = 0; i < ssh_keys.length; i++) {
    formattedCredentials.push({
      'identity': null,
      'secret': {
        'private_key': ssh_keys[i]['private_key'],
        'public_key': ssh_keys[i]['public_key']
      }
    })
  }

  return formattedCredentials;
}

function getFormattedCredentials(credentials, keyOfSecret) {
  let formattedCredentials = [];
  for (let i = 0; i < credentials.length; i++) {
    formattedCredentials.push({
      'identity': null,
      'secret': {[keyOfSecret]: credentials[i]}
    })
  }
  return formattedCredentials;
}
