import React from 'react';
import {
  Box,
  makeStyles,
  MenuItem,
  OutlinedInput,
  Select,
  useTheme,
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
  let extraProps = {};
  if(props.type == 'number') {
    extraProps = {
      onWheel: (e) => e.target.blur(),
    }
  }
  return (
    <FormField label={label} isRequired={isRequired}>
      <OutlinedInput
        margin="dense"
        {...props}
        fullWidth
        error={Boolean(errorMsg)}
        /* Needed for type number */
        {...extraProps}
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

const customReactSelectStyles = (theme, readonly)=>({
  input: (provided) => {
    return {...provided, padding: 0, margin: 0};
  },
  control: (provided, state) => ({
    ...provided,
    minHeight: '32px',
    backgroundColor: readonly ? theme.otherVars.inputDisabledBg : theme.palette.background.default,
    ...(state.isFocused ? {
      borderColor: theme.palette.primary.main,
      boxShadow: 'inset 0 0 0 1px '+theme.palette.primary.main,
      '&:hover': {
        borderColor: theme.palette.primary.main,
      }
    } : {}),
  }),
  dropdownIndicator: (provided)=>({
    ...provided,
    padding: '0rem 0.25rem',
  }),
  indicatorsContainer: (provided)=>({
    ...provided,
    ...(readonly ? {display: 'none'} : {})
  }),
  clearIndicator: (provided)=>({
    ...provided,
    padding: '0rem 0.25rem',
  }),
  valueContainer: (provided, state)=>({
    ...provided,
    padding: state.isMulti ? '2px' : theme.otherVars.reactSelect.padding,
  }),
  menuPortal: (provided)=>({ ...provided, zIndex: 9999 }),
  option: (provided)=>({
    ...provided,
    padding: '0.5rem',
  }),
  multiValue: (provided)=>({
    ...provided,
    padding: '2px'
  }),
  multiValueLabel: (provided)=>({
    ...provided,
    fontSize: '1em',
    padding: 0,
    // zIndex: 9999
  }),
  multiValueRemove: (provided)=>({
    ...provided,
    '&:hover': {
      backgroundColor: 'unset',
      color: theme.palette.error.main,
    },
    ...(readonly ? {display: 'none'} : {})
  }),
  menuPortal: (provided) => ({
    ...provided,
    zIndex: '1400',
  }),
});

export function InputSelectSearch({ label, errorMsg, readonly, ...props }) {
  const theme = useTheme();
  return (
    <FormField label={label}>
      <ReactSelect
        menuPortalTarget={document.body}
        {...props}
        isSearchable={!readonly}
        isClearable={!readonly}
        openMenuOnClick={!readonly}
        error={Boolean(errorMsg)}
        styles={customReactSelectStyles(theme, readonly)}
      />
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