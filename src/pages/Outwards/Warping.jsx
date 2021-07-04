import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  OutlinedInput,
  Paper,
} from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useMemo, useReducer, useState } from 'react';
import DraggableDialog from '../../helpers/DraggableDialog';
import { FormField, InputDate, InputSelect, InputSelectSearch, InputText } from '../../components/FormElements';
import TableComponent from '../../components/TableComponent';
import Select from 'react-select';
import DataGrid from '../../components/DataGrid';
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';
import _ from 'lodash';
import { getAxiosErr, parse, round } from '../../utils';
import EditIcon from '@material-ui/icons/Edit';
import Moment from 'moment';
import { connect } from 'react-redux';
import { NOTIFICATION_TYPE, setNotification } from '../../store/reducers/notification';
import ConfirmDialog from '../../helpers/ConfirmDialog';

const warpingReducer = (state, action)=>{
  let newState = _.cloneDeep(state);
  let rows = null;
  switch(action.type) {
    case 'init':
      newState = action.value;
      break;
    case 'set_value':
      _.set(newState, action.path, action.value);
      let changedKey = action.path[action.path.length-1];
      if(action.path.indexOf('beams') > -1) {
        newState = beamReducer(newState, _.slice(action.path, 0, action.path.indexOf('beams')+2), changedKey);
      } else {
        newState = beamReducer(newState, [], changedKey);
      }
      break;
    case 'add_grid_row':
      rows = _.get(newState, action.path, []);
      rows.push({
        ...action.value,
      });
      _.set(newState, action.path, rows);
      break;
    case 'remove_grid_row':
      rows = _.get(newState, action.path, []);
      rows.splice(action.value, 1);
      _.set(newState, action.path, rows);
      let desInd = action.path.indexOf('beams');
      if(desInd < action.path.length-1) {
        newState = beamReducer(newState, _.slice(action.path, 0, action.path.indexOf('beams')+2));
      }
      break;
    case 'set_beam_no':
      newState.startBeamNo = action.value.beamNo;
  }
  return newState;
}

