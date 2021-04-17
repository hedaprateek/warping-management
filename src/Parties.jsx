import { FormControlLabel, Radio, RadioGroup, TextField } from "@material-ui/core";
import axios from "axios";
import React from "react";
import DraggableDialog from "./modal-dialog";
import TableComponent from "./TableComponent";

class Parties extends React.Component {


  componentDidMount() {
    axios.get(`http://localhost:7227/api/parties`)
      .then(res => {
        const parties = res.data;
        this.setState({ parties });
        console.log("parties", parties)
      })
  }

     state = {
       radioValue: 'Yes',
       parties: [],
       filter: "",
 
    columns : [
       {
         Header: 'NAME',
         accessor: 'name', // accessor is the "key" in the data
       },
       {
         Header: 'ADDRESS',
         accessor: 'address',
       },
       {
         Header: 'GSTIN',
         accessor: 'gstin', // accessor is the "key" in the data
       },
       {
         Header: 'CONTACT',
         accessor: 'contact',
       },
       {
         Header: 'WEAVER',
         accessor: 'isWeaver', // accessor is the "key" in the data
       },
     ],
   
    }

  render() {  
    return <div> 
      <h2>Parties

      </h2>
        <TableComponent columns={this.state.columns} data={this.state.parties} filterText={this.state.filter}/>
        <DraggableDialog body={this.state.dialogBody} sectionTitle="Party"><div>
          <form noValidate autoComplete="off">
      {/* <TextField id="standard-basic" label="Standard" /> */}
      {/* <TextField id="filled-basic" label="Filled" variant="filled" /> */}
      <div><TextField id="outlined-basic" label="Name" variant="outlined" />
      </div><div><TextField id="outlined-basic" label="Address" variant="outlined" />
      </div><div><TextField id="outlined-basic" label="GSTin" variant="outlined" /></div>
      <div><TextField id="outlined-basic" label="Contact" variant="outlined" /></div>
          <RadioGroup aria-label="gender" name="gender1" value={this.state.radioValue}>
        <FormControlLabel value="female" control={<Radio />} label="Female" />
        <FormControlLabel value="male" control={<Radio />} label="Male" />
        </RadioGroup>
    </form>
         {/* <h3>Name :<input type='text' ></input></h3>
         <h3>Address :<input type='text'></input></h3>
         <h3>GSTIn :<input type='text'></input></h3>
         <h3>Contact :<input type='text'></input></h3>
         <h3>IsWeaver :    <input type="radio" id="isWeaverYes"
     name="weaver" value="weaverYes"/>Yes
     <input type="radio" id="isWeaverNo"
     name="weaver" value="weaverNo"/>No
    </h3> */}
         </div></DraggableDialog>
    </div>;
}
}

export default Parties;
