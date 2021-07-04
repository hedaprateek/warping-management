import { AppBar, Box, Button, Snackbar, Toolbar, Link, Typography, useTheme } from '@material-ui/core';
import React, { useMemo } from 'react';
import { BrowserRouter as Router, Switch, Route, Link as RouterLink, useRouteMatch } from 'react-router-dom';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import Alert from '@material-ui/lab/Alert';

import { connect, Provider as ReduxProvider } from "react-redux";

import Theme from '../helpers/Theme';

import Home from './Home';
import Inwards from './Inwards';
import Outwards from './Outwards';
import Billing from './Billing';

import Reports from '../Reports';
import Masters from './Masters';
import License from './License';
import { useEffect } from 'react';
import axios from 'axios';
import { epochDiffDays, getEpoch } from '../activate_utils';
import getStore from '../store';
import { setNotification } from '../store/reducers/notification';


const navItems = [
  { label: 'Home', to: '/', component: Home },
  { label: 'Inwards', to: '/inwards', component: Inwards },
  { label: 'Outwards', to: '/outwards', component: Outwards },
  { label: 'Reports', to: '/reports', component: Reports },
  { label: 'Billing', to: '/billing', component: Billing },
  { label: 'Masters', to: '/masters', component: Masters },
  { label: 'License', to: '/license', component: License },
];

function NavButton({to, children}) {
  let urlMatch = useRouteMatch({
    path: to,
    exact: true,
  });
  return (
    <Button color={urlMatch ? "secondary" : "primary"} variant="contained" component={RouterLink}
      to={to} //style={{paddingTop: '2px', paddingBottom: '2px'}}
      disableElevation>{children}</Button>
  )
}

const reduxStore = getStore();

const TRIAL_DAYS = 90;

function Dashboard(props) {
  const [activation, setActivation] = React.useState({
    is_trial: true,
    usage_days_left: 0,
    system_id: null,
  });

  useEffect(()=>{
    axios.post('/api/misc/init')
      .then((res)=>{
          let data = res.data;
          console.log(data);
          setActivation((prev)=>{
            let usage_days_left = (TRIAL_DAYS - epochDiffDays(getEpoch(), data.install_date));
            usage_days_left = usage_days_left < 0 ? 0 : usage_days_left;
            return {
              ...prev,
              system_id: data.system_id,
              is_trial: !Boolean(data.activation_date),
              usage_days_left: usage_days_left,
            }
          });
      })
      .catch((err)=>{
        console.log(err);
      });
  }, []);

  const onActivate = (activation_date, activation_key)=>{
    setActivation((prev)=>{
      return {
        ...prev,
        is_trial: !Boolean(activation_date),
      }
    });
  }

  const theme = useTheme();
  const dash = useMemo(()=>{
    return (
      <>
        <Box display="flex" flexDirection="column" height="100%" fontSize={theme.typography.fontSize}>
          <AppBar position="fixed">
            <Toolbar variant="dense">
              {navItems.map((item) => {
                return <NavButton to={item.to}>{item.label}</NavButton>;
              })}
            </Toolbar>
          </AppBar>
          <Box>
            <Toolbar variant="dense" />
          </Box>
          <Box flexGrow="1" style={{ minHeight: 0 }}>
            <Switch>
              {navItems.map((item) => {
                return (
                  <Route exact path={item.to} component={
                    (props)=><item.component {...props} activation={activation} onActivate={onActivate}
                      licexpired={activation.is_trial && activation.usage_days_left <= 0}
                    />} />
                );
              })}
            </Switch>
          </Box>
        </Box>
      </>
    )
  }, [activation]);

  return (
    <>
      {dash}
      <Snackbar
        open={Boolean(props.notify.message)}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={(event, reason)=>{
          if (reason === 'clickaway') {
            return;
          }
          props.clearNotification();
        }}
      >
        <Alert severity={props.notify.type} onClose={props.clearNotification}>
          {props.notify.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default connect((state)=>({notify: state.notify}), (dispatch)=>({
  setNotification: (...args)=>{dispatch(setNotification.apply(this, args))},
  clearNotification: ()=>{dispatch(setNotification(null, null))},
}))(Dashboard);
