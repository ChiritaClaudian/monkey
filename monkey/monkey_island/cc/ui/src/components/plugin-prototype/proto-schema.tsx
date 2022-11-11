import zeroLogon from './exploiters/zeroLogon';
import rdp from './exploiters/rdp';

const protoSchema = {
  'title': 'Prototype configuration',
  'type': 'object',
  'properties': {
    'zero_logon': zeroLogon,
    'rdp': rdp
  }
}

export default protoSchema;
