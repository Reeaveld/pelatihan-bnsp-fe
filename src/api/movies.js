import client from './client'

export const moviesApi = {
  list: async () => {
    const { data } = await client.get('/movies')
    return data.data
  },
  get: async (id) => {
    const { data } = await client.get(`/movies/${id}`)
    return data.data
  },
  create: async (payload) => {
    let requestData = payload;
    let headers = {};
    if (payload instanceof FormData) {
        requestData = payload;
        headers = { 'Content-Type': 'multipart/form-data' };
    }
    const { data } = await client.post('/movies', requestData, { headers })
    return data
  },
  update: async (id, payload) => {
    let requestData = payload;
    let headers = {};
    if (payload instanceof FormData) {
        requestData = payload;
        headers = { 'Content-Type': 'multipart/form-data' };
    }
    const { data } = await client.put(`/movies/${id}`, requestData, { headers })
    return data
  },
  remove: async (id) => {
    const { data } = await client.delete(`/movies/${id}`)
    return data
  },
}
