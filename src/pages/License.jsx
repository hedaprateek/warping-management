import { Box, Button, Divider, Link, Paper, Typography } from '@material-ui/core';
import React, { useCallback, useMemo, useState } from 'react';
import {epochDiffDays, getAxiosErr, getEpoch} from '../activate_utils';
import axios from 'axios';
import { defaults } from 'lodash';
import { Grid } from '@material-ui/core';
import { InputText } from '../components/FormElements';
const { REACT_APP_VERSION } = process.env;


function License({activation, onActivate}) {
  const [activationid, setActivationid] = useState('');
  const onKeyChange = useCallback((e)=>{
    setActivationid(e.target.value);
  });

  const onActivateClick = useCallback(()=>{
    axios.post('/api/misc/activate', {
      activation_key: activationid,
    })
    .then((res)=>{
      let data = res.data;
      // props.setNotification(NOTIFICATION_TYPE.SUCCESS, 'Product activated to full version !!');
      onActivate(data.activation_date, activationid);
    })
    .catch((err)=>{
      console.log(err);
      // props.setNotification(NOTIFICATION_TYPE.ERROR, getAxiosErr(err));
    });
  });

  return (
  <Box style={{padding: '0.5rem'}}>
    <Typography>
      <Typography component="span" color="primary" style={{fontWeight: "bold"}}>Warping Management - App version : {REACT_APP_VERSION || 'Unknown'}</Typography>
      <Typography>This software is made by team at <Typography component="span" color="primary" style={{fontWeight: "bold"}}>Yantra</Typography> with a lot of R&D and user feedbacks. We believe that a software should be very easy to use and should not be boring.</Typography>
      <Typography>If you want a custom software for your needs and do not want to use the same old crap, then mail us at <Link href = "mailto: yantra.contact@gmail.com">yantra.contact@gmail.com</Link></Typography>
      <Typography>We'll reach out soon !!</Typography>
    </Typography>
    <Divider style={{margin: '0.5rem'}} />
    {activation.tampered &&
      <Typography variant="h5" color="error">
          You're software database is corrupted or is intentionally tampered. Please contant the software team.
      </Typography>
    }
    {activation.is_trial && !activation.tampered &&
    <>
    <Typography variant="h5" color="error">
      {activation.usage_days_left > 0 ?
        <span>You're using the trial version. Remaining days for the trial are {activation.usage_days_left} days only.</span>:
        <span>You're trial is expired. Share the system id and get the activation key to activate full version and access all features.</span>}
    </Typography>
    <Grid container spacing={2}>
      <Grid item lg={6} md={6} sm={12} xs={12}>
        <InputText
          label="System ID"
          variant="outlined"
          fullWidth
          id="system_id"
          value={activation.system_id}
          readOnly
        />
      </Grid>
    </Grid>
    <Grid container spacing={2}>
      <Grid item lg={6} md={6} sm={12} xs={12}>
        <InputText
          label="Activation key (Contact team Yantra)"
          variant="outlined"
          fullWidth
          id="system_id"
          value={activationid}
          onChange={onKeyChange}
        />
      </Grid>
    </Grid>
    <Grid container spacing={2}>
      <Grid item lg={6} md={6} sm={12} xs={12}>
        <Button variant="contained" color="primary" onClick={onActivateClick} size="large">Activate</Button>
      </Grid>
    </Grid>
    </>
    }
    {!activation.is_trial &&
    <>
    <Typography variant="h5" color="error">
      You are running full license software. Thank you for choosing us.
    </Typography>
    </>
    }
  </Box>
  );
}

export default License;