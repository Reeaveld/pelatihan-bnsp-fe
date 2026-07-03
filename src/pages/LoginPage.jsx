import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Field, TextInput } from '../components/Input'
import Button from '../components/Button'

export default function LoginPage() {
  const { login, register, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [isRegister, setIsRegister] = useState(false)
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (isRegister) {
        if (!form.username || !form.email || !form.password) {
          setError('Semua field wajib diisi.')
          return
        }
        await register(form)
      } else {
        if (!form.email || !form.password) {
          setError('Email dan password wajib diisi.')
          return
        }
        await login({ email: form.email, password: form.password })
      }
      const target = location.state?.from?.pathname || '/'
      navigate(target, { replace: true })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50 relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-500/20 blur-3xl"></div>
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-3xl"></div>
      </div>

      {/* Sisi kiri: informasi brand */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-slate-900 text-white relative z-10 shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
        
        <div className="relative z-20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 grid place-items-center font-bold text-lg shadow-lg">
            C
          </div>
          <span className="font-bold text-xl tracking-wide">CinemaX</span>
        </div>
        <div className="relative z-20 max-w-md mt-auto mb-10">
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Rasakan Pengalaman Menonton Terbaik.
          </h1>
          <p className="text-slate-300 text-lg">
            Pesan tiket film favorit Anda dengan mudah, cepat, dan aman hanya di CinemaX.
          </p>
        </div>
        <p className="relative z-20 text-sm text-slate-400 font-medium">
          © {new Date().getFullYear()} CinemaX Prototype
        </p>
      </div>

      {/* Sisi kanan: form login/register */}
      <div className="flex items-center justify-center px-6 py-12 sm:px-12 lg:px-16 relative z-10 backdrop-blur-sm bg-white/70">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
          <div className="lg:hidden mb-8 flex justify-center items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 grid place-items-center text-white font-bold text-lg">
              C
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-wide">CinemaX</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-2">
            {isRegister ? 'Buat Akun' : 'Selamat Datang'}
          </h2>
          <p className="text-sm text-slate-500 text-center mb-8">
            {isRegister ? 'Daftar untuk mulai memesan tiket.' : 'Masuk untuk melanjutkan.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && (
              <Field label="Username" required>
                <TextInput
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  autoComplete="username"
                  placeholder="contoh: budi123"
                  className="rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </Field>
            )}
            <Field label="Email" required>
              <TextInput
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                placeholder="contoh: budi@gmail.com"
                className="rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </Field>
            <Field label="Password" required>
              <TextInput
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="********"
                className="rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </Field>

            {error && (
              <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700 font-medium">
                {error}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border-none shadow-md shadow-indigo-200 transform transition hover:-translate-y-0.5"
              disabled={loading}
            >
              {loading ? 'Memproses...' : (isRegister ? 'Daftar' : 'Masuk')}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setIsRegister(!isRegister)
                setError('')
              }}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              {isRegister ? 'Sudah punya akun? Masuk' : 'Belum punya akun? Daftar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
