import fetch from 'utils/fetch';

export function page(query) {
  return fetch({
    url: '/api/admin/user/v1/page',
    method: 'get',
    params: query
  });
}

export function saveObj(obj) {
  return fetch({
    url: '/api/admin/user/v1',
    method: 'post',
    data: obj
  });
}

export function addObj(obj) {
  return fetch({
    url: '/api/admin/user/v1',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/admin/user/v1/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/api/admin/user/v1/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/admin/user/v1/' + id,
    method: 'put',
    data: obj
  })
}

export function codeList(kindcode) {
  return fetch({
    url: '/api/admin/sysCodelist/listByKindcode/' + kindcode,
    method: 'get'
  })
}

export function deptList(pid) {
  return fetch({
    url: '/api/admin/dept/listByPid?pid=' + pid ,
    method: 'get'
  });
}