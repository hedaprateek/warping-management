import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
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
import React, { useEffect, useState } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import DraggableDialog from './DraggableDialog';
import { FormField, InputSelect, InputText } from './FormElements';
import TableComponent from './TableComponent';
import EditIcon from '@material-ui/icons/Edit';

function PartiesDialog({ open, ...props }) {
  const [validator, setValidator] = useState(new SimpleReactValidator());
  const [isEdit, setIsEdit] = useState(false);
  const editModeParty = props.editModePartyValue;
const isUniqueName = props.isUniqueName;
  const defaults = {
    isWeaver: 'Party',
    name: '',
    contact: '',
    address: '',
    gstin: '',
  };
  const [partyValue, setPartyValue] = useState(defaults);

  useEffect(() => {
    if (editModeParty && editModeParty.id) {
      setIsEdit(true);
      setPartyValue(editModeParty);
    } else {
      setIsEdit(false);
      setPartyValue(defaults);
    }
    setValidator(new SimpleReactValidator());
  }, [open]);

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
      open={open}
      sectionTitle="Party"
      {...props}
      onSave={() => {
        props.onSave(partyValue, validator, isEdit);
      }}
    >
      {isUniqueName == 'false' && <h4>Party name should be unique</h4>}

      <Grid container spacing={2}>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <InputText
            label="Name"
            id="name"
            value={partyValue.name}
            onChange={updatePartyValues}
            autoFocus
            errorMsg={validator.message('Name', partyValue.name, 'required')}
          />
          {/*  {this.validator.message('ipAddress', this.state.ip, 'required|ip:127.0.0.1')} */}
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <InputText
            label="Contact"
            id="contact"
            value={partyValue.contact}
            onChange={updatePartyValues}
            errorMsg={validator.message(
              'Contact',
              partyValue.contact,
              'required|phone'
            )}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <InputText
            label="GSTIN"
            id="gstin"
            value={partyValue.gstin}
            onChange={updatePartyValues}
          />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <InputSelect
            label="Client type"
            id="isWeaver"
            name="isWeaver"
            value={partyValue.isWeaver}
            onChange={updatePartyValues}
            options={[
              { label: 'Party', value: 'Party' },
              { label: 'Weaver', value: 'Weaver' },
            ]}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <InputText
            multiline
            rows={4}
            fullWidth
            label="Address"
            id="address"
            value={partyValue.address}
            onChange={updatePartyValues}
            errorMsg={validator.message(
              'Address',
              partyValue.address,
              'required'
            )}
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

  editParty(row) {
    console.log('Prateek', row);
    this.showDialog(true);
    if (row && row.values) this.state.editModePartyValue = row.original;
  }
  state = {
    isUniqueName: "true",
    editModePartyValue: [],
    radioValue: 'Yes',
    parties: [],
    filter: '',
    dialogOpen: false,
    columns: [
      {
        Header: '',
        accessor: 'editButton',
        id: 'btn-edit',
        Cell: ({ row }) => {
          return (
            <IconButton
              onClick={() => {
                this.editParty(row);
              }}
            >
              <EditIcon />
            </IconButton>
          );
        },
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
    if (!show) {
      this.state.editModeQualityValue = [];
    }
    this.setState({ dialogOpen: show });
  }

  saveDetails(partyValue, validator, isEdit) {
      console.log('qqqqqqqqqqqqqqq');
      // let isUniqueName = true;
      let isUniqueName = this.state.parties.filter((party) => party.name === partyValue.name)
        // if (partyValue.name === party.name) {
        //   return false;
        // } 
      

      console.log("isUni", isUniqueName);

      if (isUniqueName && isUniqueName.length >0) {
        this.state.isUniqueName = "false";
      }

      if (validator.allValid() && this.state.isUniqueName === "false") {
        console.log(partyValue);

        if (isEdit) {
          axios
            .put(`/api/parties/` + partyValue.id, partyValue, {
              headers: {
                'content-type': 'application/json',
              },
            })
            .then((res) => {
              let indx = this.setState((prevState) => {
                let indx = prevState.parties.findIndex(
                  (i) => i.id === partyValue.id
                );
                return {
                  parties: [
                    ...prevState.parties.slice(0, indx),
                    partyValue,
                    ...prevState.parties.slice(indx + 1),
                  ],
                };
              });
            });
        } else {
          axios
            .post(`/api/parties`, partyValue, {
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
        }
        this.showDialog(false);
      } else {
        if (validator.allValid()) {
          validator.message('name', 'aaaaa', 'required')
          // validator.message(name: "asssas");
          validator.showMessages();
          console.log("abc");
          this.forceUpdate();
        } 
        validator.showMessages();
        // rerender to show messages for the first time
        // you can use the autoForceUpdate option to do this automatically`
        this.forceUpdate();
      }
  }

  render() {
    return (
      <Box>
        <Box p={1}>
          <Box display="flex">
            <InputText
              placeholder="Search..."
              value={this.state.filter}
              style={{ minWidth: '250px' }}
              onChange={(e) => this.setState({ filter: e.target.value })}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => this.showDialog(true)}
              style={{ marginLeft: '0.5rem' }}
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
          onSave={(partyValue, validator, isEdit) =>
            this.saveDetails(partyValue, validator, isEdit)
          }
          isUniqueName={this.state.isUniqueName}
          editModePartyValue={this.state.editModePartyValue}
        />
      </Box>
    );
  }
}

export default Parties;
