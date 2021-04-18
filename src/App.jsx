import { AppBar, Button, IconButton, Toolbar } from '@material-ui/core';
import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link as RouterLink } from 'react-router-dom';
import About from './About';
import Home from './Home.jsx';
import Inwards from './Inwards';
import Users from './Inwards';
import Parties from './Parties';
import Qualities from './Qualities';
import Warping from './Warping';

const navItems = [
  {label: 'Home', to: '/'},
  {label: 'Inwards', to: '/inwards'},
  {label: 'Warping', to: '/warping'},
  {label: 'Qualities', to: '/qualities'},
  {label: 'Parties', to: '/parties'},
]

export default function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          {navItems.map((item)=>{
            return <RouterLink to={item.to}>{item.label}</RouterLink>
          })}
        </Toolbar>
      </AppBar>
      <Switch>
        <Route path="/inwards">
          <Inwards />
        </Route>
        <Route path="/warping">
          <Warping />
        </Route>
        <Route path="/qualities">
          <Qualities />
        </Route>
        <Route path="/parties">
          <Parties />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}
