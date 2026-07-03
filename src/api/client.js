import axios from 'axios'

/**
 * Axios instance terpusat.
 * Base URL dibaca dari .env (VITE_API_URL). Fallback ke localhost:3000/api.
 */
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Response interceptor untuk normalisasi error
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Terjadi kesalahan jaringan.'
    return Promise.reject(new Error(message))
  }
)

export default client
