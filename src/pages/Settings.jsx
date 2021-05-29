import { Button, Grid } from '@material-ui/core';
import axios from 'axios';
import React from 'react';
import { InputText } from '../components/FormElements';

class Settings extends React.Component {
  constructor() {
    super();
    this.updateCompanyValues = this.updateCompanyValues.bind(this);
    this.updateCompanyDetails = this.updateCompanyDetails.bind(this);
  }
  componentDidMount() {
    axios.get(`/api/settings`).then((res) => {
      const companyDetails = res.data;
      this.setState({ ...companyDetails });
      console.log('companyDetails', this.state);
    });
  }

  state = {
    companyName: '',
    companyAddress: '',
    companyGst: '',
    companyContact: '',
    emailId: '',
  };

  updateCompanyValues(e) {
    console.log('Updated', e);
    const { id, value } = e.target;
    this.setState(() => ({
      [id]: value,
    }));
  }
  updateCompanyDetails() {
    console.log('Saved');
    axios
      .put(`/api/settings`, this.state, {
        headers: {
          'content-type': 'application/json',
        },
      })
      .then((res) => {
        const companyDetails1 = res.data;
        this.setState({ companyDetails1 });
      });
  }

  render() {
    return (
      <div>
        <h3>Company Settings</h3>

        <Grid container spacing={2}>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <InputText
              label="Company Name"
              id="companyName"
              value={this.state.companyName}
              onChange={this.updateCompanyValues}
            />
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <InputText
              label="Address"
              id="companyAddress"
              value={this.state.companyAddress}
              onChange={this.updateCompanyValues}
            />
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <InputText
              label="GSTIN"
              id="companyGst"
              value={this.state.companyGst}
              onChange={this.updateCompanyValues}
            />
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <InputText
              label="Contact"
              id="companyContact"
              value={this.state.companyContact}
              onChange={this.updateCompanyValues}
            />
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <InputText
              label="Email Id"
              id="emailId"
              value={this.state.emailId}
              onChange={this.updateCompanyValues}
            />
          </Grid>
          </Grid>
        <Button
            variant="contained"
            color="primary"
            onClick={this.updateCompanyDetails}
            style={{ marginLeft: '0.5rem' }}
          >
            Update
          </Button>
      </div>
    );
  }
}

export default Settings;
