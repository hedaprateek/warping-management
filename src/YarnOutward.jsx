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
import EditIcon from '@material-ui/icons/Edit';

const ROUND_DECIMAL = 5;

function parse(num) {
  if(!isNaN(num)) {
    num = Math.round(num + "e" + ROUND_DECIMAL);
    return Number(num + "e" + -ROUND_DECIMAL);
  } else {
    return Number(0.0);
  }
}


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
  let qualityData = _.get(state, path);
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
      Header: 'Gross weight (Kg)',
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
              label="Empty cone wt. (Kg)"
              name="emptyConeWt"
              value={data.emptyConeWt}
              onChange={onChange}
              type="number"
            />
          </Grid>
          <Grid item lg={3} md={2} sm={12} xs={12}>
            <InputText
              label="Total empty bag wt. (Kg)"
              name="emptyBagWt"
              value={data.emptyBagWt}
              onChange={onChange}
              type="number"
            />
          </Grid>
          <Grid item lg={3} md={2} sm={12} xs={12}>
            <InputText
              label="Net wt. (Kg)"
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
      partyId: outwardValue.partyId,
      weaverId: outwardValue.weaverId,
      ...bag,
    });
  });

  return newVal;
}

function YarnOutwardDialog({ open, parties, weavers,...props }) {
  const defaultOutward = {
    design: '',
    meter: '',
    totalEnds: '',
    bags: [],
    date: new Date(),
  };
  const defaults = {
    outwards: [defaultOutward],
  };
  const [outwardValue, outwardDispatch] = useReducer(outwardValueReducer, defaults);
  const [partiesOpts, setPartiesOpts] = useState([]);
  const [weaverOpts, setWeaverOpts] = useState([]);
  const [qualityOpts, setQualityOpts] = useState([]);

  useEffect(()=>{
    if(open) {
      setPartiesOpts(parties.map((party)=>({label: party.name, value: party.id})));
      setWeaverOpts(weavers.map((party)=>({label: party.name, value: party.id})));
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


  function updateoutwardValues(e, name) {
    if(e.target) {
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
      sectionTitle="Yarn outward"
      {...props}
      onSave={() => {
        props.onSave(parseOutwardValue(outwardValue));
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
                  value={partiesOpts.filter((party)=>party.value===outwardValue.partyId)}
                  onChange={(value)=>{
                    updateoutwardValues(value.value, 'partyId')
                  }}
                  options={partiesOpts}
                />
              </FormField>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormField label="Weaver">
                <Select
                  value={weaverOpts.filter((party)=>party.value===outwardValue.weaverId)}
                  onChange={(value)=>{
                    updateoutwardValues(value.value, 'weaverId')
                  }}
                  options={weaverOpts}
                />
              </FormField>
            </Grid>
          </Grid>
          <Box p={1}></Box>
          {outwardValue.outwards.map((design, i)=>{
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
          <Button color="primary" variant="outlined" onClick={()=>{
            outwardDispatch({
              type: 'add_grid_row',
              path: ['outwards'],
              value: defaultOutward,
            });
          }}>Add outward</Button>
        </Grid>
      </Grid>
    </DraggableDialog>
  );
}

class YarnOutward extends React.Component {
  componentDidMount() {
    axios.get(`/api/parties`).then((res) => {
      const parties = res.data.filter((p)=>p.isWeaver==='Party');
      const weavers = res.data.filter((p)=>p.isWeaver==='Weaver');
      this.setState({ parties, weavers });
    });
    axios.get(`/api/outward`).then((res) => {
      const outwards = res.data;
      this.setState({ outwards });
    });
  }

  state = {
    radioValue: 'Yes',
    outwards: [],
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
              // onClick={() => {
              //   this.editInward(row);
              // }}
            >
              <EditIcon />
            </IconButton>
          );
        },
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
        accessor: 'qualityId',
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

  saveDetails(outwardValue) {
    outwardValue.forEach((singleOut)=>{
      axios.post('/api/outward', singleOut)
      .then((res)=>{
        this.setState((prevState) => {
          return { outwards: [...prevState.outwards, res.data] };
        });
      })
      .catch((err)=>{
        console.log(err)
      });
    })
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
              Add yarn outward
            </Button>
          </Box>
        </Box>
        <Box>
          <TableComponent
            columns={this.state.columns}
            data={this.state.outwards}
            filterText={this.state.filter}
          />
        </Box>
        <YarnOutwardDialog
          open={this.state.dialogOpen}
          onClose={() => this.showDialog(false)}
          onSave={(outwardValue) => this.saveDetails(outwardValue)}
          parties={this.state.parties}
          weavers={this.state.weavers}
        />
      </Box>
    );
  }
}

export default YarnOutward;
