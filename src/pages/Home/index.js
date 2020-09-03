import React from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';

import commonFetch from '../../common/fetch.js';
import Articles from '../../components/articles';

import { UserContext } from '../../context';

const YourFeedTab = ({ currentUser, isLogin }) => {
  return isLogin ? (
    <li className="nav-item">
      <NavLink
        to={{
          pathname: '/',
          search: '?tab=feed'
        }}
        isActive={(match, location) => {
          return location.search.match('tab=feed') ? 1 : 0;
        }}
        className="nav-link"
      >Your Feed</NavLink>
    </li>
  ) : null;
}

const GlobalFeedTab = () => {
  return (
    <li className="nav-item">
      <NavLink
        to={{
          pathname: '/',
          search: '?tab=global'
        }}
        isActive={(match, location) => {
          return location.search.match(/tab=feed|tag/) ? 0 : 1;
        }}
        className="nav-link"
      >Global Feed</NavLink>
    </li>
  );
}

const TagTab = (props) => {
  return props.curTag ? (
    <li className="nav-item">
      <NavLink
        to={{
          pathname: '/',
          search: '?tab=tag'
        }}
        isActive={(match, location) => {
          return location.search.match('tab=tag') ? 1 : 0;
        }}
        className="nav-link"
      >#{props.curTag}</NavLink>
    </li>
  ) : null;
}

class Home extends React.Component {
  static contextType = UserContext;

  constructor (props) {
    super(props);
    this.state = {
      articles: [],
      articlesCount: 0,
      page: 0,
      limit: 10,
      tags: [],
      curTag: '',
    };
  }

  componentDidMount () {
    this.getArticles();
    this.getTags();

    this.props.history.listen(location => {
      if (this.props.location.search !== location.search) {
        this.setState({
          page: 0
        }, () => {
          this.getArticles();
        });
      }
    })
  }

  getArticles () {
    const search = window.location.hash;
    let url = '/articles';
    if (search.match('tab=feed')) {
      url = '/articles/feed';
    } else if (search.match('tab=tag')) {
      url = `/articles?tag=${this.getCurTag()}`
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

  getTags () {
    commonFetch('get', '/tags')
      .then(({ tags }) => {
        this.setState({
          tags,
        });
      });
  }

  getCurTag () {
    const search = window.location.hash;
    if (!search.match('tab=tag&tag=')) return '';
    return search.split('&')[1].split('=')[1];
  }

  setPage = (page) => {
    this.setState({
      page,
    }, () => {
      this.getArticles();
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

  render () {
    return (
      <div className="home-page">

      <div className="banner">
        <div className="container">
          <h1 className="logo-font">conduit</h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>

      <div className="container page">
        <div className="row">

          <div className="col-md-9">
            <div className="feed-toggle">
              <ul className="nav nav-pills outline-active">
                <YourFeedTab
                  currentUser={this.context.currentUser}
                  isLogin={this.context.isLogin}
                />
                <GlobalFeedTab />
                <TagTab curTag={this.getCurTag()} />
              </ul>
            </div>

            <Articles
              articles={this.state.articles}
              page={this.state.page}
              limit={this.state.limit}
              articlesCount={this.state.articlesCount}
              setPage={this.setPage}
              addFavorite={this.addFavorite}
              isLogin={this.context.isLogin}
            />
          </div>

          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>

              <div className="tag-list">
                {
                  this.state.tags.map((tag,index) => {
                    return (
                      <Link
                        to={{
                          path: '/',
                          search: `?tab=tag&tag=${tag}`
                        }}
                        className="tag-pill tag-default"
                        key={index}
                      >
                        {tag}
                      </Link>
                    )
                  })
                }
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
    )
  }
}

export default withRouter(Home);
