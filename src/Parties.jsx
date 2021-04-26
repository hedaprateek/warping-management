import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';
import axios from 'axios';
import React, { useState } from 'react';
import DraggableDialog from './DraggableDialog';
import { FormField, InputSelect, InputText } from './FormElements';
import TableComponent from './TableComponent';

function PartiesDialog({ ...props }) {
  const defaults = {
    isWeaver: 'Party'
  }
  const [partyValue, setPartyValue] = useState(defaults);

  function updatePartyValues(e) {
    setPartyValue((prevValue) => {
      if (e.target.id) {
      return { ...prevValue, [e.target.id]: e.target.value };
      } else {
              return { ...prevValue, [e.target.name]: e.target.value };
      }
    });
  }

  return (
    <DraggableDialog
      sectionTitle="Party"
      {...props}
      onSave={() => {
        props.onSave(partyValue);
      }}
    >
      <Grid container spacing={2}>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <InputText label="Name" id="name" value={partyValue.name}
            onChange={updatePartyValues} autoFocus />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <InputText label="Contact" id="contact" value={partyValue.contact}
            onChange={updatePartyValues} />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <InputText label="GSTIN" id="gstin" value={partyValue.gstin}
            onChange={updatePartyValues} />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <InputSelect label="Client type" id="isWeaver" value={partyValue.isWeaver} onChange={updatePartyValues}
            options={[
              {label: 'Party', value: 'Party'},
              {label: 'Weaver', value: 'Weaver'},
            ]}/>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <InputText multiline rows={4} fullWidth label="Address" id="address" value={partyValue.address}
            onChange={updatePartyValues} />
        </Grid>
      </Grid>
    </DraggableDialog>
  );

}

class Parties extends React.Component {
  componentDidMount() {
    axios.get(`http://localhost:7227/api/parties`).then((res) => {
      const parties = res.data;
      this.setState({ parties });
      console.log('parties', parties);
    });
  }

  state = {
    radioValue: 'Yes',
    parties: [],
    filter: '',
    dialogOpen: false,
    columns: [
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
  };

  showDialog(show) {
    this.setState({ dialogOpen: show });
  }

  saveDetails(partyValue) {
    console.log(partyValue);

    axios
      .post(`http://localhost:7227/api/parties`, partyValue, {
        headers: {
          'content-type': 'application/json',
        },
      })
      .then((res) => {
        const parties = this.state.parties;
        const latestData = res.data;
        // this.state.parties.push(latestData);
        this.setState((prevState) => {
          return { parties: [...prevState.parties, latestData] };
        });
      });


    this.showDialog(false);
  }

  render() {
    return (
      <Box>
        <Box p={1}>
          <Box display="flex">
            <InputText placeholder="Search..." value={this.state.filter} style={{minWidth: '250px'}}
              onChange={(e)=>this.setState({filter: e.target.value})} />
            <Button
              variant="contained"
              color="primary"
              onClick={() => this.showDialog(true)}
              style={{marginLeft: '0.5rem'}}
            >
              Add party
            </Button>
          </Box>
        </Box>
        <Box>
          <TableComponent
            columns={this.state.columns}
            data={this.state.parties}
            filterText={this.state.filter}
          />
        </Box>
        <PartiesDialog
          open={this.state.dialogOpen}
          onClose={() => this.showDialog(false)}
          onSave={(partyValue) => this.saveDetails(partyValue)}
        />
      </Box>
    );
  }
}

export default Parties;
