import { Box, Button, FormControl, Grid, InputLabel, makeStyles, MenuItem, Select, TextField } from '@material-ui/core';
import React, { useMemo, useRef, useState } from 'react';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import CommonReport from './CommonReport';
import ReactToPrint from 'react-to-print';
import TableComponent from '../TableComponent';
import axios from 'axios';


const useStyles = makeStyles((theme)=>({
  reportContainer: {
    // backgroundColor: theme.palette.grey[100],
  }
}));

export default function InwardReport(props) {
  const classes = useStyles();
  const [filter, setFilter] = useState({
    date_type: 0,
  });
  const [data, setData] = useState([]);
  const reportRef = useRef();

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
      accessor: 'lotnumber',
    },
    {
      Header: 'Net Wt.',
      accessor: 'netwt',
    },
  ]);

  const onReportClick = ()=>{
    // axios.
  };

  return (
  <Box p={1}>
    <Box>
      <Grid container spacing={3}>
        <Grid item md={4} xs={12}>
          <TextField fullWidth />
        </Grid>
        <Grid item md={4} xs={12}>
          <TextField fullWidth />
        </Grid>
      </Grid>
    </Box>
    <Box>
      <Grid container spacing={3}>
        <Grid item md={4} xs={12}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Date type</InputLabel>
            <Select
              value={filter.date_type}
              onChange={onChange}
              label="Date type"
              variant="outlined"
              name="date_type"
              margin="dense"
            >
              <MenuItem value={0}>Last financial year</MenuItem>
              <MenuItem value={1}>Last month</MenuItem>
              <MenuItem value={2}>Custom data range</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={2} xs={12}>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            id="date-picker-inline"
            label="Date picker inline"
            // value={selectedDate}
            onChange={()=>{}}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
            fullWidth
          />
        </Grid>
        <Grid item md={2} xs={12}>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            id="date-picker-inline"
            label="Date picker inline"
            // value={selectedDate}
            onChange={()=>{}}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
            fullWidth
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <Button color="primary" variant="contained" style={{marginRight: '0.5rem'}}>Get report</Button>
          <ReactToPrint
            trigger={()=>
                <Button color="primary" variant="outlined">
                    Print
                </Button>}
            content={()=>reportRef.current}
          />
        </Grid>
      </Grid>
    </Box>
    <Box flexGrow="1" height="100%" className={classes.reportContainer}>
      <CommonReport ref={reportRef} columns={columns} data={data}/>
    </Box>
  </Box>);
}