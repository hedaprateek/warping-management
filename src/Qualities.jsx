import { Button, FormControlLabel, Grid, Radio, TextField } from "@material-ui/core";
import axios from "axios";
import React, { useState } from "react";
import DraggableDialog from "./DraggableDialog";
import TableComponent from "./TableComponent";

function QualitiesDialog({ ...props }) {

  const [qualityValue, setQualityValue] = useState({});

  function updateQualityValues(e) {

    setQualityValue((prevValue) => {
      return { ...prevValue, [e.target.id]: e.target.value }
    });
  }

  return (
    <DraggableDialog sectionTitle="Quality"  {...props} onSave={() => { props.onSave(qualityValue) }}>
      <Grid container spacing={2}>
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
class Qualities extends React.Component {
  componentDidMount() {
    axios.get(`http://localhost:7227/api/qualities`)
      .then(res => {
        const qualities = res.data;
        this.setState({ qualities });
        console.log("qualities", qualities)
      })
  }

  state = {
    radioValue: 'Yes',
    qualities: [],
    filter: "",
    dialogOpen: false,

    columns: [
      {
        Header: 'NAME',
        accessor: 'name', // accessor is the "key" in the data
      },
      {
        Header: 'DESCRIPTION',
        accessor: 'desc',
      },
    ],
  }

  showDialog(show) {
    this.setState({ dialogOpen: show });
  }

  saveDetails(qualityValue) {
    console.log(qualityValue);

    axios.post(`http://localhost:7227/api/qualities`, qualityValue, {
      headers: {
        'content-type': 'application/json',
      },
    })
      .then(res => {
        const qualities = this.state.qualities;
        const latestData = res.data;
        this.setState((prevState) => {
          return {
            qualities: [
              ...prevState.qualities, latestData
            ]
          }
        })
      })

    this.showDialog(false);
  }

  render() {
    return <div>
      <h2>Qualities</h2>
      <Button variant="outlined" color="primary" onClick={() => this.showDialog(true)}>
        Add Quality
      </Button>
      <TableComponent columns={this.state.columns} data={this.state.qualities} filterText={this.state.filter} />
      <QualitiesDialog open={this.state.dialogOpen} onClose={() => this.showDialog(false)} onSave={(qualityValue) => this.saveDetails(qualityValue)} />
    </div>;
  }
}


export default Qualities;
