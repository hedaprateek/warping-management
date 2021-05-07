import { Box, Button, FormControl, Grid, InputLabel, makeStyles, MenuItem, TextField, Select as MUISelect, Typography } from '@material-ui/core';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import CommonReport, { ReportTable } from './CommonReport';
import ReactToPrint from 'react-to-print';
import TableComponent from '../TableComponent';
import axios from 'axios';
import ReportViewer from './ReportViewer';
import Select from 'react-select';
import {FormField, InputDate, InputSelectSearch} from '../FormElements';
import { parse } from '../utils';


const useStyles = makeStyles((theme)=>({
  reportContainer: {
    // backgroundColor: theme.palette.grey[100],
    height: '100%',
    overflow: 'auto',
    flexGrow: 1,
    minHeight: 0,
  }
}));

export default function InwardReport(props) {
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
  const [qualityOpts, setQualityOpts] = useState([]);

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
    axios.get('/api/reports/inward', {
      params: {
        ...filter,
      }
    })
    .then((res)=>{
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

    axios.get('/api/qualities')
      .then((res)=>{
        setQualityOpts(res.data.map((quality)=>({label: quality.name, value: quality.id})));
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
          <Grid item md={4} xs={12}>
            <FormField label="Qualities">
              <Select
                isMulti
                value={qualityOpts.filter(
                  (quality) => filter.qualities.indexOf(quality.value) > -1
                )}
                onChange={(values) => {
                  setFilter((prev) => ({
                    ...prev,
                    qualities: values.map((value) => value.value),
                  }));
                }}
                options={qualityOpts}
              />
            </FormField>
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
      <ReportViewer>
        <FinalReport data={data} />

        {/* <CommonReport columns={columns} data={data} /> */}
      </ReportViewer>
    </Box>
  );
}
// {"party1":{"q1":[{"date":"2021-05-07","gatepass":"123","lotNo":"1","netWt":123}]}}

function FinalReport({data}) {
  return (
    <>
      {Object.keys(data).map((partyName)=>{
        let party = data[partyName];
        return (
          <>
          <Box borderTop={1} margin={1}></Box>
          <Typography>Party: {partyName}</Typography>
          {Object.keys(party).map((qualityName)=>{
            let quality = party[qualityName];
            return (
              <>
              <Typography>Quality: {qualityName}</Typography>
              <ReportTable showFooter data={quality} columns={[
                {
                  Header: 'Date',
                  accessor: 'date',
                },
                {
                  Header: 'Gatepass No.',
                  accessor: 'gatepass',
                },
                {
                  Header: 'Lot number',
                  accessor: 'lotNo',
                  Footer: (info)=>{
                    return <span style={{fontWeight: 'bold'}}>Total</span>
                  }
                },
                {
                  Header: 'Net Wt.',
                  accessor: 'netWt',
                  Footer: (info)=>{
                    let total = info.rows.reduce((sum, row) => {
                        return (row.values[info.column.id] || 0) + sum
                      }, 0
                    );
                    total = parse(total);
                    return <span style={{fontWeight: 'bold'}}>{total}</span>
                  }
                },
              ]}/>
              </>
            )
          })}
          </>
        )
      })}
      <ReportTable columns={[]}/>
    </>
  )
}