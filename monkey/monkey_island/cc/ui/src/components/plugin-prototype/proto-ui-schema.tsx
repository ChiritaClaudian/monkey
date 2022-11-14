

const getUISchema = (pluginToShow, allPlugins) => {
  let UISchema = {};
  for(const pluginKey in allPlugins){
    if(pluginKey !== pluginToShow){
      UISchema[pluginKey] = {'ui:widget': 'hidden'};
    } else {
      UISchema[pluginKey] = {};
    }
    UISchema[pluginKey]['safe'] = {'ui:widget': 'hidden'}
    // Set this based on checkmark
    UISchema[pluginKey]['enabled'] = {'ui:widget': 'hidden'}
  }
  return UISchema;
};

export default getUISchema;
