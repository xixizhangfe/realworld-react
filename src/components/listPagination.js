import React from 'react';

const ListPagination = (props) => {
  const pages = [];
  for (let i = 0; i < props.total; i++) {
    pages.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        {
          pages.map(i => {
            const onClick = (e) => {
              e.preventDefault();
              props.setPage(i);
            };

            return (
              <li
                className={props.page === i ? 'page-item active' : 'page-item'}
                onClick={onClick}
                key={i}
              >
                <a className="page-link" href="">{i + 1}</a>
              </li>
            )
          })
        }
      </ul>
    </nav>
  )
}

export default ListPagination;
