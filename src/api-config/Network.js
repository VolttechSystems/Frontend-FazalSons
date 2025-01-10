import apiClient from './env'

export default {
  get: async (url, header, data) => {
    if (header) apiClient.setHeaders(header)
    else {
      apiClient.setHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      })
    }

    return await apiClient.get(url, data)
  },

  post: async (url, data, header) => {
    if (header) apiClient.setHeaders(header)
    else {
      apiClient.setHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      })
    }

    return await apiClient.post(url, data)
  },

  patch: async (url, data, header) => {
    if (header) apiClient.setHeaders(header)
    else {
      apiClient.setHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      })
    }

    return await apiClient.patch(url, data)
  },
  put: async (url, data, header) => {
    if (header) apiClient.setHeaders(header)
    else {
      apiClient.setHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      })
    }

    return await apiClient.put(url, data)
  },

  delete: async (url, data, header) => {
    if (header) apiClient.setHeaders(header)
    else {
      apiClient.setHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      })
    }

    return await apiClient.delete(url, data)
  },
}
