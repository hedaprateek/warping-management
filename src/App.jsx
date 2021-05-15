import { AppBar, Box, Button, IconButton, Toolbar, useTheme } from '@material-ui/core';
import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link as RouterLink, useRouteMatch } from 'react-router-dom';
import About from './About';
import Theme from './helpers/Theme';
import Home from './Home.jsx';
import Inwards from './Inwards';
import Users from './Inwards';
import Parties from './Parties';
import Qualities from './Qualities';
import Reports from './Reports';
import Warping from './Warping';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import Outwards from './Outwards';
import Settings from './Settings';
import SettingsRoundedIcon from '@material-ui/icons/SettingsRounded';
import Billing from './Billing';



const navItems = [
  { label: 'Home', to: '/', component: Home },
  { label: 'Inwards', to: '/inwards', component: Inwards },
  { label: 'Outwards', to: '/outwards', component: Outwards },
  { label: 'Qualities', to: '/qualities', component: Qualities },
  { label: 'Parties', to: '/parties', component: Parties },
  { label: 'Reports', to: '/reports', component: Reports },
  { label: 'Billing', to: '/billing', component: Billing },
];

const settings = { label: 'Settings', to: '/settings', component: Settings };

function NavButton({to, children}) {
  let urlMatch = useRouteMatch({
    path: to,
    exact: true,
  });
  return (
    <Button color={urlMatch ? "secondary" : "primary"} variant="contained" component={RouterLink} to={to} disableElevation>{children}</Button>
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
                <span style={{ paddingLeft: '70%' }}>
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
