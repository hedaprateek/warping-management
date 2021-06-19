import { AppBar, Box, Button, IconButton, Toolbar, Typography, useTheme } from '@material-ui/core';
import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link as RouterLink, useRouteMatch } from 'react-router-dom';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import SettingsRoundedIcon from '@material-ui/icons/SettingsRounded';

import Theme from './helpers/Theme';

import Home from './pages/Home';
import Inwards from './pages/Inwards';
import Outwards from './pages/Outwards';
import Settings from './pages/Settings';
import Billing from './pages/Billing';

import Reports from './Reports';
import Masters from './pages/Masters';
import License from './pages/License';
import { useEffect } from 'react';
import axios from 'axios';
import { epochDiffDays, getEpoch } from './activate_utils';


const navItems = [
  { label: 'Home', to: '/', component: Home },
  { label: 'Inwards', to: '/inwards', component: Inwards },
  { label: 'Outwards', to: '/outwards', component: Outwards },
  { label: 'Reports', to: '/reports', component: Reports },
  { label: 'Billing', to: '/billing', component: Billing },
  { label: 'Masters', to: '/masters', component: Masters },
  { label: 'License', to: '/license', component: License },
];

const settings = { label: 'Settings', to: '/settings', component: Settings };

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

const TRIAL_DAYS = 90;

export default function App() {
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

  return (
    <Theme>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Router>
          <Box display="flex" flexDirection="column" height="100%">
            <AppBar position="fixed">
              <Toolbar variant="dense">
                {navItems.map((item) => {
                  return <NavButton to={item.to}>{item.label}</NavButton>;
                })}
                <span style={{ marginLeft: 'auto' }}>
                  <NavButton to={settings.to}>
                    <SettingsRoundedIcon></SettingsRoundedIcon>
                  </NavButton>
                </span>
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
                <Route
                  exact
                  path={settings.to}
                  component={settings.component}
                />
              </Switch>
            </Box>
          </Box>
        </Router>
      </MuiPickersUtilsProvider>
    </Theme>
  );
}
