import transformErrors from '../configuration-components/ValidationErrorMessages';
import React, {useState} from 'react';
import protoConfig from './proto-config';
import protoSchema from './proto-schema';
import _ from 'lodash';

// This might be a good opportunity to move back to the official repo
import Form from 'react-jsonschema-form-bs4';
import ProtoUISchema from './proto-ui-schema';
import {formValidationFormats} from '../configuration-components/ValidationFormats';

function ProtoConfigPage() {

  const [formData, setFormData] = useState(protoConfig);

  function updateFormData(newFormData){
    if(! _.isEqual(formData, newFormData.formData)){
      setFormData(newFormData.formData);
    }
  }

  let formProperties = {};
  formProperties['schema'] = protoSchema;
  formProperties['uiSchema'] = ProtoUISchema;
  formProperties['onChange'] = updateFormData;
  formProperties['transformErrors'] = transformErrors;
  // Nothing new, we already have these
  formProperties['customFormats'] = formValidationFormats;
  formProperties['liveValidate'] = true;
  formProperties['formData'] = formData;

  return (
    <div style={{marginLeft: "25%"}}>
      <Form {...formProperties}></Form>
    </div>
  )
}

export default ProtoConfigPage;
