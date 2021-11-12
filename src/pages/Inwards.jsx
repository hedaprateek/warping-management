import { Box, Button, Grid, IconButton } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import DraggableDialog from '../helpers/DraggableDialog';
import {
  InputDate,
  InputSelectSearch,
  InputText,
} from '../components/FormElements';
import TableComponent from '../components/TableComponent';
import EditIcon from '@material-ui/icons/Edit';
import Moment from 'moment';
import { NOTIFICATION_TYPE, setNotification } from '../store/reducers/notification';
import { connect } from 'react-redux';
import { getAxiosErr } from '../utils';

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
      <Grid container spacing={2}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <InputSelectSearch
            value={getSelectValue(props.parties, inwardValue.partyId)}
            onChange={(value) => {
              updateInwardValues(value?.value, 'partyId');
            }}
            options={props.parties
              .filter((p) => p.isWeaver === 'Party')
              .map((party) => ({ label: party.name, value: party.id }))}
            label="Party"
            errorMsg={validator.message('Party', inwardValue.partyId, 'required')}
            autoFocus
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item lg={6} md={6} sm={12} xs={12}>
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
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <InputText
            label="Quality Company"
            variant="outlined"
            fullWidth
            id="qualityComp"
            value={inwardValue.qualityComp}
            onChange={updateInwardValues}
          />
        </Grid>
      </Grid>
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
            isRequired={true}
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
      <Grid container spacing={2}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <InputText
            label="Notes"
            variant="outlined"
            fullWidth
            id="notes"
            value={inwardValue.notes}
            onChange={updateInwardValues}
          />
        </Grid>
      </Grid>
    </DraggableDialog>
  );
}
class Inwards extends React.Component {
  constructor() {
    super();
    this.getInwards = this.getInwards.bind(this);
  }
  componentDidMount() {
    let p1 = axios
      .get(`/api/parties`)
      .then((res) => {
        const parties = res.data;
        const partiesOpts = parties.filter((a)=>a.isWeaver=='Party').map((p)=>({label: p.name, value: p.id}));
        this.setState({ parties, partiesOpts });
      })
      .catch((err) => {
        console.log(err);
      });
    let p2 = axios
      .get(`/api/qualities`)
      .then((res) => {
        const qualities = res.data;
        this.setState({ qualities });
      })
      .catch((err) => {
        console.log(err);
      });

    // Promise.all([p1, p2]).then(() => {
    //   axios
    //     .get(`/api/inward`)
    //     .then((res) => {
    //       const inward = res.data;
    //       this.setState({ inward });
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // });
  }

  editInward(row) {
    this.showDialog(true);
    if (row && row.values) this.state.editModeInwardValue = row.original;
  }

  getInwards() {
    axios.get(`/api/inward`, {
      params: {
        partyId: this.state.partyId,
      }
    }).then((res) => {
      const inward = res.data;
      this.setState({ inward });
    });
  }


  state = {
    editModeInwardValue: [],
    parties: [],
    qualities: [],
    inward: [],
    filter: '',
    partiesOpts: [],
    partyId: null,
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
        Header: 'Date',
        accessor: 'date',
        Cell:({value})=>{
          return Moment(value).format('DD-MM-YYYY');
        },
        width: 100,
      },
      {
        Header: 'Party Name',
        accessor: (row) => {
          let partyName = [];
          if (row.partyId) {
            partyName = this.state.parties.filter((party) => {
              if (party.id === row.partyId) {
                return party;
              }
            });
          }
          return partyName[0] ? partyName[0].name : '-';
        },
        width: 300,
      },
      {
        Header: 'Gatepass No.',
        accessor: 'gatepass',
        width: 130,
      },
      {
        Header: 'Quality Name',
        accessor: (row) => {
          let qualityName = [];
          if (row.qualityId) {
            qualityName = this.state.qualities.filter((quality) => {
              if (quality.id === row.qualityId) {
                return quality;
              }
            });
          }
          return qualityName[0] ? qualityName[0].name : '-';
        },
        width: 180,
      },
      {
        Header: 'Quality Company',
        accessor: 'qualityComp',
        width: 130,
      },
      {
        Header: 'Bags/Boxes',
        accessor: 'qtyBags',
        width: 130,
      },
      {
        Header: 'No of Cones',
        accessor: 'qtyCones',
        width: 130,
      },
      {
        Header: 'Lot No.',
        accessor: 'lotNo',
        width: 130,
      },
      {
        Header: 'Net Weight (Kg)',
        accessor: 'netWt',
        width: 130,
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
            this.props.setNotification(NOTIFICATION_TYPE.SUCCESS, 'Inward updated succesfully');
            let indx = this.setState((prevState) => {
              let indx = prevState.inward.findIndex(
                (i) => i.id === inwardValue.id
              );
              return {
                inward: [
                  ...prevState.inward.slice(0, indx),
                  inwardValue,
                  ...prevState.inward.slice(indx + 1),
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
          .post(`/api/inward`, inwardValue, {
            headers: {
              'content-type': 'application/json',
            },
          })
          .then((res) => {
            this.props.setNotification(NOTIFICATION_TYPE.SUCCESS, 'Inward added succesfully');
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
      <Box display="flex" flexDirection="column" height="100%">
        <Box p={1}>
          <Grid container spacing={2}>
            <Grid item md={3} xs={12}>
              <InputSelectSearch
                value={this.state.partiesOpts.filter(
                  (party) => party.value === this.state.partyId
                )}
                onChange={(op) => this.setState({ partyId: op?.value })}
                options={this.state.partiesOpts}
                label="Party"
                isClearable
              />
            </Grid>
            <Grid item md={3} xs={12}>
            </Grid>
          </Grid>
        </Box>
        <Box p={1}>
          <Box display="flex">
            <Button
              variant="outlined"
              color="primary"
              onClick={this.getInwards}
              disabled={!this.state.partyId}
            >
              Get data
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                this.setState({ editModeInwardValue: null });
                this.showDialog(true);
              }}
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
          sortBy={[
            {
                id: 'date',
                desc: false
            }
          ]}
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
      </Box>
    );
  }
}

export default connect(()=>({}), (dispatch)=>({
  setNotification: (...args)=>{dispatch(setNotification.apply(this, args))},
}))(Inwards);
