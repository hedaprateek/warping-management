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



const navItems = [
  { label: 'Home', to: '/', component: Home },
  { label: 'Inwards', to: '/inwards', component: Inwards },
  { label: 'Outwards', to: '/outwards', component: Outwards },
  { label: 'Reports', to: '/reports', component: Reports },
  { label: 'Billing', to: '/billing', component: Billing },
  { label: 'Masters', to: '/masters', component: Masters },
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

export default function App() {
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
                    <Route exact path={item.to} component={item.component} />
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
