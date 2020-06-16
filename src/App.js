import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Route } from 'react-router-dom';

import TabBar from './components/TabBar'
import My from './components/My'
import Upload from './components/Upload'
import Notification from './components/Notification'

class App extends Component {
  constructor(){
    super()
    this.state = {
      loggedIn: true
    }
  }
  render() {

    return (
        <div>
          <div>
            {this.state.loggedIn
              ? (<Route path="/" exact component={My} />)
              : (<Route path="/" exact component={My} />)
            }
            {this.state.loggedIn ? (
              <Route path="/upload" exact component={Upload}/>
              ):null}
            {this.state.loggedIn ? (
              <Route path="/notification" exact component={Notification}/>
              ):null}
          </div>
        </div>
    );
  }
}

export default App;
