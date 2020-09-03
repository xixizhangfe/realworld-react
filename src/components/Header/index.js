import React from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../context';

class Header extends React.Component {
  static contextType = UserContext;

  render () {
    return this.context.isLogin ? (
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
                  to={`/@${this.context.currentUser.username}`}
                  className="nav-link"
                >
                  <img src={this.context.currentUser.image} className="user-pic" alt="" />
                  {this.context.currentUser.username}
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
