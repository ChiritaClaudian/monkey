import React from 'react';
import {Dropdown} from 'react-bootstrap';


const ProtoSelector = (props) => {
  let selectOptions = [];
  for (const [name, plugin] of Object.entries(props.plugins)) {
    selectOptions.push(
      <Dropdown.Item onClick={() => props.onClick(name)}
                     eventKey={`plugin['title']`}>
                     {plugin['title']}</Dropdown.Item>
  )}

  return (
    <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        Select a plugin
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {selectOptions}
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default ProtoSelector;
