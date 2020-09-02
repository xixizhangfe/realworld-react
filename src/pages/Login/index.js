import React from 'react';
import { Link } from 'react-router-dom';

import commonFetch from '../../common/fetch.js';
import { setUser } from '../../common/utils';

export default class Login extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  submitForm = (ev) => {
    ev.preventDefault();
    const { email, password } = this.state;
    commonFetch('post', '/users/login', null, {
      user: {
        email,
        password,
      }
    })
    .then(({ user }) => {
      setUser(user);
      window.location.href = '/';
    });
  }

  handleEmailChange = (e) => {
    this.setState({
      email: e.target.value,
    });
  }

  handlePasswordChange = (e) => {
    this.setState({
      password: e.target.value,
    });
  }

  render () {
    const { email, password } = this.state;
    return (
      <div className="auth-page">
        <div className="container page">
          <div className="row">

            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign in</h1>
              <p className="text-xs-center">
                <Link to="/register">Need an account?</Link>
              </p>

              <form onSubmit={this.submitForm}>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={this.handleEmailChange}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={this.handlePasswordChange}
                  />
                </fieldset>
                <button
                  className="btn btn-lg btn-primary pull-xs-right"
                  type="submit"
                >
                  Sign in
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    )
  }
}
