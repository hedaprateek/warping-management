import {
  Box,
  Button,
  Grid,
  IconButton,
} from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DraggableDialog from '../../helpers/DraggableDialog';
import { FormField, InputSelect, InputText } from '../../components/FormElements'
import TableComponent from '../../components/TableComponent';
import EditIcon from '@material-ui/icons/Edit';
import { NOTIFICATION_TYPE, setNotification } from '../../store/reducers/notification';
import { connect } from 'react-redux';
import { getAxiosErr } from '../../utils';

function CompaniesDialog({ open, ...props }) {
  const [isEdit, setIsEdit] = useState(false);
  const editModeCompany = props.editModeCompanyValue;
  const isUniqueName = props.isUniqueName;
  const defaults = {
    name: '',
    contact: '',
    address: '',
    gst: '',
    email: '',
  };

  const [companyValue, setCompanyValue] = useState(defaults);

  useEffect(() => {
    if (editModeCompany && editModeCompany.id) {
      setIsEdit(true);
      setCompanyValue(editModeCompany);
    } else {
      setIsEdit(false);
      setCompanyValue(defaults);
    }
  }, [open]);

  function updateCompanyValues(e) {
    setCompanyValue((prevValue) => {
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
      sectionTitle="Company Account"
      {...props}
      onSave={() => {
        props.onSave(companyValue, isEdit);
      }}
    >
      {isUniqueName == 'false' && <h4>Company name should be unique</h4>}

      <Grid container spacing={2}>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <InputText
            label="Name"
            id="name"
            value={companyValue.name}
            onChange={updateCompanyValues}
            autoFocus
          />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <InputText
            label="Contact"
            id="contact"
            value={companyValue.contact}
            onChange={updateCompanyValues}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <InputText
            label="GSTIN"
            id="gst"
            value={companyValue.gst}
            onChange={updateCompanyValues}
          />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <InputText
            label="Email"
            id="email"
            value={companyValue.email}
            onChange={updateCompanyValues}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <InputText
            multiline
            rows={4}
            fullWidth
            label="Address"
            id="address"
            value={companyValue.address}
            onChange={updateCompanyValues}
          />
        </Grid>
      </Grid>
    </DraggableDialog>
  );
}

class CompanyAccounts extends React.Component {
  componentDidMount() {
    axios.get(`/api/companies`).then((res) => {
      const companies = res.data;
      this.setState({ companies });
    });
  }

  editCompany(row) {
    this.showDialog(true);
    if (row && row.values) this.state.editModeCompanyValue = row.original;
  }
  state = {
    isUniqueName: 'true',
    editModeCompanyValue: [],
    radioValue: 'Yes',
    companies: [],
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
                this.editCompany(row);
              }}
            >
              <EditIcon />
            </IconButton>
          );
        },
      },
      {
        Header: 'Company Name',
        accessor: 'name', // accessor is the "key" in the data
      },
      {
        Header: 'Address',
        accessor: 'address',
      },
      {
        Header: 'GSTIN',
        accessor: 'gst', // accessor is the "key" in the data
      },
      {
        Header: 'Contact No.',
        accessor: 'contact',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
    ],
  };

  showDialog(show) {
    this.state.isUniqueName = 'true';
    if (!show) {
      this.state.editModeCompanyValue = [];
    }
    this.setState({ dialogOpen: show });
  }

  saveDetails(companyValue, isEdit) {
    let editCompanyName = '';
    if (isEdit) {
      editCompanyName = companyValue.name;
    }
    this.state.isUniqueName = 'true';
    let isUniqueNameList = this.state.companies.filter((Company) => {
      if (editCompanyName) {
        return Company?.name?.toUpperCase() === editCompanyName.toUpperCase();
      } else {
        return Company?.name?.toUpperCase() === companyValue?.name?.toUpperCase();
      }
    });

    if (isUniqueNameList && isUniqueNameList.length > 0) {
      this.state.isUniqueName = 'false';
    }
    this.state.isUniqueName = 'true';
    if (isEdit) {
      axios
        .put(`/api/companies/` + companyValue.id, companyValue, {
          headers: {
            'content-type': 'application/json',
          },
        })
        .then((res) => {
          this.props.setNotification(NOTIFICATION_TYPE.SUCCESS, 'Company updated successfully');
          let indx = this.setState((prevState) => {
            let indx = prevState.companies.findIndex(
              (i) => i.id === companyValue.id
            );
            return {
              companies: [
                ...prevState.companies.slice(0, indx),
                companyValue,
                ...prevState.companies.slice(indx + 1),
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
        .post(`/api/companies`, companyValue, {
          headers: {
            'content-type': 'application/json',
          },
        })
        .then((res) => {
          this.props.setNotification(NOTIFICATION_TYPE.SUCCESS, 'Company added successfully');
          const latestData = res.data;
          // this.state.companies.push(latestData);
          this.setState((prevState) => {
            return { companies: [...prevState.companies, latestData] };
          });
        })
        .catch((err)=>{
          console.log(err);
          this.props.setNotification(NOTIFICATION_TYPE.ERROR, getAxiosErr(err));
        });
    }
    this.showDialog(false);
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
              Add Company
            </Button>
          </Box>
        </Box>
        <Box>
          <TableComponent
            columns={this.state.columns}
            data={this.state.companies}
            filterText={this.state.filter}
          />
        </Box>
        <CompaniesDialog
          open={this.state.dialogOpen}
          onClose={() => this.showDialog(false)}
          onSave={(companyValue, isEdit) =>
            this.saveDetails(companyValue, isEdit)
          }
          isUniqueName={this.state.isUniqueName}
          editModeCompanyValue={this.state.editModeCompanyValue}
        />
      </Box>
    );
  }
}

export default connect(()=>({}), (dispatch)=>({
  setNotification: (...args)=>{dispatch(setNotification.apply(this, args))},
}))(CompanyAccounts);
