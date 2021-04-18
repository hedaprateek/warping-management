import { Button, FormControlLabel, Grid, Radio, RadioGroup, TextField } from "@material-ui/core";
import axios from "axios";
import React, { useState } from "react";
import DraggableDialog from "./DraggableDialog";
import TableComponent from "./TableComponent";

function PartiesDialog({...props}) {

  const [partyValue, setPartyValue] = useState({});

  function updatePartyValues(e) {

    setPartyValue((prevValue) => {
      return {...prevValue, [e.target.id]: e.target.value}
    });
  }


  return (
    <DraggableDialog sectionTitle="Party"  {...props} onSave={()=>{props.onSave(partyValue)}}>
      <Grid container spacing={2}>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <TextField label="Name" variant="outlined" fullWidth id="name" value={partyValue.name} onChange={updatePartyValues}/>
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <TextField label="Contact" variant="outlined" fullWidth id="contact" value={partyValue.contact} onChange={updatePartyValues}/>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <TextField label="GSTIN" variant="outlined" fullWidth id="gstin" value={partyValue.gstin} onChange={updatePartyValues}/>
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <TextField label="Weaver ?" variant="outlined" fullWidth id="isWeaver" value={partyValue.weaver} onChange={updatePartyValues}/>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField label="Address" variant="outlined" multiline fullWidth rows={4} id="address" value={partyValue.address} onChange={updatePartyValues}/>
        </Grid>
      </Grid>
    </DraggableDialog>
  );
  //   <div>
  // {/* <TextField id="standard-basic" label="Standard" /> */}
  // {/* <TextField id="filled-basic" label="Filled" variant="filled" /> */}
  // <div><TextField id="outlined-basic" label="Name" variant="outlined" />
  // </div><div><TextField id="outlined-basic" label="Address" variant="outlined" />
  // </div><div><TextField id="outlined-basic" label="GSTin" variant="outlined" /></div>
  // <div><TextField id="outlined-basic" label="Contact" variant="outlined" /></div>
  //   <RadioGroup aria-label="gender" name="gender1" value={this.state.radioValue}>
  // <FormControlLabel value="female" control={<Radio />} label="Female" />
  // <FormControlLabel value="male" control={<Radio />} label="Male" />
  // </RadioGroup>
  // {/* <h3>Name :<input type='text' ></input></h3>
  // <h3>Address :<input type='text'></input></h3>
  // <h3>GSTIn :<input type='text'></input></h3>
  // <h3>Contact :<input type='text'></input></h3>
  // <h3>IsWeaver :    <input type="radio" id="isWeaverYes"
  // name="weaver" value="weaverYes"/>Yes
  // <input type="radio" id="isWeaverNo"
  // name="weaver" value="weaverNo"/>No
  // </h3> */}
  // </div>
}

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
    dialogOpen: false,
    columns : [
      {
        Header: '',
        accessor: 'functionButtons', // accessor is the "key" in the data
      },
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

  showDialog(show) {
    this.setState({dialogOpen: show});
  }

  saveDetails(partyValue) {
    console.log(partyValue);

    axios.post(`http://localhost:7227/api/parties`, partyValue, {
		 headers: {
			  'content-type': 'application/json',
		 },
	})
      .then(res => {
        const parties = this.state.parties;
        const latestData = res.data;
        // this.state.parties.push(latestData);
         this.setState((prevState)=> {
           return {parties: [
             ...prevState.parties, latestData
           ]}
         })
      })
    // axios.post(`http://localhost:7227/api/parties`)
    //   .then(res => {
    //     const parties = res.data;
    //     this.setState({ parties });
    //     console.log("parties", parties)
    //   })

    this.showDialog(false);
  }

  render() {
    return <div>
      <h2>Parties

      </h2>
      <Button variant="outlined" color="primary" onClick={()=>this.showDialog(true)}>
        Add party
      </Button>
      <TableComponent columns={this.state.columns} data={this.state.parties} filterText={this.state.filter}/>
      <PartiesDialog open={this.state.dialogOpen} onClose={()=>this.showDialog(false)} onSave={(partyValue)=>this.saveDetails(partyValue)}/>
    </div>;
}
}

export default Parties;
