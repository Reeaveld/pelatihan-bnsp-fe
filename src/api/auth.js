import client from './client'

export const authApi = {
  login: async ({ email, password }) => {
    const { data } = await client.post('/auth/login', { email, password })
    return data
  },
  register: async ({ username, email, password }) => {
    const { data } = await client.post('/auth/register', { username, email, password })
    return data
  }
}
