import api from './api'

export const analyticsService = {
  getUserAnalytics: () => api.get('/analytics').then(r => r.data),
  getUrlAnalytics: (urlId) => api.get(`/analytics/${urlId}`).then(r => r.data),
}

export const dashboardService = {
  getDashboard: () => api.get('/dashboard').then(r => r.data),
}

export const adminService = {
  getDashboard: () => api.get('/admin/dashboard').then(r => r.data),
  listUsers: (params) => api.get('/admin/users', { params }).then(r => r.data),
  updateUser: (id, params) => api.put(`/admin/users/${id}`, null, { params }).then(r => r.data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`).then(r => r.data),
  listUrls: (params) => api.get('/admin/urls', { params }).then(r => r.data),
  deleteUrl: (id) => api.delete(`/admin/urls/${id}`).then(r => r.data),
}
