import Select from 'react-select';

function SelectComponent(props) {

    console.log(props, "prateek");

return (
    <div>
<Select
          className="basic-single"
          classNamePrefix="select"
          defaultValue={props.selectionOptions[0]}
          name="color"
          options={props.selectionOptions}
          menuPortalTarget={document.body}
        //   menuIsOpen="true"
styles={{ menuPortal: base => ({ ...base, zIndex: 9999}) }}        />
</div>

)}

export default SelectComponent;