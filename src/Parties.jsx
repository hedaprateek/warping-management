import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from '@material-ui/core';
import axios from 'axios';
import React, { useState } from 'react';
import DraggableDialog from './DraggableDialog';
import TableComponent from './TableComponent';

function PartiesDialog({ ...props }) {
  const [partyValue, setPartyValue] = useState({});

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
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            id="name"
            value={partyValue.name}
            onChange={updatePartyValues}
          />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <TextField
            label="Contact"
            variant="outlined"
            fullWidth
            id="contact"
            value={partyValue.contact}
            onChange={updatePartyValues}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <TextField
            label="GSTIN"
            variant="outlined"
            fullWidth
            id="gstin"
            value={partyValue.gstin}
            onChange={updatePartyValues}
          />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <InputLabel id="demo-simple-select-label">Client Type:</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="isWeaver"
            name="isWeaver"
            value={'Please select..'}
            onChange={updatePartyValues}
          >
            <MenuItem value={'Weaver'}>
              Weaver
            </MenuItem>
            <MenuItem value={'Party'}>
              Party
            </MenuItem>
          </Select>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            label="Address"
            variant="outlined"
            multiline
            fullWidth
            rows={4}
            id="address"
            value={partyValue.address}
            onChange={updatePartyValues}
          />
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
      <div>
        <h2>Parties</h2>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => this.showDialog(true)}
        >
          Add party
        </Button>
        <TableComponent
          columns={this.state.columns}
          data={this.state.parties}
          filterText={this.state.filter}
        />
        <PartiesDialog
          open={this.state.dialogOpen}
          onClose={() => this.showDialog(false)}
          onSave={(partyValue) => this.saveDetails(partyValue)}
        />
      </div>
    );
  }
}

export default Parties;
