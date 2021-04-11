import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import About from './About';
import Home from './Home.jsx';
import Inwards from './Inwards';
import Users from './Inwards';
import Parties from './Parties';
import Qualities from './Qualities';
import Warping from './Warping';

export default function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/inwards">INWARDS</Link>
            </li>
            <li>
              <Link to="/warping">WARPING</Link>
            </li>
            <li>
              <Link to="/qualities">QUALITIES</Link>
            </li>
            <li>
              <Link to="/parties">PARTIES</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
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
      </div>
    </Router>
  );
}
