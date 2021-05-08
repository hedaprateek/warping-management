import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
} from '@material-ui/core';
import { KeyboardDatePicker } from '@material-ui/pickers';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import DraggableDialog from './DraggableDialog';
import { InputDate, InputSelectSearch, InputText } from './FormElements';
import TableComponent from './TableComponent';
import EditIcon from '@material-ui/icons/Edit';

function InwardDialog({ open, ...props }) {
  const [validator, setValidator] = useState(new SimpleReactValidator());

  const [isEdit, setIsEdit] = useState(false);
  const editModeInward = props.editModeInwardValue;
  // const isEdit = false;
  const defaults = {
    partyId: '',
    qualityId: '',
    date: new Date(),
  };
  const [inwardValue, setInwardValue] = useState(defaults);

  function updateInwardValues(e, id) {
    if (e?.target) {
      setInwardValue((prevValue) => {
        return { ...prevValue, [e.target.id]: e.target.value };
      });
    } else if (e && id === 'date') {
      setInwardValue((prevValue) => {
        return { ...prevValue, date: e.toDateString() };
      });
    } else {
      setInwardValue((prevValue) => {
        return { ...prevValue, [id]: e };
      });
    }
  }

  function callbackFromChild(childData) {
    setInwardValue((prevValue) => {
      return { ...prevValue, [childData.id]: childData.value };
    });
  }

  const getSelectValue = (options, value) => {
    let selectVal = options.filter((option) => option.id === value)[0];
    if (selectVal) {
      selectVal = {
        label: selectVal.name,
        value: selectVal.id,
      };
    }
    return selectVal;
  };

  useEffect(() => {
    console.log('editModeInward', editModeInward);
    if (editModeInward && editModeInward.id) {
      setIsEdit(true);
      setInwardValue(editModeInward);
    } else {
      setIsEdit(false);
      setInwardValue(defaults);
    }
    setValidator(new SimpleReactValidator());
  }, [open]);

  return (
    <DraggableDialog
      sectionTitle="Inward"
      open={open}
      {...props}
      onSave={() => {
        props.onSave(inwardValue, validator, isEdit);
      }}
    >
      <InputSelectSearch
        value={getSelectValue(props.parties, inwardValue.partyId)}
        onChange={(value) => {
          updateInwardValues(value.value, 'partyId');
        }}
        options={props.parties
          .filter((p) => p.isWeaver === 'Party')
          .map((party) => ({ label: party.name, value: party.id }))}
        label="Party"
        errorMsg={validator.message('Party', inwardValue.partyId, 'required')}
      />
      <br />
      <InputSelectSearch
        value={getSelectValue(props.qualities, inwardValue.qualityId)}
        onChange={(value) => {
          updateInwardValues(value.value, 'qualityId');
        }}
        options={props.qualities.map((quality) => ({
          label: quality.name,
          value: quality.id,
        }))}
        label="Quality"
        errorMsg={validator.message(
          'Quality',
          inwardValue.qualityId,
          'required'
        )}
      />

      <br />

      <Grid container spacing={2}>
        <Grid item lg={4} md={4} sm={12} xs={12}>
          <InputDate
            id="date"
            label="Date"
            value={inwardValue.date}
            onChange={(value) => updateInwardValues(value, 'date')}
          />
        </Grid>
        <Grid item lg={4} md={4} sm={12} xs={12}>
          <InputText
            label="Gatepass"
            variant="outlined"
            fullWidth
            id="gatepass"
            value={inwardValue.gatepass}
            onChange={updateInwardValues}
          />
        </Grid>
        <Grid item lg={4} md={4} sm={12} xs={12}>
          <InputText
            label="Lot Number"
            variant="outlined"
            fullWidth
            id="lotNo"
            value={inwardValue.lotNo}
            onChange={updateInwardValues}
          />
        </Grid>
        <Grid item lg={4} md={4} sm={12} xs={12}>
          <InputText
            type="number"
            label="Quantity bags"
            variant="outlined"
            fullWidth
            id="qtyBags"
            value={inwardValue.qtyBags}
            onChange={updateInwardValues}
            errorMsg={validator.message(
              'Quantity bags',
              inwardValue.qtyBags,
              'required|numeric'
            )}
          />
        </Grid>
        <Grid item lg={4} md={4} sm={12} xs={12}>
          <InputText
            type="number"
            label="Quantity Cones"
            variant="outlined"
            fullWidth
            id="qtyCones"
            value={inwardValue.qtyCones}
            onChange={updateInwardValues}
            errorMsg={validator.message(
              'Quantity Cones',
              inwardValue.qtyCones,
              'required|numeric'
            )}
          />
        </Grid>

        <Grid item lg={4} md={4} sm={12} xs={12}>
          <InputText
            type="number"
            label="Net Weight (Kg)"
            variant="outlined"
            fullWidth
            id="netWt"
            value={inwardValue.netWt}
            onChange={updateInwardValues}
            errorMsg={validator.message(
              'Net Weight',
              inwardValue.netWt,
              'required|numeric'
            )}
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

  editInward(row) {
    console.log('Prateek', row);
    this.showDialog(true);
    if (row && row.values) this.state.editModeInwardValue = row.original;
  }

  state = {
    editModeInwardValue: [],
    parties: [],
    qualities: [],
    inward: [],
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
                this.editInward(row);
              }}
            >
              <EditIcon />
            </IconButton>
          );
        },
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
    if (!show) {
      this.state.editModeInwardValue = [];
    }
    this.setState({ dialogOpen: show });
  }

  saveDetails(inwardValue, validator, isEdit) {
    if (validator.allValid()) {
      console.log(inwardValue);

      if (isEdit) {
        axios
          .put(`/api/inward/` + inwardValue.id, inwardValue, {
            headers: {
              'content-type': 'application/json',
            },
          })
          .then((res) => {
            // const parties = this.state.parties;
            // const latestData = res.data;
            let indx = 
            this.setState((prevState) => {
              let indx = prevState.inward.findIndex((i)=>i.id===inwardValue.id);
              return {
                inward: [...prevState.inward.slice(0, indx), inwardValue, ...prevState.inward.slice(indx+1)]
              };
            });
          });
      } else {
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
              return { inward: [...prevState.inward, latestData] };
            });
          });
      }
      this.showDialog(false);
    } else {
      validator.showMessages();
      // rerender to show messages for the first time
      // you can use the autoForceUpdate option to do this automatically`
      this.forceUpdate();
    }
  }

  isEdit = false;

  render() {
    return (
      <div>
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
              Add Inward
            </Button>
          </Box>
        </Box>
        
        <TableComponent
          columns={this.state.columns}
          data={this.state.inward}
          filterText={this.state.filter}
        />
        <InwardDialog
          open={this.state.dialogOpen}
          onClose={() => this.showDialog(false)}
          onSave={(inwardValue, validator, isEdit) =>
            this.saveDetails(inwardValue, validator, isEdit)
          }
          parties={this.state.parties}
          qualities={this.state.qualities}
          editModeInwardValue={this.state.editModeInwardValue}
        />
      </div>
    );
  }
}

export default Inwards;
