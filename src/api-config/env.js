import { create } from 'apisauce';
console.log(1, create);
const apiClient = create({
  baseURL: 'http://195.26.253.123/',
})
console.log(2, apiClient);

if (typeof window !== 'undefined') {
  console.log(3, window.localStorage);
} else {
  console.log(4,'window is undefined (likely SSR)');
}


apiClient.addAsyncRequestTransform(async (request) => {
  const token = window.localStorage.getItem('authToken')

  request.headers['Authorization'] = `token ${token}`
})

export const multiPartConfig = async () => {
  const token = window.localStorage.getItem('authToken')
  console.log('Token:', token);

  return {
    headers: {
      Authorization: `token ${token}`,
      Accept: 'multipart/form-data',
      'Content-Type': ' multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW',
    },
  }
}

export default apiClient
