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
import DraggableDialog from '../../helpers/DraggableDialog';
import { FormField, InputSelect, InputText } from '../../components/FormElements';
import { NOTIFICATION_TYPE, setNotification } from '../../store/reducers/notification';
import { connect } from 'react-redux';
import { commonUniqueChecker, getAxiosErr } from '../../utils';
import { ResultsTable } from '../../components/ResultsTable';

function QualitiesDialog({ open, ...props }) {
  const defaults = {};

  const [validator, setValidator] = useState(new SimpleReactValidator());
  const [isEdit, setIsEdit] = useState(false);
  const editModeQuality = props.editModeQualityValue;
  const [qualityValue, setQualityValue] = useState(defaults);
  const [isNameUnique, setIsNameUnique] = useState(true);

  useEffect(() => {
    if (editModeQuality && editModeQuality.id) {
      setIsEdit(true);
      setQualityValue(editModeQuality);
    } else {
      setIsEdit(false);
      setQualityValue(defaults);
    }
    setIsNameUnique(true);
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
      isEdit={isEdit}
      {...props}
      onSave={() => {
        if(props.isUnique(qualityValue.name, isEdit)) {
          props.onSave(qualityValue, validator, isEdit);
        } else {
          setIsNameUnique(false);
        }
      }}
    >
      {!isNameUnique && <h4>Quality name should be unique</h4>}
      <Grid container spacing={2}>
        <Grid item xs={12}>
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
      </Grid>
      <Grid container spacing={2}>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <InputText
            label="Min Count"
            variant="outlined"
            fullWidth
            id="minCount"
            value={qualityValue.minCount}
            onChange={updateQualityValues}
            errorMsg={validator.message(
              'minCount',
              qualityValue.minCount,
              'required|numeric'
            )}
          />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <InputText
            label="Max Count"
            variant="outlined"
            fullWidth
            id="maxCount"
            value={qualityValue.maxCount}
            onChange={updateQualityValues}
            errorMsg={validator.message(
              'maxCount',
              qualityValue.maxCount,
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
    axios.get(`/api/qualities`).then((res) => {
      const qualities = res.data;
      this.setState({ qualities });
    });
  }

  editQuality(row) {
    this.setState({editModeQualityValue: row});
    this.showDialog(true);
  }

  state = {
    editModeQualityValue: null,
    radioValue: 'Yes',
    qualities: [],
    filter: '',
    dialogOpen: false,
    columns: [
      {
        name: 'Quality Name',
        key: 'name',
      },
      {
        name: 'Min Count',
        key: 'minCount',
      },
      {
        name: 'Max Count',
        key: 'maxCount',
      },
    ],
  };

  showDialog(show) {
    if (!show) {
      this.setState({
        editModeQualityValue: null,
      });
    }
    this.setState({ dialogOpen: show });
  }

  saveDetails(qualityValue, validator, isEdit) {
    if (validator.allValid()) {
      console.log(qualityValue);

      if (isEdit) {
        axios
          .put(`/api/qualities/` + qualityValue.id, qualityValue, {
            headers: {
              'content-type': 'application/json',
            },
          })
          .then((res) => {
            this.props.setNotification(NOTIFICATION_TYPE.SUCCESS, 'Quality updated successfully');
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
          })
          .catch((err)=>{
            console.log(err);
            this.props.setNotification(NOTIFICATION_TYPE.ERROR, getAxiosErr(err));
          });
      } else {
        axios
          .post(`/api/qualities`, qualityValue, {
            headers: {
              'content-type': 'application/json',
            },
          })
          .then((res) => {
            this.props.setNotification(NOTIFICATION_TYPE.SUCCESS, 'Quality added successfully');
            const qualities = this.state.qualities;
            const latestData = res.data;
            this.setState((prevState) => {
              return {
                qualities: [...prevState.qualities, latestData],
              };
            });
          })
          .catch((err)=>{
            console.log(err);
            this.props.setNotification(NOTIFICATION_TYPE.ERROR, getAxiosErr(err));
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
      <>
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
        <Box flexGrow="1" p={1}>
          <ResultsTable
            columns={this.state.columns}
            rows={this.state.qualities}
            onEditClick={this.editQuality.bind(this)}
            filterText={this.state.filter}
          />
        </Box>
        <QualitiesDialog
          open={this.state.dialogOpen}
          onClose={() => this.showDialog(false)}
          onSave={(qualityValue, validator, isEdit) =>
            this.saveDetails(qualityValue, validator, isEdit)
          }
          isUnique={(name, isEdit)=>commonUniqueChecker(name, this.state.qualities, isEdit, this.state.editModeQualityValue?.name)}
          editModeQualityValue={this.state.editModeQualityValue}
        />
      </>
    );
  }
}

export default connect(()=>({}), (dispatch)=>({
  setNotification: (...args)=>{dispatch(setNotification.apply(this, args))},
}))(Qualities);
