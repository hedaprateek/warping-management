import {
  Button,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from '@material-ui/core';
import axios from 'axios';
import React, { useState } from 'react';
import DraggableDialog from './DraggableDialog';
import SelectComponent from './selectComponent';
import TableComponent from './TableComponent';

function InwardDialog({ ...props }) {
  const [inwardValue, setInwardValue] = useState({});

  function updateInwardValues(e) {
    setInwardValue((prevValue) => {
      return { ...prevValue, [e.target.id]: e.target.value };
    });
  }

  function callbackFromChild(childData) {
    setInwardValue((prevValue) => {
      return { ...prevValue, [childData.id]: childData.value };
    });
  }

  return (
    <DraggableDialog
      sectionTitle="Inward"
      {...props}
      onSave={() => {
        props.onSave(inwardValue);
      }}
    >
      <SelectComponent
        selectionOptions={props.qualities.map((quality) => ({
          label: quality.name,
          value: quality.id,
          id: 'qualityId',
        }))}
        parentCallback={callbackFromChild}
      />
      <br />
      <SelectComponent
        selectionOptions={props.parties.map((party) => ({
          label: party.name,
          value: party.id,
          id: 'partyId',
        }))}
        parentCallback={callbackFromChild}
      />
      <br />
      <Grid container spacing={2}>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <TextField
            label="Date"
            variant="outlined"
            fullWidth
            id="date"
            value={inwardValue.date}
            onChange={updateInwardValues}
          />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <TextField
            label="Gatepass"
            variant="outlined"
            fullWidth
            id="gatepass"
            value={inwardValue.desc}
            onChange={updateInwardValues}
          />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <TextField
            label="Quantity bags"
            variant="outlined"
            fullWidth
            id="qtyBags"
            value={inwardValue.name}
            onChange={updateInwardValues}
          />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <TextField
            label="Quantity Cones"
            variant="outlined"
            fullWidth
            id="qtyCones"
            value={inwardValue.desc}
            onChange={updateInwardValues}
          />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <TextField
            label="Lot Number"
            variant="outlined"
            fullWidth
            id="lotNo"
            value={inwardValue.name}
            onChange={updateInwardValues}
          />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <TextField
            label="Net Weight"
            variant="outlined"
            fullWidth
            id="netWt"
            value={inwardValue.desc}
            onChange={updateInwardValues}
          />
        </Grid>
      </Grid>
    </DraggableDialog>
  );
}
class Inwards extends React.Component {
  componentDidMount() {
    axios.get(`/api/parties`).then((res) => {
      const parties = res.data;
      this.setState({ parties });
      console.log('parties', parties);
    });
    axios.get(`/api/qualities`).then((res) => {
      const qualities = res.data;
      this.setState({ qualities });
      console.log('qualities', qualities);
    });
    axios.get(`/api/inward`).then((res) => {
      const inward = res.data;
      this.setState({ inward });
      console.log('Inward', inward);
    });
  }

  state = {
    parties: [],
    qualities: [],
    inward: [],
    filter: '',
    dialogOpen: false,

    columns: [
      {
        Header: '',
        accessor: 'functionButtons', // accessor is the "key" in the data
      },
      {
        Header: 'DATE',
        accessor: 'date', // accessor is the "key" in the data
      },
      {
        Header: 'PARTY NAME',
        accessor: 'partyId',
        Cell: ({ value }) => {
          let partyName = [];
          if (value) {
            partyName = this.state.parties.filter((party) => {
              if (party.id === value) {
                return party;
              }
            });
          }
          return partyName[0] ? partyName[0].name : '-';
        },
      },
      {
        Header: 'GATEPASS',
        accessor: 'gatepass', // accessor is the "key" in the data
      },
      {
        Header: 'QUALITY NAME',
        accessor: 'qualityId',
        Cell: ({ value }) => {
          let qualityName = [];
          if (value) {
            qualityName = this.state.qualities.filter((quality) => {
              if (quality.id === value) {
                return quality;
              }
            });
          }
          return qualityName[0] ? qualityName[0].name : '-';
        },
      },
      {
        Header: 'QUANTITY BAGS',
        accessor: 'qtyBags', // accessor is the "key" in the data
      },
      {
        Header: 'QUANTITY CONES',
        accessor: 'qtyCones', // accessor is the "key" in the data
      },
      {
        Header: 'LOT NUMBER',
        accessor: 'lotNo',
      },
      {
        Header: 'NET WEIGHT',
        accessor: 'netWt', // accessor is the "key" in the data
      },
    ],
  };

  showDialog(show) {
    this.setState({ dialogOpen: show });
  }

  saveDetails(inwardValue) {
    console.log(inwardValue);

    if (!inwardValue.partyId) {
      inwardValue.partyId = '1';
    }

    if (!inwardValue.qualityId) {
      inwardValue.qualityId = '1';
    }

    axios
      .post(`/api/inward`, inwardValue, {
        headers: {
          'content-type': 'application/json',
        },
      })
      .then((res) => {
        const parties = this.state.parties;
        const latestData = res.data;
        this.setState((prevState) => {
          return { parties: [...prevState.parties, latestData] };
        });
      });

    this.showDialog(false);
  }

  render() {
    return (
      <div>
        <h2>Inwards</h2>

        <Button
          variant="outlined"
          color="primary"
          onClick={() => this.showDialog(true)}
        >
          Add Inward
        </Button>
        <TableComponent
          columns={this.state.columns}
          data={this.state.inward}
          filterText={this.state.filter}
        />
        <InwardDialog
          open={this.state.dialogOpen}
          onClose={() => this.showDialog(false)}
          onSave={(inwardValue) => this.saveDetails(inwardValue)}
          parties={this.state.parties}
          qualities={this.state.qualities}
        />
      </div>
    );
  }
}

export default Inwards;
