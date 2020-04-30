import fetch from 'utils/fetch';

export function loginByEmail(username, password) {
  const data = {
    username,
    password
  };
  return fetch({
    //url: '/api/auth/jwt/token',
    url: '/api/auth/jwt/v1/token',
    method: 'post',
    data
  });
}

export function logout(token) {
  return fetch({
    url: '/api/auth/jwt/invalid',
    method: 'get',
    params: { token }
  });
}

export function getInfo(token) {
  return fetch({
    //url: '/api/admin/user/front/info',
    url: '/api/admin/user/v1/front/info',
    method: 'get',
    params: { token }
  });
}

export function getMenus(token) {
  return fetch({
    //url: '/api/admin/user/front/menus',
    url: '/api/admin/user/v1/front/menus',
    method: 'get',
    params: { token }
  });
}

export function getAllMenus() {
  return fetch({
    url: '/api/admin/user/front/menu/all',
    method: 'get'
  });
}
