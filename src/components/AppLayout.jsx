import { Outlet, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from './Button'

export default function AppLayout() {
  const { user, logout, isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 grid place-items-center text-white font-bold shadow-md group-hover:scale-105 transition-transform">
              C
            </div>
            <span className="font-bold text-lg text-slate-900 tracking-wide">CinemaX</span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Sedang Tayang</Link>
            {isAuthenticated && (
              <>
                <Link to="/history" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Riwayat Pembelian</Link>
                {/* <Link to="/movies" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Kelola Film (Admin)</Link> */}
              </>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:block text-sm">
                  <span className="text-slate-500">Halo, </span>
                  <span className="font-medium text-slate-900">{user.username}</span>
                </div>
                <Button variant="secondary" size="sm" onClick={logout} className="rounded-full shadow-sm hover:shadow">Keluar</Button>
              </div>
            ) : (
              <Link to="/login">
                <Button size="sm" className="rounded-full shadow-md hover:shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 border-none transition-all hover:-translate-y-0.5">Masuk / Daftar</Button>
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 w-full flex flex-col">
        <Outlet />
      </main>
      <footer className="bg-slate-900 text-slate-400 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 grid place-items-center text-white font-bold text-lg mb-4 opacity-80">
            C
          </div>
          <p className="text-sm font-medium">&copy; {new Date().getFullYear()} CinemaX. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
