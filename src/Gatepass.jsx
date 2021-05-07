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
import DraggableDialog from './DraggableDialog';
import { FormField, InputDate, InputSelect, InputSelectSearch, InputText } from './FormElements';
import TableComponent from './TableComponent';
import Select from 'react-select';
import DataGrid from './DataGrid';
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';
import _ from 'lodash';

const ROUND_DECIMAL = 5;

function parse(num) {
  if(!isNaN(num)) {
    num = Math.round(num + "e" + ROUND_DECIMAL);
    return Number(num + "e" + -ROUND_DECIMAL);
  } else {
    return Number(0.0);
  }
}


const warpingReducer = (state, action)=>{
  let newState = _.cloneDeep(state);
  let rows = null;
  switch(action.type) {
    case 'init':
      newState = action.value;
      break;
    case 'set_value':
      _.set(newState, action.path, action.value);
      if(action.path.indexOf('designs') > -1) {
        newState = qualityReducer(newState, _.slice(action.path, 0, action.path.indexOf('designs')+2));
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
      let desInd = action.path.indexOf('designs');
      if(desInd < action.path.length-1) {
        newState = qualityReducer(newState, _.slice(action.path, 0, action.path.indexOf('designs')+2));
      }
      break;
  }
  return newState;
}

function qualityReducer(state, path) {
  let qualityData = _.get(state, path);
  let totalGrossWt = 0;
  let totalCones = 0;
  (qualityData.bags || []).forEach((q)=>{
    totalGrossWt += parse(q.grossWt);
    totalCones += parse(q.cones);
  });
  qualityData.netWt = totalGrossWt - parse(qualityData.emptyConeWt)*totalCones
  _.set(state, path, qualityData);
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

function TotalFooter(info) {
  let total = info.rows.reduce((sum, row) => {
      return (parse(row.values[info.column.id]) || 0) + sum
    }, 0
  );
  total = parse(total);
  return (
    <OutlinedInput
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
        postReducer: qualityReducer,
      });
    } else {
      dataDispatch({
        type: 'set_value',
        path: accessPath.concat(name),
        value: e,
        postReducer: qualityReducer,
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
      Header: 'Gross weight',
      accessor: 'grossWt',
      Cell: getNumberCell(dataDispatch, accessPath.concat('bags')),
      Footer: TotalFooter,
    },
  ], [qualityOpts]);


  return (
    <Card variant="outlined" style={{marginBottom: '0.5rem'}}>
      <CardHeader title="Quality details" titleTypographyProps={{variant: 'h6'}} action={
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
              onChange={(op)=>onChange(op.value, 'qualityId')}
              // onChange={(value) => {
              //   dataDispatch({
              //     type: 'set_value',
              //     path: basePath.concat([row.index, column.id]),
              //     value: value.value,
              //   })
              // }}
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
          <Grid item lg={3} md={2} sm={12} xs={12}>
            <InputText
              label="Empty cone wt."
              name="emptyConeWt"
              value={data.emptyConeWt}
              onChange={onChange}
              type="number"
            />
          </Grid>
          <Grid item lg={3} md={2} sm={12} xs={12}>
            <InputText
              label="Net wt."
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

function GatepassDialog({ open, ...props }) {
  const defaultDesign = {
    design: '',
    meter: '',
    totalEnds: '',
    bags: [],
  };
  const defaults = {
    designs: [defaultDesign]
  };
  const [warpingValue, warpingDispatch] = useReducer(warpingReducer, defaults);
  const [partiesOpts, setPartiesOpts] = useState([]);
  const [weaverOpts, setWeaverOpts] = useState([]);
  const [qualityOpts, setQualityOpts] = useState([]);

  useEffect(()=>{
    if(open) {
      axios.get('/api/parties')
        .then((res)=>{
          setPartiesOpts(res.data.filter((p)=>p.isWeaver=='Party').map((party)=>({label: party.name, value: party.id})));
          setWeaverOpts(res.data.filter((p)=>p.isWeaver=='Weaver').map((party)=>({label: party.name, value: party.id})));
        })
        .catch((err)=>{
          console.log(err);
        });
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
      sectionTitle="Gatepass"
      {...props}
      onSave={() => {
        props.onSave(warpingValue);
      }}
      open={open}
      fullScreen
    >
      <Grid container>
        <Grid item lg={6} md={12} sm={12} xs={12}>
          <Grid container spacing={2}>
            <Grid item md={6} xs={12}>
              <FormField label="Party">
                <Select
                  value={partiesOpts.filter((party)=>party.value===warpingValue.partyId)}
                  onChange={(value)=>{
                    updatewarpingValues(value.value, 'partyId')
                  }}
                  options={partiesOpts}
                />
              </FormField>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormField label="Weaver">
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
          {warpingValue.designs.map((design, i)=>{
            return <QualityDetails data={design} accessPath={['designs', i]} dataDispatch={warpingDispatch}
              onRemove={()=>{
                warpingDispatch({
                  type: 'remove_grid_row',
                  path: ['designs'],
                  value: i,
                });
              }}
              onCopy={()=>{
                warpingDispatch({
                  type: 'add_grid_row',
                  path: ['designs'],
                  value: design,
                });
              }}
              qualityOpts={qualityOpts}
            />
          })}
          <Button color="primary" variant="outlined" onClick={()=>{
            warpingDispatch({
              type: 'add_grid_row',
              path: ['designs'],
              value: defaultDesign,
            });
          }}>Add quality</Button>
        </Grid>
      </Grid>
    </DraggableDialog>
  );
}

class Gatepass extends React.Component {
  componentDidMount() {
    axios.get(`http://localhost:7227/api/warping`).then((res) => {
      const warpings = res.data;
      this.setState({ warpings });
    });
  }

  state = {
    radioValue: 'Yes',
    parties: [],
    filter: '',
    dialogOpen: false,
    columns: [
      {
        Header: '',
        accessor: 'functionButtons', // accessor is the "key" in the data
      },
      {
        Header: 'Date',
        accessor: 'date', // accessor is the "key" in the data
      },
      {
        Header: 'Party Name',
        accessor: 'partyId',
      },
      {
        Header: 'Weaver Name',
        accessor: 'weaverId',
      },
      {
        Header: 'Quality name',
        accessor: 'qualityIds',
      },
      {
        Header: 'NetWt',
        accessor: 'netWt', // accessor is the "key" in the data
      },
    ],
  };

  showDialog(show) {
    this.setState({ dialogOpen: show });
  }

  saveDetails(warpingValue) {

    axios
      .post(`http://localhost:7227/api/warping`, warpingValue, {
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
              onClick={() => this.showDialog(true)}
              style={{ marginLeft: '0.5rem' }}
            >
              Add gatepass
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
        <GatepassDialog
          open={this.state.dialogOpen}
          onClose={() => this.showDialog(false)}
          onSave={(warpingValue) => this.saveDetails(warpingValue)}
        />
      </Box>
    );
  }
}

export default Gatepass;
