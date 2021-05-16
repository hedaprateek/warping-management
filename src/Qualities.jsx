import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
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
import EditIcon from '@material-ui/icons/Edit';

function QualitiesDialog({ open, ...props }) {
  const defaults = {};

  const [validator, setValidator] = useState(new SimpleReactValidator());
  const [isEdit, setIsEdit] = useState(false);
  const editModeQuality = props.editModeQualityValue;
  const isUniqueName = props.isUniqueName;

  const [qualityValue, setQualityValue] = useState(defaults);

  useEffect(() => {
    if (editModeQuality && editModeQuality.id) {
      setIsEdit(true);
      setQualityValue(editModeQuality);
    } else {
      setIsEdit(false);
      setQualityValue(defaults);
    }
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
        props.onSave(qualityValue, validator, isEdit);
      }}
    >
      {isUniqueName == 'false' && <h4>Quality name should be unique</h4>}
      <Grid container spacing={2}>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <InputText
            label="Quality Name"
            variant="outlined"
            fullWidth
            id="name"
            value={qualityValue.name}
            onChange={updateQualityValues}
            errorMsg={validator.message(
              'Yarn type',
              qualityValue.name,
              'required'
            )}
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
            errorMsg={validator.message(
              'count',
              qualityValue.desc,
              'required|numeric'
            )}
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

  editQuality(row) {
    console.log('Prateek', row);
    this.showDialog(true);
    if (row && row.values) this.state.editModeQualityValue = row.original;
  }

  state = {
    editModeQualityValue: [],
    radioValue: 'Yes',
    qualities: [],
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
              onClick={() => {
                this.editQuality(row);
              }}
            >
              <EditIcon />
            </IconButton>
          );
        },
      },
      {
        Header: 'Quality Name',
        accessor: 'name', // accessor is the "key" in the data
      },
      {
        Header: 'Count',
        accessor: 'desc',
      },
    ],
  };

  showDialog(show) {
    this.state.isUniqueName = 'true';

    if (!show) {
      this.state.editModeQualityValue = [];
    }
    this.setState({ dialogOpen: show });
  }

  saveDetails(qualityValue, validator, isEdit) {
    let editQualityName = '';
    if (isEdit) {
      editQualityName = qualityValue.name;
    }
    this.state.isUniqueName = 'true';
    let isUniqueNameList = this.state.qualities.filter((quality) => {
      if (editQualityName) {
        return quality?.name?.toUpperCase() === editQualityName.toUpperCase();
      } else {
        return (
          quality?.name?.toUpperCase() === qualityValue?.name?.toUpperCase()
        );
      }
    });

    if (isUniqueNameList && isUniqueNameList.length > 0) {
      this.state.isUniqueName = 'false';
    }
    if (validator.allValid() && this.state.isUniqueName === 'true') {
      console.log(qualityValue);

      if (isEdit) {
        axios
          .put(`/api/qualities/` + qualityValue.id, qualityValue, {
            headers: {
              'content-type': 'application/json',
            },
          })
          .then((res) => {
            // const parties = this.state.parties;
            // const latestData = res.data;
            let indx = this.setState((prevState) => {
              let indx = prevState.qualities.findIndex(
                (i) => i.id === qualityValue.id
              );
              return {
                qualities: [
                  ...prevState.qualities.slice(0, indx),
                  qualityValue,
                  ...prevState.qualities.slice(indx + 1),
                ],
              };
            });
          });
      } else {
        axios
          .post(`/api/qualities`, qualityValue, {
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
      }
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
        <Box p={1} style={{ paddingLeft: '2%' }}>
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
          onSave={(qualityValue, validator, isEdit) =>
            this.saveDetails(qualityValue, validator, isEdit)
          }
          isUniqueName={this.state.isUniqueName}
          editModeQualityValue={this.state.editModeQualityValue}
        />
      </Box>
    );
  }
}

export default Qualities;
