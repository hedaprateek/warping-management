import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import DraggableDialog from './DraggableDialog';
import { FormField, InputSelect, InputText } from './FormElements';
import TableComponent from './TableComponent';

function QualitiesDialog({ open, ...props }) {
  const defaults = {};

  const [validator, setValidator] = useState(new SimpleReactValidator());

  const [qualityValue, setQualityValue] = useState(defaults);

  useEffect(() => {
    setQualityValue(defaults);
    setValidator(new SimpleReactValidator());
  }, [open]);
  function updateQualityValues(e) {
    setQualityValue((prevValue) => {
      if (e.target.id) {
        return { ...prevValue, [e.target.id]: e.target.value };
      } else {
        return { ...prevValue, [e.target.name]: e.target.value };
      }
    });
  }

  return (
    <DraggableDialog
      open={open}
      sectionTitle="Quality"
      {...props}
      onSave={() => {
        props.onSave(qualityValue, validator);
      }}
    >
      <Grid container spacing={2}>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <InputText
            label="Yarn Type"
            variant="outlined"
            fullWidth
            id="name"
            value={qualityValue.name}
            onChange={updateQualityValues}
            errorMsg={validator.message('Yarn type', qualityValue.name, 'required')}
          />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <InputText
            label="Count"
            variant="outlined"
            fullWidth
            id="desc"
            value={qualityValue.desc}
            onChange={updateQualityValues}
            errorMsg={validator.message('count', qualityValue.desc, 'required|numeric')}
          />
        </Grid>
      </Grid>
    </DraggableDialog>
  );
}
class Qualities extends React.Component {
  componentDidMount() {
    axios.get(`http://localhost:7227/api/qualities`).then((res) => {
      const qualities = res.data;
      this.setState({ qualities });
      console.log('qualities', qualities);
    });
  }

  state = {
    radioValue: 'Yes',
    qualities: [],
    filter: '',
    dialogOpen: false,
    columns: [
      {
        Header: 'YARN TYPE',
        accessor: 'name', // accessor is the "key" in the data
      },
      {
        Header: 'COUNT',
        accessor: 'desc',
      },
    ],
  };

  showDialog(show) {
    this.setState({ dialogOpen: show });
  }

  saveDetails(qualityValue, validator) {

    if (validator.allValid()) {
       console.log(qualityValue);

       axios
         .post(`http://localhost:7227/api/qualities`, qualityValue, {
           headers: {
             'content-type': 'application/json',
           },
         })
         .then((res) => {
           const qualities = this.state.qualities;
           const latestData = res.data;
           this.setState((prevState) => {
             return {
               qualities: [...prevState.qualities, latestData],
             };
           });
         });

       this.showDialog(false);
    } else {
      validator.showMessages();
      // rerender to show messages for the first time
      // you can use the autoForceUpdate option to do this automatically`
      this.forceUpdate();
    }
    
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
              Add Quality
            </Button>
          </Box>
        </Box>
        <Box>
          <TableComponent
            columns={this.state.columns}
            data={this.state.qualities}
            filterText={this.state.filter}
          />
        </Box>
        <QualitiesDialog
          open={this.state.dialogOpen}
          onClose={() => this.showDialog(false)}
          onSave={(qualityValue, validator) => this.saveDetails(qualityValue, validator)}
        />
      </Box>
    );
  }
}

export default Qualities;
