import Select from 'react-select';
import { useState } from "react";

function SelectComponent(props) {

    function updateValues(e) {
    props.parentCallback(e);
  }

return (
    <div>
<Select
          className="basic-single"
          classNamePrefix="select"
          defaultValue={props.selectionOptions[0]}
          name="color"
          options={props.selectionOptions}
          menuPortalTarget={document.body}
          styles={{ menuPortal: base => ({ ...base, zIndex: 9999}) }}      onChange={updateValues}  />
</div>

)}

export default SelectComponent;