import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const titleMap = {
  '/': 'Dashboard',
  '/movies': 'Manajemen Film',
  '/users': 'Manajemen Pengguna',
  '/bookings': 'Manajemen Pemesanan',
}

export default function Topbar() {
  const location = useLocation()
  const { user } = useAuth()
  const title =
    titleMap[location.pathname] ||
    (location.pathname.startsWith('/movies')
      ? 'Manajemen Film'
      : location.pathname.startsWith('/users')
        ? 'Manajemen Pengguna'
        : location.pathname.startsWith('/bookings')
          ? 'Manajemen Pemesanan'
          : 'Cinema Admin')

  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-4 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
        <p className="text-xs text-slate-500">
          Selamat datang kembali, {user?.nama || 'pengguna'}.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          API terhubung
        </span>
      </div>
    </header>
  )
}
