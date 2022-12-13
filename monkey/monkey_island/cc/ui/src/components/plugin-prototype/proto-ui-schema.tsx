import {ObjectFieldTemplateProps, RJSFSchema} from '@rjsf/utils';
import React, {useState} from 'react';
import ProtoSelector from './proto-selector';
import {pluginSchema} from './proto-schema';

const schema: RJSFSchema = {
  type: "object",
  title: "Object title",
  description: "Object description",
  properties: {
    name: {
      type: "string"
    },
    age: {
      type: "number"
    }
  }
};

export function ObjectFieldTemplate(props: ObjectFieldTemplateProps) {

  let [element, setElement] = useState(null);

  return (
    <div>
      {props.title}
      {props.description}
      <ProtoSelector plugins={pluginSchema} onClick={(pluginName) => {setElement(pluginName)}}/>
      {getPluginDisplay(element, props.properties)}
    </div>
  );
}

function getPluginDisplay(plugin, allPlugins){
  let selectedPlugin = allPlugins.filter((pluginInArray) => pluginInArray.name == plugin)
  if(selectedPlugin.length === 1){
    return <div className="property-wrapper">{selectedPlugin[0].content}</div>
  }
}

const getUISchema = (pluginToShow, allPlugins) => {
  let UISchema = {'exploiter_plugins': {'ui:ObjectFieldTemplate': ObjectFieldTemplate}};
  return UISchema;
};

export default getUISchema;
