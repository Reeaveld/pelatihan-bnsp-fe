import client from './client'

export const bookingsApi = {
  list: async () => {
    const { data } = await client.get('/bookings')
    return data.data
  },
  get: async (id) => {
    const { data } = await client.get(`/bookings/${id}`)
    return data.data
  },
  create: async (payload) => {
    const { data } = await client.post('/bookings', payload)
    return data
  },
  update: async (id, payload) => {
    const { data } = await client.put(`/bookings/${id}`, payload)
    return data
  },
  remove: async (id) => {
    const { data } = await client.delete(`/bookings/${id}`)
    return data
  },
}
