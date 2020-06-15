import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Route } from 'react-router-dom';

import TabBar from './components/TabBar'
import Home from './components/Home'
import Profile from './components/Profile'

class App extends Component {
  render() {
    const { loggedIn } = true;

    return (
        <div>
        <div>
          {loggedIn
              ? (<Route path="/" exact component={Home} />)
              : (<Route path="/" exact component={Home} />)
          }
          {loggedIn ? (
            <Route path="/fav" exact component={Favorite}/>
            ):null}
        </div>
        <TabBar />
        </div>
    );
  }
}

export default App;
