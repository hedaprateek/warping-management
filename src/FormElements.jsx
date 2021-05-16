import React from 'react';
import {
  Box,
  makeStyles,
  MenuItem,
  OutlinedInput,
  Select,
} from '@material-ui/core';
import ReactSelect from 'react-select';
import { KeyboardDatePicker } from '@material-ui/pickers';

const useStyles = makeStyles((theme) => ({
  formLabel: {
    color: theme.palette.text.primary,
  },
}));

export function FormField({ label, isRequired, children }) {
  const classes = useStyles();
  return (
    <Box>
      {label && (
        <Box p={0.5} className={classes.formLabel}>
          {label} {isRequired && <span style={{ color: 'red' }}>*</span>}
        </Box>
      )}
      <Box>{children}</Box>
    </Box>
  );
}

export function InputText({ label, errorMsg, isRequired, ...props }) {
  return (
    <FormField label={label} isRequired={isRequired}>
      <OutlinedInput
        margin="dense"
        {...props}
        fullWidth
        error={Boolean(errorMsg)}
      />
      {errorMsg}
    </FormField>
  );
}

export function InputSelect({ label, options, ...props }) {
  return (
    <FormField label={label}>
      <Select variant="outlined" margin="dense" fullWidth {...props}>
        {options.map((opt) => {
          return <MenuItem value={opt.value}>{opt.label}</MenuItem>;
        })}
      </Select>
    </FormField>
  );
}

export function InputSelectSearch({ label, errorMsg, ...props }) {
  return (
    <FormField label={label}>
      <ReactSelect {...props} error={Boolean(errorMsg)} maxMenuHeight={190} />
      {errorMsg}
    </FormField>
  );
}

export function InputDate({ label, ...props }) {
  return (
    <FormField label={label}>
      <KeyboardDatePicker
        margin="none"
        format="dd/MM/yyyy"
        KeyboardButtonProps={{
          'aria-label': 'change date',
        }}
        fullWidth
        {...props}
      />
    </FormField>
  );
}