import React from 'react';
import { Box, makeStyles, MenuItem, OutlinedInput, Select } from "@material-ui/core";

const useStyles = makeStyles((theme)=>({
  formLabel: {
    color: theme.palette.text.primary,
  }
}));

export function FormField({label, children}) {
  const classes = useStyles();
  return (
    <Box>
      {label && <Box p={0.5} className={classes.formLabel}>{label}</Box>}
      <Box>{children}</Box>
    </Box>
  );
}

export function InputText({label, ...props}) {
  return (
    <FormField label={label}>
      <OutlinedInput margin="dense" {...props} fullWidth />
    </FormField>
  );
}

export function InputSelect({label, options, ...props}) {
  return (
    <FormField label={label}>
      <Select variant="outlined" margin="dense" fullWidth {...props}>
        {options.map((opt)=>{
          return <MenuItem value={opt.value}>{opt.label}</MenuItem>
        })}
      </Select>
    </FormField>
  );
}