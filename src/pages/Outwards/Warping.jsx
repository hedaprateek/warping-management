import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  MenuItem,
  Select as MUISelect
} from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useMemo, useReducer, useState } from 'react';
import DraggableDialog from '../../helpers/DraggableDialog';
import { FormField, InputDate, InputSelect, InputSelectSearch, InputText } from '../../components/FormElements';
import DataGrid from '../../components/DataGrid';
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';
import _ from 'lodash';
import { DECIMAL_MULTIPLIER, getAxiosErr, getDatesForType, MyMath, parse, round, ROUND_DECIMAL } from '../../utils';
import EditIcon from '@material-ui/icons/Edit';
import Moment from 'moment';
import { connect } from 'react-redux';
import { NOTIFICATION_TYPE, setNotification } from '../../store/reducers/notification';
import ConfirmDialog from '../../helpers/ConfirmDialog';
import { ResultsTable } from '../../components/ResultsTable';

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
      let qualityIdx = null;
      if(action.path.indexOf('qualities') > -1) {
        qualityIdx = action.path[action.path.indexOf('qualities')+1];
      }
      if(action.path.indexOf('beams') > -1) {
        newState = beamReducer(newState, _.slice(action.path, 0, action.path.indexOf('beams')+2), changedKey, qualityIdx);
      } else {
        newState = beamReducer(newState, [], changedKey, qualityIdx);
      }
      break;
    case 'add_grid_row':
      rows = _.get(newState, action.path, []);
      rows.push({
        ...action.value,
      });
      _.set(newState, action.path, rows);
      if(action.path.indexOf('qualities') > -1) {
        let qualityIdx = action.path[action.path.indexOf('qualities')+1];
        newState = beamReducer(newState, _.slice(action.path, 0, action.path.indexOf('beams')+2), null, qualityIdx);
      }
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

