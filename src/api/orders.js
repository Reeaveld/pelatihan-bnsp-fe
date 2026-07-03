import client from './client'

export const ordersApi = {
  getHistory: async (userId) => {
    const { data } = await client.get(`/orders?user_id=${userId}`)
    return data.data
  },
  create: async (formData) => {
    // formData is multipart/form-data
    const { data } = await client.post('/orders', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return data
  },
  cancel: async (orderId, userId) => {
    const { data } = await client.post(`/orders/${orderId}/cancel`, { user_id: userId })
    return data
  },
}
