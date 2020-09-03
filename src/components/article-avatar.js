import React from 'react';
import { Link } from 'react-router-dom';

const articleAvatar = ({ article }) => {
  return (
    <>
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
    </>
  );
}

export default articleAvatar;
