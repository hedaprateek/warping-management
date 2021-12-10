import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link as RouterLink, useRouteMatch } from 'react-router-dom';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import CssBaseline from '@material-ui/core/CssBaseline';

import { Provider as ReduxProvider } from "react-redux";

import Theme from './helpers/Theme';
import getStore from './store';
import Dashboard from './pages/Dashboard';

const reduxStore = getStore();

export default function App() {
  return (
    <Theme>
      <CssBaseline />
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Router>
          <ReduxProvider store={reduxStore}>
            <Dashboard />
          </ReduxProvider>
        </Router>
      </MuiPickersUtilsProvider>
    </Theme>
  );
}