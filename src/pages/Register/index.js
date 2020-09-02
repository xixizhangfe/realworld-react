import React from 'react';
import { Link } from 'react-router-dom';

import commonFetch from '../../common/fetch.js';
import { setUser } from '../../common/utils';

export default class Register extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      errors: [],
    };
  }

  changeUsername = (e) => {
    this.setState({
      username: e.target.value,
    });
  }

  changeEmail = (e) => {
    this.setState({
      email: e.target.value,
    });
  }

  changePassword = (e) => {
    this.setState({
      password: e.target.value,
    });
  }

  submitForm = (ev) => {
    ev.preventDefault();
    const { email, password, username } = this.state;
    commonFetch('post', '/users', null, {
      user: {
        email,
        password,
        username,
      }
    })
    .then((res) => {
      const { errors, user } = res;
      if (errors) {
        this.setState({
          errors,
        });
      } else {
        setUser(user);
        window.location.href = '/';
      }
    });
  }

  setUser (user) {
    window.localStorage.setItem('jwtToken', user.token);
    window.localStorage.setItem('currentUser', JSON.stringify(user));
  }

  render () {
    const { username, email, password, errors } = this.state;
    return (
      <div className="auth-page">
        <div className="container page">
          <div className="row">

            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign up</h1>
              <p className="text-xs-center">
                <Link to="/login">Have an account?</Link>
              </p>

              <ul className="error-messages">
                {
                  Object.keys(errors).map(key => {
                    return (
                    <li>{key} {errors[key][0]}</li>
                    )
                  })
                }
              </ul>

              <form onSubmit={this.submitForm}>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Your Name"
                    value={username}
                    onChange={this.changeUsername}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={this.changeEmail}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={this.changePassword}
                  />
                </fieldset>
                <button className="btn btn-lg btn-primary pull-xs-right">
                  Sign up
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    )
  }
}
