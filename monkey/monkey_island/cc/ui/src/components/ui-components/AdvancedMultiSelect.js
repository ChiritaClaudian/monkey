import React from 'react';
import {Button, Card} from 'react-bootstrap';

import {cloneDeep} from 'lodash';

import {getDefaultPaneParams, InfoPane, WarningType} from './InfoPane';
import {MasterCheckbox, MasterCheckboxState} from './MasterCheckbox';
import ChildCheckboxContainer from './ChildCheckbox';
import {getFullDefinitionByKey} from './JsonSchemaHelpers';

function AdvancedMultiSelectHeader(props) {
  const {
    title,
    onCheckboxClick,
    checkboxState,
    hideReset,
    onResetClick
  } = props;


  return (
    <Card.Header className="d-flex justify-content-between">
      <MasterCheckbox title={title} onClick={onCheckboxClick} checkboxState={checkboxState}/>
      <Button className={'reset-safe-defaults'} type={'reset'} variant={'warning'}
              hidden={hideReset} onClick={onResetClick}>
        Reset to safe options
      </Button>
    </Card.Header>
  );
}

class AdvancedMultiSelect extends React.Component {
  constructor(props) {
    console.log(props)
    super(props);
    let allPluginNames = this.props.options.enumOptions.map(v => v.value);

    this.state = {
      infoPaneParams: getDefaultPaneParams(
        this.props.schema.items,
        this.isUnsafeOptionSelected(this.getSelectedPluginNames())
      ),
      allPluginNames: allPluginNames,
      masterCheckboxState: this.getMasterCheckboxState(this.getSelectedPluginNames()),
      pluginDefinitions: this.props.schema.items.pluginDefs
    };
  }

  getSelectedPluginNames = () => {
    return this.props.value.map(v => v.name);
  }

  getOptionList = () => {
    return this.props.options.enumOptions.sort(this.compareOptions);
  }

  onChange = (strValues) => {
    let pluginArray = this.namesToPlugins(strValues, this.state.pluginDefinitions);
    this.props.onChange(pluginArray)
  }

  namesToPlugins = (names, allPlugins) => {
    let plugins = [];
    for (let i = 0; i < names.length; i++){
      plugins.push(cloneDeep(allPlugins[names[i]]));
    }
    return plugins
  }

  // Sort options alphabetically. "Unsafe" options float to the top so that they
  // do not get selected and hidden at the bottom of the list.
  compareOptions = (a, b) => {
    // Apparently, you can use additive operators with boolean types. Ultimately,
    // the ToNumber() abstraction operation is called to convert the booleans to
    // numbers: https://tc39.es/ecma262/#sec-tonumeric
    if (this.isSafe(a.value) - this.isSafe(b.value) !== 0) {
      return this.isSafe(a.value) - this.isSafe(b.value);
    }

    return a.value.localeCompare(b.value);
  }

  onMasterCheckboxClick = () => {
    let checkboxState = this.getMasterCheckboxState(this.getSelectedPluginNames());
    if (checkboxState === MasterCheckboxState.ALL) {
      var newValues = [];
    } else {
      newValues = this.getOptionList().map(({value}) => value);
    }

    this.onChange(newValues);
  }

  onChildCheckboxClick = (value) => {
    let selectValues = this.getSelectValuesAfterClick(value);
    this.onChange(selectValues);
  }

  getSelectValuesAfterClick(clickedValue) {
    const valueArray = cloneDeep(this.getSelectedPluginNames());

    if (valueArray.includes(clickedValue)) {
      return valueArray.filter(e => e !== clickedValue);
    } else {
      valueArray.push(clickedValue);
      return valueArray;
    }
  }

  setMasterCheckboxState(selectValues) {
    let newState = this.getMasterCheckboxState(selectValues);
    if (newState !== this.state.masterCheckboxState) {
      this.setState({masterCheckboxState: newState});
    }
  }

  getMasterCheckboxState(selectValues) {
    if (selectValues.length === 0) {
      return MasterCheckboxState.NONE;
    }

    if (selectValues.length !== this.getOptionList().length) {
      return MasterCheckboxState.MIXED;
    }

    return MasterCheckboxState.ALL;
  }

  onResetClick = () => {
  }

  getHideResetState(selectValues) {
    return !(this.isUnsafeOptionSelected(selectValues))
  }

  isUnsafeOptionSelected(selectValues) {
    return !(selectValues.every((value) => this.isSafe(value)));
  }

  isSafe = (itemKey) => {
    // Defaults shouldn't be decided on the UI. Exploiter could be safe but slow,
    // so disabled by default
    return true;
  }

  setPaneInfo = (itemKey) => {
    let definitionObj = getFullDefinitionByKey(this.props.schema.items, itemKey);
    this.setState(
      {
        infoPaneParams: {
          title: definitionObj.title,
          content: definitionObj.info,
          link: definitionObj.link,
          warningType: this.isSafe(itemKey) ? WarningType.NONE : WarningType.SINGLE
        }
      }
    );
  }

  setPaneInfoToSafe() {
    let safePluginNames = this.state.allPluginNames.filter(pluginName => this.isSafe(pluginName));
    this.onChange(safePluginNames);
  }


  render() {
    const {
      autofocus,
      id,
      multiple,
      required,
      schema
    } = this.props;

    return (
      <div className={'advanced-multi-select'} onFocus={this.props.onFocus}>
        <AdvancedMultiSelectHeader title={schema.title}
                                   onCheckboxClick={this.onMasterCheckboxClick}
                                   checkboxState={this.getMasterCheckboxState(
                                     this.getSelectedPluginNames())}
                                   hideReset={this.getHideResetState(
                                     this.getSelectedPluginNames())}
                                   onResetClick={this.onResetClick}/>

        <ChildCheckboxContainer id={id} multiple={multiple} required={required}
                                autoFocus={autofocus} isSafe={this.isSafe}
                                onPaneClick={this.setPaneInfo}
                                onCheckboxClick={this.onChildCheckboxClick}
                                selectedValues={this.getSelectedPluginNames()}
                                enumOptions={this.getOptionList()}/>

        <InfoPane title={this.state.infoPaneParams.title}
                  body={this.state.infoPaneParams.content}
                  link={this.state.infoPaneParams.link}
                  warningType={this.state.infoPaneParams.warningType}/>
      </div>
    );
  }
}

export default AdvancedMultiSelect;
