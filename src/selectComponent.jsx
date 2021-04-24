import Select from 'react-select';

function SelectComponent(props) {


return (
    <div>
<Select
          className="basic-single"
          classNamePrefix="select"
          defaultValue={props.colourOptions[0]}
          name="color"
          options={props.colourOptions}
          menuPortalTarget={document.body}
styles={{ menuPortal: base => ({ ...base, zIndex: 9999}) }}        />
</div>

)}

export default SelectComponent;