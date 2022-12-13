import zeroLogon from './exploiters/zeroLogon';
import rdp from './exploiters/rdp';


// We can build this if needed, but there's an additional problem of
// tracking which plugins are where in the schema. Potentially solvable with references


export const pluginSchema = {
    'zerologon': zeroLogon,
    'rdp': rdp
}

// Reactjsonschemaform component pushes default values into the instance if they
// are missing: https://github.com/rjsf-team/react-jsonschema-form/issues/2980
// We need to remove defaults before using the schema
const protoSchema = {
  'title': 'Prototype configuration',
  'type': 'object',
  'properties': {
    'maximum_depth': {
      'type': 'number',
      'default': 10,
    },
    'keep_tunnel_open_time': {
      'type': 'number',
      'default': 20
    },
    'exploiter_plugins': {
      'type': 'object',
      'properties': {
        ...pluginSchema
      }
    }
  }
}

export default protoSchema;
