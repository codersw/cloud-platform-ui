import fetch from 'utils/fetch';

export function page(query) {
  return fetch({
    url: '/api/admin/user/page',
    method: 'get',
    params: query
  });
}

export function saveObj(obj) {
  return fetch({
    url: '/api/admin/user',
    method: 'post',
    data: obj
  });
}

export function addObj(obj) {
  return fetch({
    url: '/api/admin/user',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/admin/user/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/api/admin/user/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/admin/user/' + id,
    method: 'put',
    data: obj
  })
}

export function updateStatus(ids, status) {
  return fetch({
    url: '/api/admin/user/updateStatus?ids='+ ids + '&status=' + status,
    method: 'get'
  })
}

export function resetPassword(id) {
  return fetch({
    url: '/api/admin/user/resetPassword/' + id,
    method: 'get'
  });
}

export function wechatUser() {
  return fetch({
    url: '/api/admin/user/wechatUser',
    method: 'get'
  });
}

export function wechatUserByUserId(id) {
  return fetch({
    url: '/api/admin/user/wechatUserByUserId/' + id,
    method: 'get'
  });
}

export function baseInfo() {
  return fetch({
    url: '/api/admin/user/baseInfo',
    method: 'get'
  })
}

export function deptList(pid) {
  return fetch({
    url: '/api/admin/dept/listByPid?pid=' + pid ,
    method: 'get'
  });
}
