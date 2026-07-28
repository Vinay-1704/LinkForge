import api from './api'

export const urlService = {
  create: (data) => api.post('/urls', data).then(r => r.data),
  list: (params) => api.get('/urls', { params }).then(r => r.data),
  getById: (id) => api.get(`/urls/${id}`).then(r => r.data),
  update: (id, data) => api.put(`/urls/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/urls/${id}`).then(r => r.data),
  toggleFavorite: (id) => api.post(`/urls/${id}/favorite`).then(r => r.data),
  getQrPng: (id) => api.get(`/urls/${id}/qr`, { responseType: 'blob' }).then(r => r.data),
  getQrSvg: (id) => api.get(`/urls/${id}/qr/svg`, { responseType: 'blob' }).then(r => r.data),
  regenerateQr: (id) => api.post(`/urls/${id}/qr/regenerate`).then(r => r.data),
}
