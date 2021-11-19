import { Box, Button, Grid, IconButton, MenuItem, Select as MUISelect } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import DraggableDialog from '../helpers/DraggableDialog';
import {
  FormField,
  InputDate,
  InputSelectSearch,
  InputText,
} from '../components/FormElements';
import Moment from 'moment';
import { NOTIFICATION_TYPE, setNotification } from '../store/reducers/notification';
import { connect } from 'react-redux';
import { getAxiosErr, getDatesForType } from '../utils';
import { ResultsTable } from '../components/ResultsTable';

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
  async componentDidMount() {
    await axios
      .get(`/api/parties`)
      .then((res) => {
        const parties = res.data;
        const partiesOpts = parties.filter((a)=>a.isWeaver=='Party').map((p)=>({label: p.name, value: p.id}));
        this.setState({ parties, partiesOpts });
      })
      .catch((err) => {
        console.log(err);
      });
    await axios
      .get(`/api/qualities`)
      .then((res) => {
        const qualities = res.data;
        this.setState({ qualities });
      })
      .catch((err) => {
        console.log(err);
      });

    let [from_date, to_date] = getDatesForType(this.state.date_type);
    this.setState({
      from_date: from_date, to_date: to_date,
    }, ()=>{
      this.getInwards();
    });
  }

  componentDidUpdate(_prevProps, prevState) {
    if(prevState.date_type != this.state.date_type) {
      let [from_date, to_date] = getDatesForType(this.state.date_type);
      this.setState({
        from_date: from_date, to_date: to_date,
      });
    }
  }

  editInward(row) {
    if (row) {
      this.setState({editModeInwardValue: row});
    }
    this.showDialog(true);
  }

  getInwards() {
    axios.get(`/api/inward`, {
      params: {
        partyId: this.state.partyId,
        from_date: this.state.from_date,
        to_date: this.state.to_date,
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
    date_type: 'current-m',
    from_date: new Date(),
    to_date: new Date(),
    columns: [
      {
        name: 'Date',
        key: 'date',
        formatter: ({row, column})=>{
          return Moment(row[column.key]).format('DD/MM/YYYY');
        },
      },
      {
        name: 'Party Name',
        key: 'partyId',
        formatter: ({row})=>{
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
        resizable: true,
      },
      {
        name: 'Gatepass No.',
        key: 'gatepass',
        resizable: true,
      },
      {
        name: 'Quality Name',
        key: 'qualityId',
        formatter: ({row}) => {
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
        width: 250,
        resizable: true,
      },
      {
        name: 'Quality Company',
        key: 'qualityComp',
        width: 200,
        resizable: true,
      },
      {
        name: 'Bags/Boxes',
        key: 'qtyBags',
        resizable: true,
      },
      {
        name: 'No of Cones',
        key: 'qtyCones',
        resizable: true,
      },
      {
        name: 'Lot No.',
        key: 'lotNo',
        resizable: true,
      },
      {
        name: 'Net Weight (Kg)',
        key: 'netWt',
        resizable: true,
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
        <Box p={1} paddingTop={0.5}>
          <Grid container spacing={1}>
            <Grid item md={3} xs={12}>
              <FormField label="Date Type">
                <MUISelect
                  value={this.state.date_type}
                  onChange={(e) => this.setState({date_type:  e.target.value})}
                  variant="outlined"
                  name="date_type"
                  margin="dense"
                  fullWidth
                >
                  <MenuItem value={'current-f'}>Current financial year</MenuItem>
                  <MenuItem value={'current-m'}>Current month</MenuItem>
                  <MenuItem value={'last-m'}>Last month</MenuItem>
                  <MenuItem value={'custom-date'}>Custom date range</MenuItem>
                </MUISelect>
              </FormField>
            </Grid>
            <Grid item md={2} xs={12}>
              <InputDate
                label="From Date"
                value={this.state.from_date}
                onChange={(value) => {
                  this.setState({from_date: value});
                }}
              />
            </Grid>
            <Grid item md={2} xs={12}>
              <InputDate
                label="To Date"
                value={this.state.to_date}
                onChange={(value) => {
                  this.setState({to_date: value});
                }}
              />
            </Grid>
          </Grid>
        </Box>
        <Box p={1}>
          <Box display="flex">
            <Button
              variant="outlined"
              color="primary"
              onClick={this.getInwards}
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
        <Box flexGrow="1" p={1}>
          <ResultsTable
            columns={this.state.columns}
            rows={this.state.inward}
            onEditClick={this.editInward.bind(this)}/>
        </Box>
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
