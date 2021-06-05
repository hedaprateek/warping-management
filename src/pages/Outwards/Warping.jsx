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
import { parse, round } from '../../utils';
import EditIcon from '@material-ui/icons/Edit';
import Moment from 'moment';

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
      if(!action.value.isEdit) {
        newState.partyId = action.value.partyId;
      }
  }
  return newState;
}

function beamReducer(state, path, changedKey) {
  let beamData = _.get(state, path, state);

  if(changedKey === 'totalMeter') {
    beamData.cuts = round(parse(beamData.totalMeter) / parse(beamData.lassa));
  } else {
    beamData.totalMeter = round(parse(beamData.lassa)*parse(beamData.cuts));
  }

  beamData.totalEnds = 0;
  (beamData.qualities || []).forEach((q)=>{
    beamData.totalEnds += parse(q.ends);
    if(changedKey == 'usedYarn') {
      q.count = round(parse(beamData.totalMeter)*parse(q.ends)/1693.333/parse(q.usedYarn));
    } else {
      q.usedYarn = round(parse(beamData.totalMeter)*parse(q.ends)/1693.333/parse(q.count));
    }
  });

  beamData.actualUsedYarn = parse(beamData.filledBeamWt) - parse(beamData.emptyBeamWt);

  _.set(state, path, beamData);
  return state;
}

function getNumberCell(dataDispatch, basePath, readOnly=false) {
  return ({value, row, column})=>{
    return <OutlinedInput
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
          <OutlinedInput
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
      <CardHeader title={`Beam No: ${beamNo}`} titleTypographyProps={{variant: 'h6'}} action={
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

function WarpingDialog({ open, parties, weavers, editWarpingValue, ...props }) {
  const defaultBeam = {
    design: '',
    lassa: 0,
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

  const isEdit = editWarpingValue != null;

  useEffect(()=>{
    if(open) {
      if(isEdit) {
        warpingDispatch({
          type: 'init',
          value: editWarpingValue,
        });
      } else {
        warpingDispatch({
          type: 'init',
          value: defaults,
        });
      }
      setPartiesOpts(parties.map((party)=>({label: party.name, value: party.id})));
      setWeaverOpts(weavers.map((party)=>({label: party.name, value: party.id})));
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
    if(e.target) {
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

  return (
    <DraggableDialog
      sectionTitle="Program"
      {...props}
      onSave={() => {
        let saveVal = warpingValue;
        if(!isEdit) {
          saveVal = parseWarpingValue(warpingValue);
        }
        props.onSave(saveVal, isEdit);
      }}
      open={open}
      fullScreen
    >
      <Grid container>
        <Grid item lg={8} md={12} sm={12} xs={12}>
          <Grid container spacing={2}>
            <Grid item md={4} xs={12}>
              <InputText
                label="Set No."
                name="setNo"
                type="number"
                value={warpingValue.setNo}
                onChange={updatewarpingValues}
                onBlur={async (e)=>{
                  let result = await getBeamNoDetails(e.target.value);
                  warpingDispatch({
                    type: 'set_beam_no',
                    value: result,
                    isEdit: isEdit,
                  });
                }}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <InputSelectSearch label="Party"
                value={partiesOpts.filter((party)=>party.value===warpingValue.partyId)}
                onChange={(value)=>{
                  updatewarpingValues(value.value, 'partyId')
                }}
                options={partiesOpts} />
            </Grid>
            <Grid item md={4} xs={12}>
              <FormField label="Weaver/Party">
                <Select
                  value={weaverOpts.filter((party)=>party.value===warpingValue.weaverId)}
                  onChange={(value)=>{
                    updatewarpingValues(value.value, 'weaverId')
                  }}
                  options={weaverOpts}
                />
              </FormField>
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
    </DraggableDialog>
  );
}

class Warping extends React.Component {
  componentDidMount() {
    const p1 = axios.get(`/api/parties`).then((res) => {
      const parties = res.data.filter((p) => p.isWeaver === 'Party');
      const weavers = res.data;
      this.setState({ parties, weavers });
    });

    Promise.all([p1]).then(() => {
      axios.get(`/api/warping`).then((res) => {
        const warpings = res.data;
        this.setState({ warpings });
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
    parties: [],
    weavers: [],
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
      },
      {
        Header: 'Beam No',
        accessor: 'beamNo',
      },
      {
        Header: 'Date',
        accessor: (row) => {
          return Moment(row.date).format('DD-MM-YYYY');
        },
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
      },
      {
        Header: 'Weaver Name',
        accessor: (row) => {
          let weaverName = [];
          if (row.weaverId) {
            weaverName = this.state.weavers.filter((party) => {
              if (party.id === row.weaverId) {
                return party;
              }
            });
          }
          return weaverName[0] ? weaverName[0].name : '-';
        },
      },
      {
        Header: 'Design No.',
        accessor: 'design',
      },
      {
        Header: 'Total Meters',
        accessor: 'totalMeter',
      },
      {
        Header: 'Total Ends',
        accessor: 'totalEnds',
      },
      {
        Header: 'Net Used Yarn (Kg)',
        accessor: (row)=>{
          return round(_.sum(row.qualities.map((q)=>parse(q.usedYarn)||0)));
        }
      },
    ],
    editWarpingValue: null,
  };

  showDialog(show) {
    this.setState({ dialogOpen: show });
  }

  saveDetails(warpingValue, isEdit) {
    if(isEdit) {
      axios
        .put('/api/warping/'+warpingValue.id, warpingValue)
        .then(() => {
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
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      warpingValue.forEach((singleWarp) => {
        axios
          .post('/api/warping', singleWarp)
          .then((res) => {
            this.setState((prevState) => {
              return { warpings: [...prevState.warpings, res.data] };
            });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    }
    this.showDialog(false);
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
        <Box>
          <TableComponent
            columns={this.state.columns}
            data={this.state.warpings}
            filterText={this.state.filter}
          />
        </Box>
        <WarpingDialog
          open={this.state.dialogOpen}
          onClose={() => this.showDialog(false)}
          onSave={(warpingValue, isEdit) =>
            this.saveDetails(warpingValue, isEdit)
          }
          parties={this.state.parties}
          weavers={this.state.weavers}
          editWarpingValue={this.state.editWarpingValue}
        />
      </Box>
    );
  }
}

export default Warping;
