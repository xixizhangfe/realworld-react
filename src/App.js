import React from 'react';
import { Switch, Route } from 'react-router-dom';

import './App.css';

import Header from './components/Header';

import commonFetch from './common/fetch.js';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Article from './pages/article';
import Editor from './pages/editor';

import { UserContext } from './context';

class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      loaded: false,
      isLogin: false,
      currentUser: null,
    };
  }

  componentDidMount () {
    this.checkLogin();
  }

  checkLogin () {
    const token = window.localStorage.getItem('jwtToken');
    const currentUser = window.localStorage.getItem('currentUser');

    if (token && !currentUser) {
      commonFetch('get', '/user')
      .then((res) => {
        this.setState({
          loaded: true,
          isLogin: !!res,
          currentUser: res.user,
        });

        if (!res || !res.user) {
          this.clearUser();
        }
      });
    } else if (currentUser) {
      this.setState({
        loaded: true,
        isLogin: true,
        currentUser: JSON.parse(currentUser),
      });
    } else {
      this.setState({
        loaded: true,
        isLogin: false,
      });
      this.clearUser();
    }
  }

  clearUser () {
    window.localStorage.removeItem('jwtToken');
    window.localStorage.removeItem('currentUser');

    if (window.location.hash !== '#/') {
      window.location.href = '/';
    }
  }

  render () {
    return this.state.loaded
      ?
        (
          <div>
            <UserContext.Provider
              value={{
                currentUser: this.state.currentUser,
                isLogin: this.state.isLogin,
                clearUser: this.clearUser,
              }}
            >
              <Header />
              <Switch>
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <Route path="/settings">
                  <Settings />
                </Route>
                <Route path="/@:username">
                  <Profile />
                </Route>
                <Route path="/@:username/favorites" component={Profile} />
                <Route exact path="/editor">
                  <Editor />
                </Route>
                <Route path="/editor/:slug">
                  <Editor />
                </Route>
                <Route path="/article/:slug">
                  <Article />
                </Route>
                <Route exact path="/">
                  <Home />
                </Route>
              </Switch>
            </UserContext.Provider>
          </div>
        )
      :
        null;
  }
}

export default App;
