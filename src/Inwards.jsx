import { Button, FormControlLabel, Grid, Radio, RadioGroup, TextField } from "@material-ui/core";
import zIndex from "@material-ui/core/styles/zIndex";
import axios from "axios";
import React, { useState } from "react";
import DraggableDialog from "./DraggableDialog";
import SelectComponent from "./selectComponent";
import TableComponent from "./TableComponent";


function InwardDialog({ ...props }) {

  const colourOptions = [
  { value: 'ocean', label: 'Ocean', color: '#00B8D9', isFixed: true },
  { value: 'blue', label: 'Blue', color: '#0052CC', isDisabled: true },
  { value: 'purple', label: 'Purple', color: '#5243AA' },
  { value: 'red', label: 'Red', color: '#FF5630', isFixed: true },
  { value: 'orange', label: 'Orange', color: '#FF8B00' },
  { value: 'yellow', label: 'Yellow', color: '#FFC400' },
  { value: 'green', label: 'Green', color: '#36B37E' },
  { value: 'forest', label: 'Forest', color: '#00875A' },
  { value: 'slate', label: 'Slate', color: '#253858' },
  { value: 'silver', label: 'Silver', color: '#666666' },
];

  const [qualityValue, setQualityValue] = useState({});

  function updateQualityValues(e) {

    setQualityValue((prevValue) => {
      return { ...prevValue, [e.target.id]: e.target.value }
    });
  }

  return (
    <DraggableDialog sectionTitle="Inward"  {...props} onSave={() => { props.onSave(qualityValue) }} >

        <SelectComponent colourOptions = {colourOptions}/>
        <br/>


      <Grid container spacing={2}>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <TextField label="Name" variant="outlined" fullWidth id="name" value={qualityValue.name} onChange={updateQualityValues} />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <TextField label="Description" variant="outlined" fullWidth id="desc" value={qualityValue.desc} onChange={updateQualityValues} />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <TextField label="Name" variant="outlined" fullWidth id="name" value={qualityValue.name} onChange={updateQualityValues} />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <TextField label="Description" variant="outlined" fullWidth id="desc" value={qualityValue.desc} onChange={updateQualityValues} />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <TextField label="Name" variant="outlined" fullWidth id="name" value={qualityValue.name} onChange={updateQualityValues} />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <TextField label="Description" variant="outlined" fullWidth id="desc" value={qualityValue.desc} onChange={updateQualityValues} />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <TextField label="Name" variant="outlined" fullWidth id="name" value={qualityValue.name} onChange={updateQualityValues} />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <TextField label="Description" variant="outlined" fullWidth id="desc" value={qualityValue.desc} onChange={updateQualityValues} />
        </Grid>
      </Grid>
    </DraggableDialog>
  );
}
class Inwards extends React.Component {

  

  componentDidMount() {
    axios.get(`/api/parties`)
      .then(res => {
        const parties = res.data;
        this.setState({ parties });
        console.log("parties", parties)
      })
      axios.get(`/api/qualities`)
      .then(res => {
        const qualities = res.data;
        this.setState({ qualities });
        console.log("qualities", qualities)
      })
  }

  state = {
    radioValue: 'Yes',
    parties: [],
    qualities: [],
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


    this.showDialog(false);
  }

  render() {  
    return <div>
      <h2>Inwards</h2>

      <Button variant="outlined" color="primary" onClick={() => this.showDialog(true)}>
        Add Inward
      </Button>
      {/* <TableComponent columns={this.state.columns} data={this.state.qualities} filterText={this.state.filter} /> */}
      <InwardDialog open={this.state.dialogOpen} onClose={() => this.showDialog(false)} onSave={(qualityValue) => this.saveDetails(qualityValue)} />
      </div>;
}
}

export default Inwards;
