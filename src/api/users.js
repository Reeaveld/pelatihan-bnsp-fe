import client from './client'

export const usersApi = {
  list: async () => {
    const { data } = await client.get('/users')
    return data.data
  },
  get: async (id) => {
    const { data } = await client.get(`/users/${id}`)
    return data.data
  },
  create: async (payload) => {
    const { data } = await client.post('/users', payload)
    return data
  },
  update: async (id, payload) => {
    const { data } = await client.put(`/users/${id}`, payload)
    return data
  },
  remove: async (id) => {
    const { data } = await client.delete(`/users/${id}`)
    return data
  },
}