function beamReducer(state, path, changedKey, qualityIdx) {
  let beamData = _.get(state, path, state);

  if(changedKey === 'totalMeter') {
    // beamData.cuts = round(parse(beamData.totalMeter) / parse(beamData.lassa));
    beamData.cuts = MyMath(beamData.totalMeter).div(beamData.lassa).toString();
  } else if(changedKey === 'cuts') {
    // beamData.totalMeter = round(parse(beamData.lassa)*parse(beamData.cuts));
    beamData.totalMeter = MyMath(beamData.lassa).mul(beamData.cuts).toString();
  }

  beamData.totalEnds = MyMath(0);
  (beamData.qualities || []).forEach((q, i)=>{
    beamData.totalEnds = beamData.totalEnds.add(q.ends);
    if(changedKey == 'usedYarn') {
      // q.count = round(parse(beamData.totalMeter)*parse(q.ends)/1693.333/parse(q.usedYarn));
      q.count = MyMath(beamData.totalMeter).mul(q.ends).div(1693.333).div(q.usedYarn).toString();
      qualityIdx == i && (q._touched = true);
    } else if(changedKey === 'count') {
      // q.usedYarn = round(parse(beamData.totalMeter)*parse(q.ends)/1693.333/parse(q.count));
      q.usedYarn = MyMath(beamData.totalMeter).mul(q.ends).div(1693.333).div(q.count).toString();
      qualityIdx == i && (q._touched = true);
    }
  });
  beamData.totalEnds = beamData.totalEnds.toString();

  if(beamData.actualUsedYarn) {
    let untouchedCount = 0;
    let touchedTotal = beamData.qualities.reduce((prevTotal, q)=>{
      if(q._touched) {
        return prevTotal.add(q.usedYarn);
      } else {
        untouchedCount++;
      }
      return prevTotal;
    }, MyMath(0)).toString();

    let untouchedUsedYarn = MyMath(beamData.actualUsedYarn).sub(touchedTotal);
    let aprxPart = untouchedUsedYarn.div(untouchedCount).floor().toString();
    // let untouchedUsedYarn = (parse(beamData.actualUsedYarn)*DECIMAL_MULTIPLIER - touchedTotal*DECIMAL_MULTIPLIER)/DECIMAL_MULTIPLIER;
    // let aprxPart = Math.floor(untouchedUsedYarn*DECIMAL_MULTIPLIER/untouchedCount)/DECIMAL_MULTIPLIER;

    /* Distribute */
    (beamData.qualities || []).forEach((q, i)=>{
      if(!q._touched) {
        /* Last available untouched yarn */
        if(untouchedUsedYarn.sub(aprxPart).greaterThanOrEqualTo(aprxPart)) {
          untouchedUsedYarn = untouchedUsedYarn.sub(aprxPart);
          q.usedYarn = aprxPart.toString();
        } else {
          q.usedYarn = untouchedUsedYarn.toString();
        }
      }
    });
  }

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
      Footer: ()=>'Actual Used Yarn (Kg)',
    },
    {
      Header: 'Used Yarn (Kg)',
      accessor: 'usedYarn',
      Cell: getNumberCell(dataDispatch, accessPath.concat('qualities')),
      Footer: (info)=>{
        let total = info.rows.reduce((sum, row) => {
            return sum.add(row.values[info.column.id])
          }, MyMath(0)
        ).toString();
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
        <Grid container spacing={1}>
          <Grid item lg={2} md={2} sm={12} xs={12}>
            <InputText
              label="Actual Used Yarn (Kg)"
              name="actualUsedYarn"
              value={data.actualUsedYarn}
              onChange={onChange}
            />
          </Grid>
          <Grid item lg={2} md={2} sm={12} xs={12}>
            <InputText
              label="Filled Beam Weight (Kg)"
              name="filledBeamWt"
              value={data.filledBeamWt}
              onChange={onChange}
              type="number"
            />
          </Grid>
          <Grid item lg={2} md={2} sm={12} xs={12}>
            <InputText
              label="Empty Beam Weight (Kg)"
              name="emptyBeamWt"
              value={data.emptyBeamWt}
              onChange={onChange}
              type="number"
            />
          </Grid>
          <Grid item lg={2} md={2} sm={12} xs={12}>
            <InputText
              label="Gatepass No."
              name="gatepass"
              value={data.gatepass}
              onChange={onChange}
              readOnly
            />
          </Grid>
        </Grid>
        <Box p={1}></Box>
        <DataGrid columns={qualityCols} data={data.qualities || []} showFooter={true} />
        <Button variant="outlined" color="primary" onClick={()=>{
          dataDispatch({
            type: 'add_grid_row',
            path: accessPath.concat('qualities'),
            value: {_touched: false},
          });
        }} disabled={data.qualities.length >= 8}>Add quality</Button>
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
    qualities: [{_touched: false,}],
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
  async componentDidMount() {
    await axios.get(`/api/parties`).then((res) => {
      const accounts = res.data;
      this.setState({
        accounts,
        partiesOpts: accounts.filter((a)=>a.isWeaver=='Party').map((p)=>({label: p.name, value: p.id})),
      });
    });

    let [from_date, to_date] = getDatesForType(this.state.date_type);
    this.setState({
      from_date: from_date, to_date: to_date,
    }, ()=>{
      this.getWarpings();
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

  editWarping(row) {
    this.setState({editWarpingValue: row});
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
    date_type: 'current-m',
    columns: [
      {
        name: 'Set No',
        key: 'setNo',
        width: 100,
      },
      {
        name: 'Beam No',
        key: 'beamNo',
        width: 100,
      },
      {
        name: 'Date',
        key: 'date',
        formatter:({row})=>{
          return Moment(row['date']).format('DD/MM/YYYY');
        },
        sortFormatter: false,
        width: 120,
      },
      {
        name: 'Party Name',
        key: 'partyId',
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
        name: 'Design No.',
        key: 'design',
      },
      {
        name: 'Total Meters',
        key: 'totalMeter',
      },
      {
        name: 'Total Ends',
        key: 'totalEnds',
      },
      {
        name: 'Net Used Yarn (Kg)',
        key: 'cal-yarn',
        formatter: ({row})=>{
          return round(_.sum(row.qualities.map((q)=>parse(q.usedYarn)||0)));
        },
      },
    ],
    editWarpingValue: null,
  };

  getWarpings() {
    axios.get(`/api/warping`, {
      params: {
        partyId: this.state.partyId,
        setNo: this.state.setNo,
        from_date: this.state.from_date,
        to_date: this.state.to_date,
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
    if(isEdit) {
      this.setState((prevState) => {
        let indx = prevState.warpings.findIndex(
          (i) => i.id === warpingValue.id
        );
        return {
          warpings: [
            ...prevState.warpings.slice(0, indx),
            warpingValue,
            ...prevState.warpings.slice(indx + 1),
          ],
        };
      });
    }
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
          <Grid container spacing={1}>
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
              onClick={this.getWarpings}
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
        <Box flexGrow="1" p={1}>
          <ResultsTable
            columns={this.state.columns}
            rows={this.state.warpings}
            onEditClick={this.editWarping.bind(this)}
            defaultSort={[
              {
                  columnKey: 'setNo',
                  direction: 'ASC',
              },
              {
                columnKey: 'beamNo',
                direction: 'ASC',
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
