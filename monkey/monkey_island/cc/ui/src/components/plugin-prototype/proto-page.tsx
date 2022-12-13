import transformErrors from '../configuration-components/ValidationErrorMessages';
import React, {useState} from 'react';
import protoConfig from './proto-config';
import protoSchema, {pluginSchema} from './proto-schema';
import _ from 'lodash';

// This might be a good opportunity to move back to the official repo
import getUISchema from './proto-ui-schema';
import {formValidationFormats} from '../configuration-components/ValidationFormats';

import validator from '@rjsf/validator-ajv8';
import Form from '@rjsf/bootstrap-4';


function ProtoConfigPage() {

  const [formData, setFormData] = useState(protoConfig);

  function updateFormData(newFormData) {
    if (!_.isEqual(formData, newFormData.formData)) {
      setFormData(newFormData.formData);
    }
    console.log(newFormData)
  }

  let formProperties = {};
  formProperties['schema'] = protoSchema;
  formProperties['uiSchema'] = getUISchema(null, pluginSchema);
  formProperties['onChange'] = updateFormData;
  formProperties['transformErrors'] = transformErrors;
  // Nothing new, we already have these
  formProperties['customFormats'] = formValidationFormats;
  formProperties['liveValidate'] = true;
  formProperties['formData'] = formData;
  formProperties['validator'] = validator;

  return (
    <div style={{marginLeft: '25%'}}>
      <Form {...formProperties}></Form>
    </div>
  )
}

export default ProtoConfigPage;
