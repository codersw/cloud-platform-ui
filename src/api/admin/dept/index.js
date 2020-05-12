import fetch from 'utils/fetch';

export function page(query) {
  return fetch({
    url: '/api/admin/dept/page',
    method: 'get',
    params: query
  });
}

export function saveObj(obj) {
  return fetch({
    url: '/api/admin/dept',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/admin/dept/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/api/admin/dept/' + id,
    method: 'delete'
  })
}

export function updateStatus(ids, status) {
  return fetch({
    url: '/api/admin/dept/updateStatus?ids='+ ids + '&status=' + status,
    method: 'get'
  })
}

export function baseInfo() {
  return fetch({
    url: '/api/admin/dept/baseInfo',
    method: 'get'
  })
}

export function deptList(pid) {
  return fetch({
    url: '/api/admin/dept/listByPid?pid=' + pid ,
    method: 'get'
  });
}

export function wechatDept() {
  return fetch({
    url: '/api/admin/dept/wechatDept',
    method: 'get'
  });
}
