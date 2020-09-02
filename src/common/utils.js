export function setUser (user) {
  window.localStorage.setItem('jwtToken', user.token);
  window.localStorage.setItem('currentUser', JSON.stringify(user));
}
