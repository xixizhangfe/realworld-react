import React from 'react';
import { Link } from 'react-router-dom';

import ListPagination from './listPagination';

const articles = (props) => {
  return (
    <>
      {
        props.articles.map((article, index) => {
          const addFavorite = () => {
            props.addFavorite(index);
          }

          return (
            <div
              key={index}
              className="article-preview"
            >
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
                  <span className="date">{article.updatedAt}</span>
                </div>
                <button
                  className="btn btn-outline-primary btn-sm pull-xs-right"
                  onClick={addFavorite}
                >
                  <i className="ion-heart"></i> {article.favoritesCount}
                </button>
              </div>
              <Link to={`/article/${article.slug}`} className="preview-link">
                <h1>{article.title}</h1>
                <p>{article.description}</p>
                <span>Read more...</span>
                <ul className="tag-list">
                  {
                    article.tagList.map(tag => {
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
              </Link>
            </div>
          )
        })
      }

      <ListPagination
        page={props.page}
        total={Math.ceil(props.articlesCount / props.limit )}
        setPage={props.setPage}
      />
    </>
  )
}

export default articles;