function beamReducer(state, path, changedKey) {
  let beamData = _.get(state, path, state);

  if(changedKey === 'totalMeter') {
    beamData.cuts = round(parse(beamData.totalMeter) / parse(beamData.lassa));
  } else if(changedKey === 'cuts') {
    beamData.totalMeter = round(parse(beamData.lassa)*parse(beamData.cuts));
  }

  beamData.totalEnds = 0;
  (beamData.qualities || []).forEach((q)=>{
    beamData.totalEnds += parse(q.ends);
    if(changedKey == 'usedYarn') {
      q.count = round(parse(beamData.totalMeter)*parse(q.ends)/1693.333/parse(q.usedYarn));
    } else if(changedKey === 'count') {
      q.usedYarn = round(parse(beamData.totalMeter)*parse(q.ends)/1693.333/parse(q.count));
    }
  });

  beamData.actualUsedYarn = parse(beamData.filledBeamWt) - parse(beamData.emptyBeamWt);

  _.set(state, path, beamData);
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

function getSelectCell(dataDispatch, basePath, options, readOnly=false) {
  return ({value, row, column})=>{
    return <InputSelectSearch
      value={options.filter(
        (op) => op.value === value
      )}
      onChange={(value) => {
        dataDispatch({
          type: 'set_value',
          path: basePath.concat([row.index, column.id]),
          value: value.value,
        })
      }}
      options={options}
    />
  };
}


function BeamDetails({data, beamNo, accessPath, dataDispatch, onRemove, onCopy, qualityOpts}) {
  const onChange = (e, name)=>{
    if (e?.target) {
      dataDispatch({
        type: 'set_value',
        path: accessPath.concat(e.target.name),
        value: e.target.value,
        postReducer: beamReducer,
      });
    } else {
      dataDispatch({
        type: 'set_value',
        path: accessPath.concat(name),
        value: e,
        postReducer: beamReducer,
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
            path: accessPath.concat('qualities'),
            value: row.index,
          });
        }}><DeleteForeverRoundedIcon /></IconButton>
      }
    },
    {
      Header: 'Quality',
      accessor: 'qualityId',
      style: {
        width: '40%',
      },
      Cell: getSelectCell(dataDispatch, accessPath.concat('qualities'), qualityOpts)
    },
    {
      Header: 'Ends',
      accessor: 'ends',
      Cell: getNumberCell(dataDispatch, accessPath.concat('qualities')),
    },
    {
      Header: 'Count',
      accessor: 'count',
      Cell: getNumberCell(dataDispatch, accessPath.concat('qualities')),
      Footer: ()=>'Net Used Yarn (Kg)',
    },
    {
      Header: 'Used Yarn (Kg)',
      accessor: 'usedYarn',
      Cell: getNumberCell(dataDispatch, accessPath.concat('qualities')),
      Footer: (info)=>{
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
      },
    },
  ], [qualityOpts]);

  return (
    <Card variant="outlined" style={{marginBottom: '0.5rem'}}>
      <CardHeader title={`Beam No: ${isNaN(beamNo) ? 1 : beamNo}`} titleTypographyProps={{variant: 'h6'}} action={
        <Box>
          {onCopy && <Button color="primary" variant="outlined" onClick={onCopy} style={{marginRight:'0.5rem'}}>Copy</Button>}
          {onRemove && <Button color="secondary" variant="outlined" onClick={onRemove}>Remove</Button>}
        </Box>
      } />
      <CardContent>
        <Grid container spacing={1}>
          <Grid item lg={2} md={2} sm={12} xs={12}>
            <InputText
              label="Design No."
              name="design"
              value={data.design}
              onChange={onChange}
            />
          </Grid>
          <Grid item lg={2} md={2} sm={12} xs={12}>
            <InputText
              label="Lassa"
              name="lassa"
              value={data.lassa}
              onChange={onChange}
              type="number"
            />
          </Grid>
          <Grid item lg={2} md={2} sm={12} xs={12}>
            <InputText
              label="Cuts"
              name="cuts"
              value={data.cuts}
              onChange={onChange}
              type="number"
            />
          </Grid>
          <Grid item lg={2} md={2} sm={12} xs={12}>
            <InputText
              label="Total Meter"
              name="totalMeter"
              value={data.totalMeter}
              onChange={onChange}
              type="number"
            />
          </Grid>
          <Grid item lg={2} md={2} sm={12} xs={12}>
            <InputText
              label="Total Ends"
              name="totalEnds"
              value={data.totalEnds}
              onChange={onChange}
              readOnly
            />
          </Grid>
          <Grid item lg={2} md={2} sm={12} xs={12}>
            <InputDate
              label="Date"
              name="date"
              value={data.date}
              onChange={(v)=>onChange(v, 'date')}
            />
          </Grid>
        </Grid>
        <Box p={1}></Box>
        <DataGrid columns={qualityCols} data={data.qualities || []} showFooter={true} />
        <Button variant="outlined" color="primary" onClick={()=>{
          dataDispatch({
            type: 'add_grid_row',
            path: accessPath.concat('qualities'),
            value: {},
          });
        }}>Add quality</Button>
        <Grid container spacing={1}>
          <Grid item lg={3} md={3} sm={12} xs={12}>
            <InputText
              label="Filled Beam Weight (Kg)"
              name="filledBeamWt"
              value={data.filledBeamWt}
              onChange={onChange}
              type="number"
            />
          </Grid>
          <Grid item lg={3} md={3} sm={12} xs={12}>
            <InputText
              label="Empty Beam Weight (Kg)"
              name="emptyBeamWt"
              value={data.emptyBeamWt}
              onChange={onChange}
              type="number"
            />
          </Grid>
          <Grid item lg={3} md={3} sm={12} xs={12}>
            <InputText
              label="Actual Used Yarn (Kg)"
              name="actualUsedYarn"
              value={data.actualUsedYarn}
              onChange={onChange}
              readOnly
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

function parseWarpingValue(warpingValue) {
  let newVal = [];
  warpingValue.beams.forEach((beam)=>{
    newVal.push({
      setNo: warpingValue.setNo,
      partyId: warpingValue.partyId,
      weaverId: warpingValue.weaverId,
      ...beam,
    });
  });

  return newVal;
}

async function getBeamNoDetails(setNo) {
  if(!setNo) {
    return 1;
  }
  let res = await axios.get('/api/warping/beamno/'+setNo);
  return res.data;
}

export async function getSetNo(partyId) {
  let res = await axios.get('/api/setno/'+partyId);
  return res.data;
}

function WarpingDialog({ open, accounts, editWarpingValue, ...props }) {
  const defaultBeam = {
    design: '',
    lassa: 110,
    cuts: 0,
    totalMeter: 0,
    totalEnds: 0,
    qualities: [{}],
    date: new Date(),
  };
  const defaults = {
    setNo: null,
    partyId: null,
    weaverId: null,
    beams: [defaultBeam],
    /* No need to pass to BE */
    startBeamNo: 1,
  };
  const [warpingValue, warpingDispatch] = useReducer(warpingReducer, defaults);
  const [partiesOpts, setPartiesOpts] = useState([]);
  const [weaverOpts, setWeaverOpts] = useState([]);
  const [qualityOpts, setQualityOpts] = useState([]);
  const [setnoOpts, setSetNoOpts] = useState([]);
  const [saving, setSaving] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);

  const isEdit = editWarpingValue != null;

  useEffect(async ()=>{
    if(open) {
      if(isEdit) {
        warpingDispatch({
          type: 'init',
          value: editWarpingValue,
        });
        let res = await getSetNo(editWarpingValue.partyId);
        setSetNoOpts(res.map((row)=>({label: row.setNo, value: row.setNo})));
      } else {
        warpingDispatch({
          type: 'init',
          value: defaults,
        });
        setSetNoOpts([]);
      }
      setSaving(false);
      setPartiesOpts(accounts.filter((acc)=>acc.isWeaver=='Party').map((party)=>({label: party.name, value: party.id})));
      setWeaverOpts(accounts.map((party)=>({label: party.name, value: party.id})));
    }
  }, [open]);

  useEffect(()=>{
    if(!_.isUndefined(warpingValue.partyId) && !_.isNull(warpingValue.partyId)) {
      axios.get('/api/qualities', {
        params: {
          partyId: warpingValue.partyId,
        }
      }).then((res)=>{
        setQualityOpts(res.data.map((quality)=>({label: quality.name, value: quality.id})));
      }).catch((err)=>{
        console.log(err);
      });
    }
  }, [warpingValue.partyId]);


  function updatewarpingValues(e, name) {
    if(e && e.target) {
      warpingDispatch({
        type: 'set_value',
        path: [e.target.id || e.target.name],
        value: e.target.value
      });
    } else {
      warpingDispatch({
        type: 'set_value',
        path: [name],
        value: e,
      });
    }
  }

  useEffect(async ()=>{
    let result = await getBeamNoDetails(warpingValue.setNo);
    warpingDispatch({
      type: 'set_beam_no',
      value: result,
      isEdit: isEdit,
    });
  }, [warpingValue.setNo]);

  const saveDetails = async ()=>{
    let saveVal = warpingValue;
    if(!isEdit) {
      saveVal = parseWarpingValue(warpingValue);
    }

    setSaving(true);
    if(isEdit) {
      try {
        await axios.put('/api/warping/'+warpingValue.id, warpingValue);
        props.onSave(saveVal, isEdit);
        props.setNotification(NOTIFICATION_TYPE.SUCCESS, 'Warping program updated successfully');
      } catch(err) {
        console.log(err);
        setSaving(false);
        props.setNotification(NOTIFICATION_TYPE.ERROR, getAxiosErr(err));
      }
    } else {
      try {
        await axios.post('/api/warping', saveVal);
        props.onSave(saveVal, isEdit);
        props.setNotification(NOTIFICATION_TYPE.SUCCESS, 'Warping program added successfully');
      } catch(err) {
        console.log(err);
        setSaving(false);
        props.setNotification(NOTIFICATION_TYPE.ERROR, getAxiosErr(err));
      }
    }
  };

  return (
    <DraggableDialog
      sectionTitle="Program"
      {...props}
      onSave={saveDetails}
      open={open}
      maxWidth="lg"
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
                value={partiesOpts.filter((party)=>party.value===warpingValue.partyId)}
                onChange={async (value)=>{
                  updatewarpingValues(value?.value, 'partyId');
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
                value={setnoOpts.filter((setno)=>setno.value===warpingValue.setNo)}
                onChange={async (value)=>{
                  updatewarpingValues(value?.value, 'setNo');
                }}
                onCreateOption={async (value)=>{
                  setSetNoOpts((prevOpts)=>{
                    let newOpts = [...prevOpts];
                    newOpts.push({label: value, value: value});
                    return newOpts;
                  });
                  updatewarpingValues(value, 'setNo');
                }}
                creatable
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <InputSelectSearch label="Weaver/Party"
                value={weaverOpts.filter((party)=>party.value===warpingValue.weaverId)}
                onChange={(value)=>{
                  updatewarpingValues(value?.value, 'weaverId')
                }}
                options={weaverOpts} />
            </Grid>
          </Grid>
          <Box p={1}></Box>
          {!isEdit && warpingValue.beams?.map((beam, i)=>{
            return <BeamDetails data={beam} accessPath={['beams', i]} dataDispatch={warpingDispatch}
              onRemove={()=>{
                warpingDispatch({
                  type: 'remove_grid_row',
                  path: ['beams'],
                  value: i,
                });
              }}
              onCopy={()=>{
                warpingDispatch({
                  type: 'add_grid_row',
                  path: ['beams'],
                  value: beam,
                });
              }}
              qualityOpts={qualityOpts}
              beamNo={warpingValue.startBeamNo+i}
            />
          })}
          {isEdit &&
            <BeamDetails data={warpingValue} accessPath={[]} dataDispatch={warpingDispatch}
              qualityOpts={qualityOpts} beamNo={warpingValue.beamNo}
            />
          }
          {!isEdit && <Button color="primary" variant="outlined" onClick={()=>{
            warpingDispatch({
              type: 'add_grid_row',
              path: ['beams'],
              value: defaultBeam,
            });
          }}>Add Beam</Button>}
        </Grid>
      </Grid>
      <ConfirmDialog
        open={confirmOpen}
        onClose={()=>setConfirmOpen(false)}
        title={"Delete ?"}
        content={"Are you sure you want to delete this record ?"}
        onConfirm={()=>{
          setConfirmOpen(false);
          props.onDelete(warpingValue);
        }}
        />
    </DraggableDialog>
  );
}

class Warping extends React.Component {
  constructor() {
    super();
    this.getWarpings = this.getWarpings.bind(this);
  }
  componentDidMount() {
    axios.get(`/api/parties`).then((res) => {
      const accounts = res.data;
      this.setState({
        accounts,
        partiesOpts: accounts.filter((a)=>a.isWeaver=='Party').map((p)=>({label: p.name, value: p.id})),
      });
    });
  }

  editWarping(row) {
    this.setState({editWarpingValue: row.original});
    this.showDialog(true);
  }

  state = {
    radioValue: 'Yes',
    warpings: [],
    accounts: [],
    partiesOpts: [],
    partyId: null,
    setNo: null,
    weavers: [],
    filter: '',
    dialogOpen: false,
    columns: [
      {
        Header: '',
        id: 'btn-edit',
        Cell: ({ row }) => {
          return (
            <IconButton
              onClick={() => {
                this.editWarping(row);
              }}
            >
              <EditIcon />
            </IconButton>
          );
        },
      },
      {
        Header: 'Set No',
        accessor: 'setNo',
        width: 70,
      },
      {
        Header: 'Beam No',
        accessor: 'beamNo',
        width: 70,
      },
      {
        Header: 'Date',
        accessor: 'date',
        Cell:({value})=>{
          return Moment(value).format('DD-MM-YYYY');
        },
        width: 90,
      },
      {
        Header: 'Party Name',
        accessor: (row) => {
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
        width: 200,
      },
      {
        Header: 'Weaver Name',
        accessor: (row) => {
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
        width: 200,
      },
      {
        Header: 'Design No.',
        accessor: 'design',
        width: 130,
      },
      {
        Header: 'Total Meters',
        accessor: 'totalMeter',
        width: 130,
      },
      {
        Header: 'Total Ends',
        accessor: 'totalEnds',
        width: 130,
      },
      {
        Header: 'Net Used Yarn (Kg)',
        accessor: (row)=>{
          return round(_.sum(row.qualities.map((q)=>parse(q.usedYarn)||0)));
        },
        width: 130,
      },
    ],
    editWarpingValue: null,
  };

  getWarpings() {
    axios.get(`/api/warping`, {
      params: {
        partyId: this.state.partyId,
        setNo: this.state.setNo,
      }
    }).then((res) => {
      const warpings = res.data;
      this.setState({ warpings });
    });
  }

  showDialog(show) {
    this.setState({ dialogOpen: show });
  }

  saveDetails(warpingValue, isEdit) {
    this.showDialog(false);
  }

  deleteRecord(warpingValue) {
    axios
      .delete('/api/warping/'+warpingValue.id)
      .then(() => {
        this.setState((prevState) => {
          let indx = prevState.warpings.findIndex(
            (i) => i.id === warpingValue.id
          );
          return {
            warpings: [
              ...prevState.warpings.slice(0, indx),
              ...prevState.warpings.slice(indx + 1),
            ],
          };
        });
        this.props.setNotification(NOTIFICATION_TYPE.SUCCESS, 'Warping program deleted successfully');
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
              onClick={this.getWarpings}
              disabled={!this.state.partyId && !this.state.setNo}
            >
              Get data
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                this.setState({ editWarpingValue: null });
                this.showDialog(true);
              }}
              style={{ marginLeft: '0.5rem' }}
            >
              Add Program
            </Button>
          </Box>
        </Box>
        <Box flexGrow="1" overflow="auto">
          <TableComponent
            columns={this.state.columns}
            data={this.state.warpings}
            filterText={this.state.filter}
            sortBy={[
              {
                  id: 'setNo',
                  desc: false
              },
              {
                id: 'beamNo',
                desc: false
              },
            ]}
          />
        </Box>
        <WarpingDialog
          open={this.state.dialogOpen}
          onClose={() => this.showDialog(false)}
          onSave={(warpingValue, isEdit) =>
            this.saveDetails(warpingValue, isEdit)
          }
          accounts={this.state.accounts}
          editWarpingValue={this.state.editWarpingValue}
          onDelete={(warpingValue)=>
            this.deleteRecord(warpingValue)
          }
          setNotification={this.props.setNotification}
        />
      </>
    );
  }
}

export default connect(()=>({}), (dispatch)=>({
  setNotification: (...args)=>{dispatch(setNotification.apply(this, args))},
}))(Warping);
