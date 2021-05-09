import { Box, Button, Grid, InputLabel, makeStyles, MenuItem, TextField, Select as MUISelect, Typography } from '@material-ui/core';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ReportTable } from './CommonReport';
import axios from 'axios';
import ReportViewer from './ReportViewer';
import Select from 'react-select';
import {FormField, InputDate, InputSelectSearch} from '../FormElements';
import { parse } from '../utils';


const useStyles = makeStyles((theme)=>({
  reportContainer: {
    height: '100%',
    overflow: 'auto',
    flexGrow: 1,
    minHeight: 0,
  }
}));

const REPORT_NAME = 'OUTWARD REPORT';

export default function OutwardReport(props) {
  const classes = useStyles();
  const [dateType, setDateType] = useState('custom-date');
  const [filter, setFilter] = useState({
    party_id: null,
    qualities: [],
    from_date: new Date(),
    to_date: new Date(),
  });
  const [data, setData] = useState([]);
  const [partiesOpts, setPartiesOpts] = useState([]);

  useEffect(()=>{
    let today = new Date();
    let from_date = new Date();
    let to_date = new Date();

    if(dateType === 'current' || dateType === 'last-f') {
      from_date.setMonth(3);
      from_date.setDate(1);
      to_date.setMonth(2);
      to_date.setDate(31);

      if(today.getMonth()+1 <= 3) {
        let yearDiff = dateType === 'current' ? 0 : 1;
        from_date.setFullYear(today.getFullYear()-1-yearDiff);
        to_date.setFullYear(today.getFullYear()-yearDiff);
      } else {
        let yearDiff = dateType === 'current' ? 1 : 0;
        from_date.setFullYear(today.getFullYear()-1+yearDiff);
        to_date.setFullYear(today.getFullYear()+yearDiff);
      }
    } else if(dateType === 'last-m') {
      let year = today.getMonth() === 0 ? today.getFullYear() -1 : today.getFullYear();
      let month = today.getMonth() === 0 ? 11 : today.getMonth() - 1;
      from_date = new Date(year, month, 1);
      to_date = new Date(year, month + 1, 0);
    }

    setFilter((prev)=>({
      ...prev,
      from_date: from_date,
      to_date: to_date,
    }));
  }, [dateType])

  const onChange = (e)=>{
    setFilter((prev)=>({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  const columns = useMemo(()=>[
    {
      Header: 'Date',
      accessor: 'date',
    },
    {
      Header: 'Party Name',
      accessor: 'party',
    },
    {
      Header: 'Gatepass No.',
      accessor: 'gatepass',
    },
    {
      Header: 'Quality',
      accessor: 'quality',
    },
    {
      Header: 'Lot number',
      accessor: 'lotNo',
    },
    {
      Header: 'Net Wt.',
      accessor: 'netWt',
    },
  ]);

  const onReportClick = ()=>{
    axios.get('/api/reports/outward', {
      params: {
        ...filter,
      }
    })
    .then((res)=>{
      console.log(res.data);
      setData(res.data);
    })
    .catch((err)=>{
      console.log(err);
    });
  };

  useEffect(()=>{
    axios.get('/api/parties')
      .then((res)=>{
        setPartiesOpts(res.data.map((party)=>({label: party.name, value: party.id})));
      })
      .catch((err)=>{
        console.log(err);
      });
  }, []);

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box p={1}>
        <Grid container spacing={2}>
          <Grid item md={4} xs={12}>
              <InputSelectSearch
                value={partiesOpts.filter(
                  (party) => party.value === filter.party_id
                )}
                onChange={(op) => {
                  setFilter((prev) => ({ ...prev, party_id: op?.value }));
                }}
                options={partiesOpts}
                label="Party"
                isClearable
              />
          </Grid>
        </Grid>
      </Box>
      <Box p={1}>
        <Grid container spacing={2}>
          <Grid item md={4} xs={12}>
            <FormField label="Date type">
              <MUISelect
                value={dateType}
                onChange={(e) => setDateType(e.target.value)}
                variant="outlined"
                name="date_type"
                margin="dense"
                fullWidth
              >
                <MenuItem value={'current'}>Current financial year</MenuItem>
                <MenuItem value={'last-m'}>Last month</MenuItem>
                <MenuItem value={'custom-date'}>Custom data range</MenuItem>
                <MenuItem value={'last-f'}>Last financial year</MenuItem>
              </MUISelect>
            </FormField>
          </Grid>
          <Grid item md={2} xs={12}>
            <InputDate
              label="From date"
              value={filter.from_date}
              onChange={(value) => {
                setFilter((prev) => ({ ...prev, from_date: value }));
              }}
            />
          </Grid>
          <Grid item md={2} xs={12}>
            <InputDate
              label="To date"
              value={filter.to_date}
              onChange={(value) => {
                setFilter((prev) => ({ ...prev, to_date: value }));
              }}
            />
          </Grid>
          <Grid item md={4} xs={12} style={{ display: 'flex' }}>
            <Button
              color="primary"
              variant="contained"
              style={{ marginTop: 'auto' }}
              onClick={onReportClick}
            >
              Get report
            </Button>
          </Grid>
        </Grid>
      </Box>
      <ReportViewer reportName={REPORT_NAME}>
        <FinalReport data={data} />
      </ReportViewer>
    </Box>
  );
}

function FinalReport({data}) {
  let programData = data['programData'] || {};
  let outwardData = data['outwardData'] || {};
  let inwardData = data['inwardData'] || {};

  let allQualityTotals = {};
  Object.keys(inwardData).map((qualityId)=>{
    let qualityTotals = allQualityTotals[qualityId] = allQualityTotals[qualityId] || {
      netWt: 0,
      outWt: 0,
    }
    let inwards = inwardData[qualityId];
    inwards.forEach((q)=>{
      qualityTotals.netWt += q.netWt;
    });

    Object.keys(programData).map((weaver)=>{
      let programs = programData[weaver];
      console.log(programs);
      programs.forEach((p)=>{
        p.qualities.forEach((q)=>{
          console.log(q, qualityId);
          if(q.qualityId == qualityId) {
            qualityTotals.outWt += q.usedYarn;
          }
        })
      })
    });
  });
  return (
    <>
      <Typography style={{fontWeight: 'bold', textAlign: 'center', textDecoration: 'underline'}}>Beam details</Typography>
      {Object.keys(programData).map((weaverName, i)=>{
        let weaver = programData[weaverName];
        return (
          <>
          <Typography>Weaver: {weaverName}</Typography>
          <ReportTable data={weaver} columns={[
            {
              Header: 'Design',
              accessor: 'design',
            },
            {
              Header: 'Total Meter',
              accessor: 'totalMeter',
            },
            {
              Header: 'Total Ends',
              accessor: 'totalEnds',
            },
            {
              Header: 'Actual Used Ends',
              accessor: 'actualUsedYarn',
            },
          ]}/>
          </>
        )
      })}
      <Typography style={{fontWeight: 'bold', textAlign: 'center', textDecoration: 'underline'}}>Yarn Outward</Typography>
      {Object.keys(outwardData).map((weaverName)=>{
        let weaver = outwardData[weaverName];
        return (
          <>
          <Typography>Weaver: {weaverName}</Typography>
          <ReportTable data={weaver} columns={[
            {
              Header: 'Quality',
              accessor: 'qualityId',
            },
            {
              Header: 'Total cones',
              accessor: (row)=>{
                let total = 0;
                row.bags.forEach((b)=>{
                  total += parse(b.cones);
                });
                return total;
              },
            },
            {
              Header: 'Net Wt.',
              accessor: 'netWt',
            },
          ]}/>
          </>
        )
      })}
      <Typography style={{fontWeight: 'bold', textAlign: 'center', textDecoration: 'underline'}}>Yarn Details</Typography>
      <ReportTable data={Object.keys(allQualityTotals).map((q)=>({qualityId: q, ...allQualityTotals[q]}))} columns={[
        {
          Header: 'qualityId',
          accessor: 'qualityId',
        },
        {
          Header: 'outWt',
          accessor: 'outWt',
        },
        {
          Header: 'Net Wt.',
          accessor: 'netWt',
        },
      ]}/>
    </>
  )
}