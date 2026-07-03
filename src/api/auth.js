import client from './client'

export const authApi = {
  login: async ({ username, email }) => {
    // Backend cinema-api menerima field `username` (yang dicocokkan ke kolom `nama`) & `email`.
    const { data } = await client.post('/auth/login', { username, email })
    return data
  },
}
