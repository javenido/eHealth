import './App.css';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";
import React, { useState, useEffect } from 'react';

import logo from './logo.png';

import CreateAlert from './components/CreateAlert';
import CreateTip from './components/CreateTip';
import DisplayTip from './components/DisplayTip';
import EnterVitals from './components/EnterVitals';
import ListAlerts from './components/ListAlerts';
import ListVitals from './components/ListVitals';
import MotivationalVideos from './components/MotivationalVideos';
import NotFound from './components/NotFound';
import Profile from './components/Profile';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import SymptomsChecker from './components/SymptomsChecker';

function App() {
  // create stateful variable(s)
  const [user, setUser] = useState();

  // check if user is signed in
  useEffect(() => {
    const verify = async () => {
      const result = await axios.get("/user/verify");
      if (result.data.user)
        setUser(result.data.user);
    };

    verify();
  }, []);

  // Build and return JSX
  return (
    <Router>
      {/* Navigation Bar */}
      {user ?

        <div className="nav">
          <a href="/"><img src={logo} height="32" title="Home" alt="eHealth logo" /></a>

          <a href="/">Home</a>
          {/* Nurse-specific */}
          {user.role === 'nurse' && <a href="/vitals/list">Vital Signs</a>}
          {user.role === 'nurse' && <a href="/alerts/list">Emergency Alerts</a>}

          {/* Patient-specific */}
          {user.role === 'patient' && <a href="/tip">Daily Tips</a>} {/*https://stackoverflow.com/questions/39277670/how-to-find-random-record-in-mongoose */}
          {user.role === 'patient' && <a href="/motivation/videos">Motivational Videos</a>}
          {user.role === 'patient' && <a href="/lcsc">Lung Cancer Symptoms Checker</a>}

          <a className="nav-end" href={"/user/" + user.id} title="Click to view your profile">{user.fullName}</a>
          <a href="/signout">Sign Out</a>
        </div> :
        <div className="nav">
          <a href="/"><img src={logo} height="32" title="Home" alt="eHealth logo" /></a>
          <a href="/">Home</a>
          <a href="/signin">Sign In</a>
          <a href="/signup">Sign Up</a>
        </div>
      }

      {/* Dashboard */}
      <Route render={() => (
        user ?
          user.role === 'nurse' ?
            // nurse dashboard
            <div className="flex-container">
              <h1>Nurse Dashboard</h1>
              <a className="btn" href="/vitals/new">Enter Vital Signs</a>
              <a className="btn" href="/tip/new">Post a Motivational Tip</a>
            </div> :

            // patient dashboard
            <div className="flex-container">
              <h1>Patient Dashboard</h1>
              <a className="btn" href="/vitals/new">Enter Vital Signs</a>
              <a className="btn" href={"/vitals/list/" + user.username}>My Vitals Readings</a>
              <a className="btn alert-btn" href="/alert/new">Create Emergency Alert</a>
            </div> :

          // public dashboard
          <div className="flex-container">
            <h1>Welcome to eHealth</h1>
            <a className="btn" href="/signup/0">Create a Nurse Account</a>
            <a className="btn" href="/signup/1">Create a Patient Account</a>
            <a className="btn" href="/signin">Sign In</a>
          </div>
      )} exact path="/" />


      {/* Routes */}
      <Switch>
        <Route render={() => this} exact path="/" />
        <Route render={() => < CreateAlert />} path="/alert/new" />
        <Route render={() => < CreateTip />} exact path="/tip/new" />
        <Route render={() => < DisplayTip />} exact path="/tip" />
        <Route render={() => < EnterVitals />} path="/vitals/new" />
        <Route render={() => < ListAlerts />} exact path="/alerts/list" />
        <Route render={() => < ListVitals />} exact path="/vitals/list/:patient?" />
        <Route render={() => < MotivationalVideos />} path="/motivation/videos" />
        <Route render={() => < Profile />} path="/user/:id" />
        <Route render={() => < SignIn />} path="/signin" />
        <Route render={() => < SignUp />} exact path="/signup" />
        <Route render={() => < SignUp role="nurse" />} path="/signup/0" />
        <Route render={() => < SignUp role="patient" />} path="/signup/1" />
        <Route render={() => < SymptomsChecker />} path="/lcsc" />
        <Route render={() => {
          axios.get('/user/logout').then(() => {
            window.location.href = "/";
          });
        }} path="/signout" />
        <Route component={NotFound} />
      </Switch>

      {/* Footer */}
      <footer><center>Copyright © 2021 Tech Health. All Rights Reserved</center></footer>
    </Router >
  );
}

export default App;