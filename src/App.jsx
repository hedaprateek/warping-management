import { AppBar, Button, IconButton, Toolbar } from '@material-ui/core';
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

const navItems = [
  {label: 'Home', to: '/', component: Home},
  {label: 'Inwards', to: '/inwards', component: Inwards},
  {label: 'Warping', to: '/warping', component: Warping},
  {label: 'Qualities', to: '/qualities', component: Qualities},
  {label: 'Parties', to: '/parties', component: Parties},
  {label: 'Reports', to: '/reports', component: Reports},
];

function NavButton({to, children}) {
  let urlMatch = useRouteMatch({
    path: to,
    exact: true,
  });
  return (
    <Button color="primary" variant="contained" component={RouterLink} to={to} disableElevation>{children}</Button>
  )
}

export default function App() {
  return (
    <Theme>
      <Router>
        <AppBar position="static">
          <Toolbar variant="dense">
            {navItems.map((item)=>{
              return <NavButton to={item.to}>{item.label}</NavButton>
            })}
          </Toolbar>
        </AppBar>
        <Switch>
          {navItems.map((item)=>{
            return <Route exact path={item.to} component={item.component} />
          })}
        </Switch>
      </Router>
    </Theme>
  );
}
