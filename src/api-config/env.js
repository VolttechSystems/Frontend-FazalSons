import { create } from 'apisauce'

const apiClient = create({
  baseURL: 'http://195.26.253.123/pos/',
})

apiClient.addAsyncRequestTransform(async (request) => {
  const token = window.localStorage.getItem('authToken')

  request.headers['Authorization'] = `token ${token}`
})

export const multiPartConfig = async () => {
  const token = window.localStorage.getItem('authToken')

  return {
    headers: {
      Authorization: `token ${token}`,
      Accept: 'multipart/form-data',
      'Content-Type': ' multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW',
    },
  }
}

export default apiClient
