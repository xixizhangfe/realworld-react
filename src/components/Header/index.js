import React from 'react';
import { Link } from 'react-router-dom';

class Header extends React.Component {
  render () {
    return this.props.isLogin ? (
      <>
        <nav className="navbar navbar-light">
          <div className="container">
            <Link className="navbar-brand" to="/">conduit</Link>
            <ul className="nav navbar-nav pull-xs-right">
              <li className="nav-item">
                <Link
                  to="/"
                  className="nav-link"
                >Home</Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/editor"
                  className="nav-link"
                >
                  <i className="ion-compose"></i>&nbsp;New Post
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/settings"
                  className="nav-link"
                >
                  <i className="ion-gear-a"></i>&nbsp;Settings
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to={`/@${this.props.currentUser.username}`}
                  className="nav-link"
                >
                  <img src={this.props.currentUser.image} className="user-pic" alt="" />
                  {this.props.currentUser.username}
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </>
    ) :
    (
      <>
        <nav className="navbar navbar-light">
          <div className="container">
            <a className="navbar-brand" href="index.html">conduit</a>
            <ul className="nav navbar-nav pull-xs-right">
              <li className="nav-item">
                <Link
                  to="/"
                  className="nav-link"
                >Home</Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/login"
                  className="nav-link"
                >Sign in</Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/register"
                  className="nav-link"
                >Sign up</Link>
              </li>
            </ul>
          </div>
        </nav>
      </>
    )
  }
}

export default Header;
