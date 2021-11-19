import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  OutlinedInput,
} from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useMemo, useReducer, useState } from 'react';
import DraggableDialog from '../../helpers/DraggableDialog';
import { FormField, InputDate, InputSelect, InputSelectSearch, InputText } from '../../components/FormElements'
import DataGrid from '../../components/DataGrid';
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';
import _ from 'lodash';
import Moment from 'moment';
import {getAxiosErr, parse, round} from './../../utils';
import { NOTIFICATION_TYPE, setNotification } from '../../store/reducers/notification';
import { connect } from 'react-redux';
import { getSetNo } from './Warping';
import ConfirmDialog from '../../helpers/ConfirmDialog';
import { ResultsTable } from '../../components/ResultsTable';

const outwardValueReducer = (state, action)=>{
  let newState = _.cloneDeep(state);
  let rows = null;
  switch(action.type) {
    case 'init':
      newState = action.value;
      break;
    case 'set_value':
      _.set(newState, action.path, action.value);
      if(action.path.indexOf('outwards') > -1) {
        newState = outwardReducer(newState, _.slice(action.path, 0, action.path.indexOf('outwards')+2));
      } else {
        newState = outwardReducer(newState, []);
      }

      break;
    case 'add_grid_row':
      rows = _.get(newState, action.path, []);
      rows.push(action.value);
      _.set(newState, action.path, rows);
      break;
    case 'remove_grid_row':
      rows = _.get(newState, action.path, []);
      rows.splice(action.value, 1);
      _.set(newState, action.path, rows);
      let desInd = action.path.indexOf('outwards');
      if(desInd < action.path.length-1) {
        newState = outwardReducer(newState, _.slice(action.path, 0, action.path.indexOf('outwards')+2));
      }
      break;
  }
  return newState;
}

function outwardReducer(state, path) {
  let qualityData = _.get(state, path, state);
  let totalGrossWt = 0;
  let totalCones = 0;
  (qualityData.bags || []).forEach((q)=>{
    totalGrossWt += parse(q.grossWt);
    totalCones += parse(q.cones);
  });
  qualityData.netWt = totalGrossWt - parse(qualityData.emptyConeWt)*totalCones - parse(qualityData.emptyBagWt);
  _.set(state, path, qualityData);
  return state;
}

function getNumberCell(dataDispatch, basePath, readOnly=false) {
  return ({value, row, column})=>{
    return <InputText
      fullWidth type="number" value={value} readOnly={readOnly}
      size="small"
      margin="dense"
      onChange={(e)=>{
        dataDispatch({
          type: 'set_value',
          path: basePath.concat([row.index, column.id]),
          value: e.target.value,
        })
      }} />
  };
}

function TotalFooter(info) {
  let total = info.rows.reduce((sum, row) => {
      return (parse(row.values[info.column.id]) || 0) + sum
    }, 0
  );
  total = round(total);
  return (
    <InputText
      fullWidth type="number" value={total} readOnly
      size="small"
      margin="dense"
      value={total}
    />
  );
}


