import { Grid } from '@material-ui/core';
import React from 'react';
import { InputText } from './FormElements';

class Settings extends React.Component {
  state = {
    companyName: '',
    companyAddress: '',
    companyGst: '',
    companyContact: '',
  };

  updateCompanyValues() {
    console.log('Updated');
  }

  render() {
    return (
      <div>
        <h3>Company Settings</h3>

        <Grid container spacing={2}>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <InputText
              label="Name"
              id="name"
              value={this.state.companyName}
              onChange={this.updateCompanyValues}
            />
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <InputText
              label="Address"
              id="address"
              value={this.state.companyAddress}
              onChange={this.updateCompanyValues}
            />
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <InputText
              label="GSTIN"
              id="gstin"
              value={this.state.companyGst}
              onChange={this.updateCompanyValues}
            />
          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12}>
            <InputText
              label="Contact"
              id="contact"
              value={this.state.companyContact}
              onChange={this.updateCompanyValues}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Settings;
