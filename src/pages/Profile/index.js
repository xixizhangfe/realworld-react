import React from 'react';
import { withRouter, Link, NavLink } from 'react-router-dom';

import commonFetch from '../../common/fetch.js';
import Articles from '../../components/articles';

class Profile extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      profile: {
        bio: '',
        image: '',
        username: '',
        follwing: false,
      },
      articles: [],
      articlesCount: 0,
      page: 0,
      limit: 10,
    };
  }

  componentDidMount () {
    const { profile } = this.state;
    profile.username = this.props.match.params.username;
    this.setState({
      profile
    })

    this.getProfile();
    this.getArticles();

    this.props.history.listen(location => {
      if (this.props.location.pathname !== location.pathname) {
        this.setState({
          page: 0
        }, () => {
          this.getArticles();
        });
      }
    })
  }

  getProfile () {
    commonFetch('get', `/profiles/${this.state.profile.username}`)
      .then(({ profile }) => {
        this.setState({
          profile
        });

        this.getArticles();
      })
  }

  getArticles () {
    const { hash } = window.location;
    let url = `/articles?author=${this.state.profile.username}`;
    if (hash.match('/favorites')) {
      url = `/articles?favorited=${this.state.profile.username}`;
    }

    commonFetch('get', url, {
      params: {
        limit: this.state.limit,
        offset: this.state.page * this.state.limit,
      }
    })
      .then(({ articles, articlesCount}) => {
        this.setState({
          articles,
          articlesCount
        });
      });
  }

  addFavorite = (index) => {
    const articles = this.state.articles;
    const article = articles[index];

    let method;
    if (article.favorited) {
      articles[index].favoritesCount -= 1;
      method = 'DELETE';
    } else {
      articles[index].favoritesCount += 1;
      method = 'POST';
    }
    article.favorited = !article.favorited;
    this.setState({
      articles
    });

    commonFetch(method, `/articles/${articles[index].slug}/favorite`);
  }

  follow = () => {
    const { following } = this.state.profile;
    const method = following ? 'delete' : 'post';
    commonFetch(method, `/profiles/${this.state.profile.username}/follow`)
      .then(({ profile }) => {
        this.setState({
          profile,
        });
      });
  }

  render () {
    const { profile } = this.state;
    return (
      <div className="profile-page">
        <div className="user-info">
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-md-10 offset-md-1">
                <img
                  alt=""
                  src={profile.image}
                  className="user-img"
                />
                  <h4>{profile.username}</h4>
                <p>
                  {profile.bio}
                </p>
                {
                  profile.username === this.props.currentUser.username
                    ?
                      <Link
                        to="/settings"
                        className="btn btn-sm btn-outline-secondary action-btn"
                      >
                        <i class="ion-gear-a"></i> Edit Profile Settings
                      </Link>
                    :
                      <button
                        className="btn btn-sm btn-outline-secondary action-btn"
                        onClick={this.follow}
                      >
                        <i className="ion-plus-round"></i>
                        &nbsp;
                        {profile.following ? 'Unfollow' : 'Follow'} {profile.username}
                      </button>
                }
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">

            <div className="col-xs-12 col-md-10 offset-md-1">
              <div className="articles-toggle">
                <ul className="nav nav-pills outline-active">
                  <li className="nav-item">
                    <NavLink
                      to={`/@${profile.username}`}
                      isActive={(match, location) => {
                        return location.pathname.match('/favorites') ? 0 : 1;
                      }}
                      className="nav-link"
                    >My Articles</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to={`/@${profile.username}/favorites`}
                      isActive={(match, location) => {
                        return location.pathname.match('/favorites') ? 1 : 0;
                      }}
                      className="nav-link"
                    >Favorited Articles</NavLink>
                  </li>
                </ul>
              </div>

              <Articles
                articles={this.state.articles}
                page={this.state.page}
                limit={this.state.limit}
                total={Math.ceil(this.state.articlesCount/ this.state.limit )}
                setPage={this.setPage}
                addFavorite={this.addFavorite}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Profile);
