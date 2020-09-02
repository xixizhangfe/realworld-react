const BASE_URL = 'https://conduit.productionready.io/api';

export default function commonFetch (method, path, options = {}, data) {
  // if (method.toUpperCase())
  options = options || {};
  const { params } = options;
  const token = window.localStorage.getItem('jwtToken');
  let headers = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  };
  if (token) {
    headers.Authorization = `Token ${token}`;
  }
  headers = {
    ...headers,
    ...(options.headers || {}),
  };

  let url = `${BASE_URL}${path}`;
  if (params) {
    if (path.indexOf('?') === -1) {
      url += '?';
    }

    Object.keys(params).forEach((key, index) => {
      if (index === 0) {
        url += `${path.indexOf('?') > -1 ? '&' : ''}${key}=${params[key]}`
      } else {
        url += `&${key}=${params[key]}`
      }
    })
  }

  return fetch(url, {
    method,
    headers,
    body: JSON.stringify(data),
  })
  // .then(checkStatus)
  .then(res => {
    return res.json();
  });
}

function checkStatus (response) {
  const { status, statusText } = response;
  if (status >= 200 && status < 300) {
    return response;
  } else {
    const err = new Error(statusText);
    err.response = response;
    throw err;
  }
}
