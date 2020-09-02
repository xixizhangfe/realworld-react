import React from 'react';
import { withRouter } from 'react-router-dom';
import commonFetch from '../../common/fetch';

class Editor extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      body: '',
      tag: '',
      tagList: []
    };
  }

  componentDidMount () {
    if (this.props.match.params.slug) {
      this.getArticle();
    }
  }

  getArticle () {
    commonFetch('get', `/articles/${this.props.match.params.slug}`)
      .then(({ article }) => {
        const { title, description, body, tagList } = article;
        this.setState({
          title,
          description,
          body,
          tagList
        });
      })
  }

  createArticle = (ev) => {
    const { title, description, body, tagList } = this.state;
    const params = {
      article: {
        title,
        description,
        body,
        tagList
      }
    }
    commonFetch('post', '/articles', null, params)
      .then(({ article }) => {
        this.props.history.push(`/article/${article.slug}`);
      });
  }

  onChange = (key, ev) => {
    this.setState({
      [key]: ev.target.value,
    });
  }

  handleTagInput = (ev) => {
    this.setState({
      tag: ev.target.value,
    });
  }

  handleTagInputKeyDown = (ev) => {
    switch (ev.keyCode) {
      case 13: // Enter
      case 9: // Tab
      case 188: // ,
        if (ev.keyCode !== 9) ev.preventDefault();
        this.addTag();
        break;
      default:
        break;
    }
  }

  addTag = () => {
    const { tagList, tag } = this.state;
    !tagList.includes(tag) && tag && tagList.push(tag);
    this.setState({
      tagList,
      tag: '',
    });
  }

  render () {
    const { title, description, body, tagList, tag } = this.state;
    return (
      <div className="editor-page">
        <div className="container page">
          <div className="row">

            <div className="col-md-10 offset-md-1 col-xs-12">
              <form>
                <fieldset>
                  <fieldset className="form-group">
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Article Title"
                      value={title}
                      onChange={this.onChange.bind(this, 'title')}
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="What's this article about?"
                      value={description}
                      onChange={this.onChange.bind(this, 'description')}
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <textarea
                      className="form-control"
                      rows="8"
                      placeholder="Write your article (in markdown)"
                      value={body}
                      onChange={this.onChange.bind(this, 'body')}
                    ></textarea>
                  </fieldset>
                  <fieldset className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter tags"
                      value={tag}
                      onChange={this.handleTagInput}
                      onBlur={this.addTag}
                      onKeyDown={this.handleTagInputKeyDown}
                    />
                    {
                      tagList.length
                        ?
                          <div className="tag-list">
                            {
                              tagList.map((tag, index) => {
                                return (
                                  <span
                                    className="tag-default tag-pill"
                                    key={index}
                                  >
                                    { tag }
                                  </span>
                                )
                              })
                            }
                          </div>
                        :
                          null
                    }
                  </fieldset>
                  <button
                    className="btn btn-lg pull-xs-right btn-primary"
                    type="button"
                    onClick={this.createArticle}
                  >
                    Publish Article
                  </button>
                </fieldset>
              </form>
            </div>

          </div>
        </div>
      </div>
    )
  }
}


export default withRouter(Editor);
