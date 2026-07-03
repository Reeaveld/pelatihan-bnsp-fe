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
    const { data } = await client.post('/movies', payload)
    return data
  },
  update: async (id, payload) => {
    const { data } = await client.put(`/movies/${id}`, payload)
    return data
  },
  remove: async (id) => {
    const { data } = await client.delete(`/movies/${id}`)
    return data
  },
}
