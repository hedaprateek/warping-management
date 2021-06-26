import {
  Box,
  Button,
  Grid,
  IconButton,
} from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import DraggableDialog from '../../helpers/DraggableDialog';
import { FormField, InputSelect, InputText } from '../../components/FormElements'
import TableComponent from '../../components/TableComponent';
import EditIcon from '@material-ui/icons/Edit';
import { NOTIFICATION_TYPE, setNotification } from '../../store/reducers/notification';
import { connect } from 'react-redux';
import { getAxiosErr } from '../../utils';

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
      sectionTitle="Account"
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
            disabled={isEdit}
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
    axios.get(`/api/parties`).then((res) => {
      const parties = res.data;
      this.setState({ parties });
    });
  }

  editParty(row) {
    console.log('Prateek', row);
    this.showDialog(true);
    if (row && row.values) this.state.editModePartyValue = row.original;
  }
  state = {
    isUniqueName: 'true',
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
        Header: 'Party Name',
        accessor: 'name', // accessor is the "key" in the data
      },
      {
        Header: 'Address',
        accessor: 'address',
      },
      {
        Header: 'GSTIN',
        accessor: 'gstin', // accessor is the "key" in the data
      },
      {
        Header: 'Contact No.',
        accessor: 'contact',
      },
      {
        Header: 'Party Type',
        accessor: 'isWeaver', // accessor is the "key" in the data
      },
    ],
  };

  showDialog(show) {
    this.state.isUniqueName = 'true';
    if (!show) {
      this.state.editModePartyValue = [];
    }
    this.setState({ dialogOpen: show });
  }

  saveDetails(partyValue, validator, isEdit) {
    let editPartyName = '';
    if (isEdit) {
      editPartyName = partyValue.name;
    }
    this.state.isUniqueName = 'true';
    let isUniqueNameList = this.state.parties.filter((party) => {
      if (editPartyName) {
        return party?.name?.toUpperCase() === editPartyName.toUpperCase();
      } else {
        return party?.name?.toUpperCase() === partyValue?.name?.toUpperCase();
      }
    });

    if (isUniqueNameList && isUniqueNameList.length > 0) {
      this.state.isUniqueName = 'false';
    }
    if (validator.allValid() && this.state.isUniqueName === 'true') {
      console.log(partyValue);
      this.state.isUniqueName = 'true';
      if (isEdit) {
        axios
          .put(`/api/parties/` + partyValue.id, partyValue, {
            headers: {
              'content-type': 'application/json',
            },
          })
          .then((res) => {
            this.props.setNotification(NOTIFICATION_TYPE.SUCCESS, 'Party updated successfully');
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
          })
          .catch((err)=>{
            console.log(err);
            this.props.setNotification(NOTIFICATION_TYPE.ERROR, getAxiosErr(err));
          });
      } else {
        axios
          .post(`/api/parties`, partyValue, {
            headers: {
              'content-type': 'application/json',
            },
          })
          .then((res) => {
            this.props.setNotification(NOTIFICATION_TYPE.SUCCESS, 'Party added successfully');
            const parties = this.state.parties;
            const latestData = res.data;
            // this.state.parties.push(latestData);
            this.setState((prevState) => {
              return { parties: [...prevState.parties, latestData] };
            });
          })
          .catch((err)=>{
            console.log(err);
            this.props.setNotification(NOTIFICATION_TYPE.ERROR, getAxiosErr(err));
          });
      }
      this.showDialog(false);
    } else {
      validator.showMessages();
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
              Add Account
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

export default connect(()=>({}), (dispatch)=>({
  setNotification: (...args)=>{dispatch(setNotification.apply(this, args))},
}))(Parties);
