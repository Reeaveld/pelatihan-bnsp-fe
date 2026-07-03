import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Field, TextInput } from '../components/Input'
import Button from '../components/Button'

export default function LoginPage() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({ username: '', email: '' })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.username || !form.email) {
      setError('Nama pengguna dan email wajib diisi.')
      return
    }
    try {
      await login(form)
      const target = location.state?.from?.pathname || '/'
      navigate(target, { replace: true })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50">
      {/* Sisi kiri: informasi brand */}
      <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 text-white">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-white/15 backdrop-blur grid place-items-center font-bold">
            C
          </div>
          <span className="font-semibold">Cinema Admin</span>
        </div>
        <div className="max-w-md">
          <h1 className="text-3xl font-semibold leading-tight">
            Kelola film, pengguna, dan pemesanan bioskop Anda dalam satu tempat.
          </h1>
          <p className="mt-4 text-indigo-100/80 text-sm">
            Panel admin sederhana namun bertenaga untuk sistem manajemen
            bioskop yang dibangun dengan Express, MySQL, dan React.
          </p>
        </div>
        <p className="text-xs text-indigo-100/60">
          © {new Date().getFullYear()} Cinema Admin — Pelatihan BNSP
        </p>
      </div>

      {/* Sisi kanan: form login */}
      <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-6 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 grid place-items-center text-white font-bold">
              C
            </div>
            <span className="font-semibold text-slate-900">Cinema Admin</span>
          </div>
          <h2 className="text-2xl font-semibold text-slate-900">Masuk</h2>
          <p className="mt-1 text-sm text-slate-500">
            Masukkan nama pengguna dan email yang sudah terdaftar di sistem.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Field label="Nama pengguna" required>
              <TextInput
                name="username"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
                placeholder="contoh: ahmad"
              />
            </Field>
            <Field label="Email" required>
              <TextInput
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                placeholder="contoh: ahmad@gmail.com"
              />
            </Field>

            {error && (
              <div className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-sm text-rose-700">
                {error}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </Button>

            <p className="text-xs text-slate-500 text-center">
              Belum punya akun? Tambahkan lewat menu Users setelah masuk.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
