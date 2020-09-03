import React from 'react';
// import { withRouter } from 'react-router-dom';

import commonFetch from '../../common/fetch.js';
import { setUser } from '../../common/utils';

import { UserContext } from '../../context';

class Settings extends React.Component {
  static contextType = UserContext;

  constructor (props) {
    super(props);
    this.state = {
      email: '',
      username: '',
      password: '',
      image: '',
      bio: '',
      newPassword: ''
    };
  }

  componentDidMount () {
    const { email, username, password, image, bio } = this.context.currentUser || {};

    this.setState({
      email: email || '',
      username: username || '',
      password: password || '',
      image: image || '',
      bio: bio || '',
      newPassword: ''
    });
  }

  onChange (field, e) {
    this.setState({
      [field]: e.target.value,
    });
  }

  handleSubmit = (ev) => {
    ev.preventDefault();
    const { email, username, newPassword, image, bio } = this.state;
    const params = {
      email,
      username,
      password: newPassword,
      image,
      bio
    };

    Object.keys(params).forEach(key => {
      if (!params[key] && params[key] !== 0 && params[key] !== false) {
        delete params[key];
      }
    });

    commonFetch('put', '/user', null, {
      user: params
    })
    .then(({ user }) => {
      setUser(user);
      window.location.href = '/';
    });
  }

  render () {
    const { email, username, image, bio, newPassword } = this.state;
    return (
      <div className="settings-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Your Settings</h1>

              <form onSubmit={this.handleSubmit}>
                <fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="URL of profile picture"
                      value={image}
                      onChange={this.onChange.bind(this, 'image')}
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Your Name"
                      value={username}
                      onChange={this.onChange.bind(this, 'username')}
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <textarea
                      className="form-control form-control-lg"
                      rows="8"
                      placeholder="Short bio about you"
                      value={bio}
                      onChange={this.onChange.bind(this, 'bio')}
                    ></textarea>
                  </fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Email"
                      value={email}
                      onChange={this.onChange.bind(this, 'email')}
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="password"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={this.onChange.bind(this, 'newPassword')}
                    />
                  </fieldset>
                  <button
                    className="btn btn-lg btn-primary pull-xs-right"
                    type="submit"
                  >
                    Update Settings
                  </button>
                </fieldset>
              </form>

              <hr />
              <button
                className="btn btn-outline-danger"
                onClick={this.context.clearUser}>
                Or click here to logout.
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Settings;
