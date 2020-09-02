import React from 'react';
import { withRouter, Link } from 'react-router-dom';

import commonFetch from '../../common/fetch';

const ArticleMeta = ({ article, addFavorite, follow, isMine, deleteArticle }) => {
  return (
    <div className="article-meta">
      <Link
        to={`/@${article.author.username}`}
      >
        <img src={article.author.image} alt="" />
      </Link>
      <div className="info">
        <Link
          to={`/@${article.author.username}`}
          className="author"
        >
          {article.author.username}
        </Link>
        <span className="date">{article.createdAt}</span>
      </div>

      {
        isMine
          ?
            <>
              <Link
                to={`/editor/${article.slug}`}
                className="btn btn-outline-secondary btn-sm"
              >
                <i className="ion-edit" />
                &nbsp;
                Edit Article
              </Link>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={deleteArticle}
              >
                <i className="ion-trash-a"></i>
                &nbsp;
                Delete Article
              </button>
            </>
          :
            <>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={follow}
              >
                <i className="ion-plus-round"></i>
                &nbsp;
                {article.author.following ? 'Unfollow' : 'Follow'} {article.author.username} <span className="counter"></span>
              </button>
              &nbsp;&nbsp;
              <button
                className={ article.favorited ? 'btn btn-sm btn-primary' : 'btn btn-sm btn-outline-primary' }
                onClick={addFavorite}
              >
                <i className="ion-heart"></i>
                &nbsp;
                {article.favorited ? 'UnFavorite' : 'Favorite'} Post <span className="counter">({article.favoritesCount})</span>
              </button>
            </>
      }
    </div>
  )
}

class Article extends React.Component {
  constructor (props) {
    super(props);
    this.articleSlug = this.props.match.params.slug;
    this.state = {
      article: {
        author: {},
        tagList: [],
      },
      comments: [],
      comment: ''
    }
  }

  componentDidMount () {
    this.getArticle();
    this.getComments();
  }

  getArticle () {
    commonFetch('get', `/articles/${this.articleSlug}`)
      .then(({ article }) => {
        this.setState({
          article,
        });
      })
  }

  getComments () {
    commonFetch('get', `/articles/${this.articleSlug}/comments`)
      .then(({ comments }) => {
        this.setState({
          comments,
        });
      });
  }

  deleteArticle = () => {
    commonFetch('delete', `/articles/${this.articleSlug}`)
      .then(({ article }) => {
        this.props.history.push('/');
      })
  }

  addFavorite = (index) => {
    const { article } = this.state;

    let method;
    if (article.favorited) {
      article.favoritesCount -= 1;
      method = 'DELETE';
    } else {
      article.favoritesCount += 1;
      method = 'POST';
    }
    article.favorited = !article.favorited;
    this.setState({
      article
    });

    commonFetch(method, `/articles/${article.slug}/favorite`);
  }


  follow = () => {
    const { article } = this.state;
    const { author, following } = article;
    article.author.following = !article.author.following;
    this.setState({
      article
    });

    const method = following ? 'delete' : 'post';
    commonFetch(method, `/profiles/${author.username}/follow`);
  }

  commentChange = (ev) => {
    this.setState({
      comment: ev.target.value,
    });
  }

  postComment = () => {
    commonFetch('post', `/articles/${this.articleSlug}/comments`, null, {
      body: this.state.comment
    })
      .then(() => {
        this.getComments();
      });
  }

  deleteComment = (comment) => {
    commonFetch('delete', `/articles/${this.articleSlug}/comments/${comment.id}`)
      .then(() => {
        this.getComments();
      });
  }

  render () {
    const { article } = this.state;
    return (
      <div className="article-page">

        <div className="banner">
          <div className="container">

            <h1>{article.title}</h1>

            <ArticleMeta
              article={article}
              addFavorite={this.addFavorite}
              follow={this.follow}
              isMine={this.props.currentUser.username === this.state.article.author.username}
              deleteArticle={this.deleteArticle}
            />
          </div>
        </div>

        <div className="container page">

          <div className="row article-content">
            <div className="col-md-12">
              <div>
                {article.body}
              </div>
              <ul className="tag-list">
                {
                  (article.tagList || []).map(tag => {
                    return (
                      <li
                        key={tag}
                        className="tag-default tag-pill tag-outline"
                      >
                        {tag}
                      </li>
                    )
                  })
                }
              </ul>
            </div>
          </div>

          <hr />

          <div className="article-actions">
            {
              this.props.currentUser.username === this.state.article.author.username
                ? null
                :
                <ArticleMeta
                  article={article}
                  addFavorite={this.addFavorite}
                  follow={this.follow}
                />
            }

          </div>

          <div className="row">
            <div className="col-xs-12 col-md-8 offset-md-2">
              <form className="card comment-form">
                <div className="card-block">
                  <textarea
                    className="form-control"
                    placeholder="Write a comment..."
                    rows="3"
                    value={this.state.comment}
                    onChange={this.commentChange}
                  ></textarea>
                </div>
                <div className="card-footer">
                  <img
                    src={this.props.currentUser.image}
                    className="comment-author-img"
                    alt=""
                  />
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={this.postComment}
                  >
                  Post Comment
                  </button>
                </div>
              </form>

              {
                this.state.comments.map((comment, index) => {
                  return (
                    <div key={index} className="card">
                      <div className="card-block">
                      <p className="card-text">{comment.body}</p>
                      </div>
                      <div className="card-footer">
                        <Link
                          to={`/@${article.author.username}`}
                          className="comment-author"
                        >
                          <img
                            src={comment.author.image} className="comment-author-img"
                            alt=""
                          />
                        </Link>
                        &nbsp;
                        <Link
                          to={`/@${article.author.username}`}
                          className="comment-author"
                        >
                          {comment.author.username}
                        </Link>
                        <span className="date-posted">{comment.createdAt}</span>
                        {
                          this.props.currentUser.username === comment.author.username
                            ?
                              (
                                <span className="mod-options">
                                  {/* <i className="ion-edit"></i> */}
                                  <i
                                    className="ion-trash-a"
                                    onClick={this.deleteComment.bind(this, comment)}
                                  ></i>
                                </span>
                              )
                            :
                              null
                        }
                      </div>
                    </div>
                  )
                })
              }
            </div>

          </div>

        </div>

      </div>
    )
  }
}

export default withRouter(Article);
