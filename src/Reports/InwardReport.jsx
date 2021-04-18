import { Box, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';


export default function InwardReport(props) {
  const [filter, setFilter] = useState({
    date_type: 0,
  });

  const onChange = (e)=>{
    setFilter((prev)=>({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }
  return (
  <Box p={1}>
    <Grid container spacing={2}>
      <Grid item md={3} xs={12}>
        <TextField fullWidth />
      </Grid>
      <Grid item md={3} xs={12}>
        <TextField fullWidth />
      </Grid>
      <Grid item md={3} xs={12}>
      </Grid>
      <Grid item md={3} xs={12}>
      </Grid>
    </Grid>
    <Grid container spacing={2}>
      <Grid item md={3} xs={12}>
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
      <Grid item md={3} xs={12}>
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="MM/dd/yyyy"
          margin="normal"
          id="date-picker-inline"
          label="Date picker inline"
          // value={selectedDate}
          onChange={()=>{}}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
      </Grid>
      <Grid item md={3} xs={12}>
      </Grid>
      <Grid item md={3} xs={12}>
      </Grid>
    </Grid>
  </Box>);
}