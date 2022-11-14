import transformErrors from '../configuration-components/ValidationErrorMessages';
import React, {useState} from 'react';
import protoConfig from './proto-config';
import protoSchema from './proto-schema';
import _ from 'lodash';

// This might be a good opportunity to move back to the official repo
import Form from 'react-jsonschema-form-bs4';
import getUISchema from './proto-ui-schema';
import {formValidationFormats} from '../configuration-components/ValidationFormats';
import ProtoSelector from './proto-selector';


function ProtoConfigPage() {

  const [formData, setFormData] = useState(protoConfig);
  const [selectedPlugin, setSelectedPlugin] = useState(null);

  function updateFormData(newFormData){
    if(! _.isEqual(formData, newFormData.formData)){
      setFormData(newFormData.formData);
    }
  }

  let formProperties = {};
  formProperties['schema'] = protoSchema;
  formProperties['uiSchema'] = getUISchema(selectedPlugin, protoSchema.properties);
  formProperties['onChange'] = updateFormData;
  formProperties['transformErrors'] = transformErrors;
  // Nothing new, we already have these
  formProperties['customFormats'] = formValidationFormats;
  formProperties['liveValidate'] = true;
  formProperties['formData'] = formData;

  return (
    <div style={{marginLeft: "25%"}}>
      <ProtoSelector plugins={protoSchema.properties} onClick={setSelectedPlugin} />
      <Form {...formProperties}></Form>
    </div>
  )
}

export default ProtoConfigPage;