function QualityDetails({data, accessPath, dataDispatch, onRemove, onCopy, qualityOpts}) {
  const onChange = (e, name)=>{
    if(e?.target) {
      dataDispatch({
        type: 'set_value',
        path: accessPath.concat(e.target.name),
        value: e.target.value,
        postReducer: outwardReducer,
      });
    } else {
      dataDispatch({
        type: 'set_value',
        path: accessPath.concat(name),
        value: e,
        postReducer: outwardReducer,
      });
    }
  };

  const qualityCols = useMemo(()=>[
    {
      Header: '',
      id: 'id',
      Cell: ({row})=>{
        return <span style={{paddingLeft: '0.25rem', paddingRight: '0.25rem', fontWeight: 'bold'}}>{row.index+1}</span>;
      }
    },
    {
      Header: '',
      id: 'btn-del',
      Cell: ({row})=>{
        return <IconButton onClick={(e)=>{
          e.preventDefault();
          dataDispatch({
            type: 'remove_grid_row',
            path: accessPath.concat('bags'),
            value: row.index,
          });
        }}><DeleteForeverRoundedIcon /></IconButton>
      }
    },
    {
      Header: 'Cones',
      accessor: 'cones',
      Cell: getNumberCell(dataDispatch, accessPath.concat('bags')),
      Footer: TotalFooter,
    },
    {
      Header: 'Gross Weight (Kg)',
      accessor: 'grossWt',
      Cell: getNumberCell(dataDispatch, accessPath.concat('bags')),
      Footer: TotalFooter,
    },
  ], [qualityOpts]);


  return (
    <Card variant="outlined" style={{marginBottom: '0.5rem'}}>
      <CardHeader title="Outward details" titleTypographyProps={{variant: 'h6'}} action={
        <Box>
          <Button color="primary" variant="outlined" onClick={onCopy} style={{marginRight:'0.5rem'}}>Copy</Button>
          <Button color="secondary" variant="outlined" onClick={onRemove}>Remove</Button>
        </Box>
      } />
      <CardContent>
        <Grid container spacing={1}>
          <Grid item lg={6} md={2} sm={12} xs={12}>
            <InputSelectSearch
              label="Quality"
              value={qualityOpts.filter(
                (op) => op.value === data.qualityId
              )}
              onChange={(op)=>onChange(op?.value, 'qualityId')}
              options={qualityOpts}
            />
          </Grid>
          <Grid item lg={6} md={2} sm={12} xs={12}>
            <InputDate
              label="Date"
              name="date"
              value={data.date}
              onChange={(v)=>onChange(v, 'date')}
            />
          </Grid>
        </Grid>
        <Box p={1}></Box>
        <DataGrid columns={qualityCols} data={data.bags || []} showFooter={true} />
        <Button variant="outlined" color="primary" onClick={()=>{
          dataDispatch({
            type: 'add_grid_row',
            path: accessPath.concat('bags'),
            value: {},
          });
        }}>Add bag</Button>
        <Grid container spacing={1}>
          <Grid item lg={4} md={4} sm={12} xs={12}>
            <InputText
              label="Empty Cone Weight (Kg)"
              name="emptyConeWt"
              value={data.emptyConeWt}
              onChange={onChange}
              type="number"
            />
          </Grid>
          <Grid item lg={4} md={4} sm={12} xs={12}>
            <InputText
              label="Total Empty Bags Weight (Kg)"
              name="emptyBagWt"
              value={data.emptyBagWt}
              onChange={onChange}
              type="number"
            />
          </Grid>
          <Grid item lg={4} md={4} sm={12} xs={12}>
            <InputText
              label="Net Weight (Kg)"
              name="netWt"
              value={data.netWt}
              type="number"
              readOnly
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

function parseOutwardValue(outwardValue) {
  let newVal = [];
  outwardValue.outwards.forEach((bag)=>{
    newVal.push({
      setNo: outwardValue.setNo,
      partyId: outwardValue.partyId,
      weaverId: outwardValue.weaverId,
      ...bag,
    });
  });

  return newVal;
}

function YarnOutwardDialog({ open, accounts, editOutwardValue, ...props }) {
  const defaultOutward = {
    totalEnds: '',
    bags: [{}],
    date: new Date(),
    emptyConeWt: 0,
    emptyBagWt: 0,
  };
  const defaults = {
    setNo: null,
    partyId: null,
    weaverId: null,
    outwards: [defaultOutward],
  };
  const [outwardValue, outwardDispatch] = useReducer(outwardValueReducer, defaults);
  const [partiesOpts, setPartiesOpts] = useState([]);
  const [weaverOpts, setWeaverOpts] = useState([]);
  const [qualityOpts, setQualityOpts] = useState([]);
  const [setnoOpts, setSetNoOpts] = useState([]);
  const [saving, setSaving] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);

  const isEdit = editOutwardValue != null;

  useEffect(async ()=>{
    if(open) {
      if(isEdit) {
        outwardDispatch({
          type: 'init',
          value: editOutwardValue,
        });
        let res = await getSetNo(editOutwardValue.partyId);
        setSetNoOpts(res.map((row)=>({label: row.setNo, value: row.setNo})));
      } else {
        outwardDispatch({
          type: 'init',
          value: defaults,
        });
        setSetNoOpts([]);
      }
      setSaving(false);
      setPartiesOpts(accounts.filter((a)=>a.isWeaver=="Party").map((party)=>({label: party.name, value: party.id})));
      setWeaverOpts(accounts.map((party)=>({label: party.name, value: party.id})));
    }
  }, [open]);

  useEffect(()=>{
    if(!_.isUndefined(outwardValue.partyId) && !_.isNull(outwardValue.partyId)) {
      axios.get('/api/qualities', {
        params: {
          partyId: outwardValue.partyId,
        }
      }).then((res)=>{
        setQualityOpts(res.data.map((quality)=>({label: quality.name, value: quality.id})));
      }).catch((err)=>{
        console.log(err);
      });
    }
  }, [outwardValue.partyId]);

  const saveDetails = async ()=>{
    let saveVal = outwardValue;
    if(!isEdit) {
      saveVal = parseOutwardValue(outwardValue);
    }

    setSaving(true);
    if(isEdit) {
      try {
        await axios.put('/api/outward/'+outwardValue.id, saveVal);
        props.onSave(saveVal, isEdit);
        props.setNotification(NOTIFICATION_TYPE.SUCCESS, 'Outward updated successfully');
      } catch(err) {
        console.log(err);
        setSaving(false);
        props.setNotification(NOTIFICATION_TYPE.ERROR, getAxiosErr(err));
      }
    } else {
      try {
        await axios.post('/api/outward', saveVal);
        props.onSave(saveVal, isEdit);
        props.setNotification(NOTIFICATION_TYPE.SUCCESS, 'Outward added successfully');
      } catch(err) {
        console.log(err);
        setSaving(false);
        props.setNotification(NOTIFICATION_TYPE.ERROR, getAxiosErr(err));
      }
    }
  };

  function updateoutwardValues(e, name) {
    if(e && e.target) {
      outwardDispatch({
        type: 'set_value',
        path: [e.target.id || e.target.name],
        value: e.target.value
      });
    } else {
      outwardDispatch({
        type: 'set_value',
        path: [name],
        value: e,
      });
    }
  }

  return (
    <DraggableDialog
      sectionTitle="Yarn Outward"
      {...props}
      onSave={saveDetails}
      open={open}
      maxWidth="md"
      extraButtons={
        <>
          {isEdit && <Button color="secondary" variant="contained" onClick={()=>setConfirmOpen(true)}>Delete</Button>}
        </>
      }
      isSaving={saving}
    >
      <Grid container>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Grid container spacing={2}>
            <Grid item md={4} xs={12}>
              <InputSelectSearch label="Party"
                value={partiesOpts.filter((party)=>party.value===outwardValue.partyId)}
                onChange={async (value)=>{
                  updateoutwardValues(value?.value, 'partyId');
                  let res = await getSetNo(value?.value);
                  setSetNoOpts(res.map((row)=>({label: row.setNo, value: row.setNo})));
                }}
                options={partiesOpts}
                autoFocus
                />
            </Grid>
            <Grid item md={4} xs={12}>
            <InputSelectSearch
                label="Set No."
                name="setNo"
                type="number"
                options={setnoOpts}
                value={setnoOpts.filter((setno)=>setno.value===outwardValue.setNo)}
                onChange={(value)=>{
                  updateoutwardValues(value?.value, 'setNo');
                }}
                onCreateOption={(value)=>{
                  setSetNoOpts((prevOpts)=>{
                    let newOpts = [...prevOpts];
                    newOpts.push({label: value, value: value});
                    return newOpts;
                  });
                  updateoutwardValues(value, 'setNo');
                }}
                creatable
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <InputSelectSearch label="Weaver/Party"
                value={weaverOpts.filter((party)=>party.value===outwardValue.weaverId)}
                onChange={(value)=>{
                  updateoutwardValues(value?.value, 'weaverId')
                }}
                options={weaverOpts} />
            </Grid>
          </Grid>
          <Box p={1}></Box>
          {!isEdit && outwardValue.outwards?.map((design, i)=>{
            return <QualityDetails data={design} accessPath={['outwards', i]} dataDispatch={outwardDispatch}
              onRemove={()=>{
                outwardDispatch({
                  type: 'remove_grid_row',
                  path: ['outwards'],
                  value: i,
                });
              }}
              onCopy={()=>{
                outwardDispatch({
                  type: 'add_grid_row',
                  path: ['outwards'],
                  value: design,
                });
              }}
              qualityOpts={qualityOpts}
            />
          })}
          {isEdit &&
            <QualityDetails data={outwardValue} accessPath={[]} dataDispatch={outwardDispatch}
              qualityOpts={qualityOpts}
            />
          }
          {!isEdit && <Button color="primary" variant="outlined" onClick={()=>{
            outwardDispatch({
              type: 'add_grid_row',
              path: ['outwards'],
              value: defaultOutward,
            });
          }}>Add Outward</Button>}
        </Grid>
      </Grid>
      <ConfirmDialog
        open={confirmOpen}
        onClose={()=>setConfirmOpen(false)}
        title={"Delete ?"}
        content={"Are you sure you want to delete this record ?"}
        onConfirm={()=>{
          setConfirmOpen(false);
          props.onDelete(outwardValue);
        }}
        />
    </DraggableDialog>
  );
}

class YarnOutward extends React.Component {
  constructor() {
    super();
    this.getOutwards = this.getOutwards.bind(this);
  }
  componentDidMount() {
    let p1 = axios.get(`/api/parties`).then((res) => {
      const accounts = res.data;
      this.setState({
        accounts,
        partiesOpts: accounts.filter((a)=>a.isWeaver=='Party').map((p)=>({label: p.name, value: p.id}))
      });
    }).catch((err)=>{
      console.log(err);
    });
    let p2 = axios.get('/api/qualities').then((res)=>{
      const qualities = res.data;
      this.setState({ qualities });
    }).catch((err)=>{
      console.log(err);
    });
  }

  getOutwards() {
    axios
      .get(`/api/outward`, {
        params: {
          partyId: this.state.partyId,
          setNo: this.state.setNo,
        }
      })
      .then((res) => {
        const outwards = res.data;
        this.setState({ outwards });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  editOutward(row) {
    this.setState({editOutwardValue: row});
    this.showDialog(true);
  }

  state = {
    radioValue: 'Yes',
    outwards: [],
    accounts: [],
    partiesOpts: [],
    partyId: null,
    setNo: null,
    qualities: [],
    filter: '',
    dialogOpen: false,
    columns: [
      {
        name: 'Set No',
        key: 'setNo',
        width: 100,
      },
      {
        name: 'Date',
        key: 'date',
        formatter:({row})=>{
          return Moment(row['date']).format('DD-MM-YYYY');
        },
        width: 120,
      },
      {
        name: 'Party Name',
        formatter: ({row}) => {
          let partyName = [];
          if (row.partyId) {
            partyName = this.state.accounts.filter((party) => {
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
        name: 'Weaver Name',
        key: 'weaverId',
        formatter: ({row}) => {
          let weaverName = [];
          if (row.weaverId) {
            weaverName = this.state.accounts.filter((party) => {
              if (party.id === row.weaverId) {
                return party;
              }
            });
          }
          return weaverName[0] ? weaverName[0].name : '-';
        },
        width: 300,
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
      },
      {
        name: 'Net Weight (Kg)',
        key: 'netWt',
      },
    ],
    editOutwardValue: null,
  };

  showDialog(show) {
    this.setState({ dialogOpen: show });
  }

  saveDetails(outwardValue, isEdit) {
    this.showDialog(false);
    if(isEdit) {
      this.setState((prevState) => {
        let indx = prevState.outwards.findIndex(
          (i) => i.id === outwardValue.id
        );
        return {
          outwards: [
            ...prevState.outwards.slice(0, indx),
            outwardValue,
            ...prevState.outwards.slice(indx + 1),
          ],
        };
      });
    }
  }

  deleteRecord(outwardValue) {
    axios
      .delete('/api/outward/'+outwardValue.id)
      .then(() => {
        this.setState((prevState) => {
          let indx = prevState.outwards.findIndex(
            (i) => i.id === outwardValue.id
          );

          return {
            outwards: [
              ...prevState.outwards.slice(0, indx),
              ...prevState.outwards.slice(indx + 1),
            ],
          };
        });
        this.props.setNotification(NOTIFICATION_TYPE.SUCCESS, 'Yarn outward deleted successfully');
        this.showDialog(false);
      })
      .catch((err) => {
        console.log(err);
        this.props.setNotification(NOTIFICATION_TYPE.ERROR, getAxiosErr(err));
      });
  }

  render() {
    return (
      <>
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
              <InputText
                value={this.state.setNo}
                onChange={(e) => this.setState({ setNo: e.target.value })}
                label="Set No."
              />
            </Grid>
          </Grid>
        </Box>
        <Box p={1}>
          <Box display="flex">
            <Button
              variant="outlined"
              color="primary"
              onClick={this.getOutwards}
              disabled={!this.state.partyId && !this.state.setNo}
            >
              Get data
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                this.setState({ editOutwardValue: null });
                this.showDialog(true);
              }}
              style={{ marginLeft: '0.5rem' }}
            >
              Add Yarn Outward
            </Button>
          </Box>
        </Box>
        <Box flexGrow="1" p={1}>
          <ResultsTable
            columns={this.state.columns}
            rows={this.state.outwards}
            onEditClick={this.editOutward.bind(this)}
            defaultSort={[
              {
                  columnKey: 'setNo',
                  direction: 'ASC',
              },
            ]}
          />
        </Box>
        <YarnOutwardDialog
          open={this.state.dialogOpen}
          onClose={() => this.showDialog(false)}
          onSave={(outwardValue, isEdit) =>
            this.saveDetails(outwardValue, isEdit)
          }
          accounts={this.state.accounts}
          editOutwardValue={this.state.editOutwardValue}
          onDelete={(outwardValue)=>
            this.deleteRecord(outwardValue)
          }
          setNotification={this.props.setNotification}
        />
      </>
    );
  }
}

export default connect(()=>({}), (dispatch)=>({
  setNotification: (...args)=>{dispatch(setNotification.apply(this, args))},
}))(YarnOutward);