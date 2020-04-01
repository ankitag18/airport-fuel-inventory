import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Airport from './views/airport';
import Aircraft from './views/aircraft';
import Login from './views/login';
import Transaction from './views/transaction';
import Report from './views/report';
// import CurrentPageContext from './page-context';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <Login />
          </Route>
          <Route path="/airport/list">
            {/* <CurrentPageContext.Provider value="airport"> */}
            <Airport />
            {/* </CurrentPageContext.Provider> */}
          </Route>
          <Route path="/aircraft/list">
            <Aircraft />
          </Route>
          <Route path="/transaction/list">
            <Transaction />
          </Route>
          <Route path="/report">
            <Report />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;