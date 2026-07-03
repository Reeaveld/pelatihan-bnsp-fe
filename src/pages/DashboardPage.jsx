import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { moviesApi } from '../api/movies'
import { usersApi } from '../api/users'
import { bookingsApi } from '../api/bookings'
import PageHeader from '../components/PageHeader'
import { ErrorState, LoadingState } from '../components/StateBanner'
import { statusBadgeClass } from '../utils/format'

export default function DashboardPage() {
  const [stats, setStats] = useState({ movies: 0, users: 0, bookings: 0 })
  const [recentMovies, setRecentMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const [movies, users, bookings] = await Promise.all([
        moviesApi.list(),
        usersApi.list(),
        bookingsApi.list(),
      ])
      setStats({
        movies: movies.length,
        users: users.length,
        bookings: bookings.length,
      })
      setRecentMovies(movies.slice(0, 5))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <>
      <PageHeader
        title="Ringkasan"
        description="Statistik dan aktivitas terbaru pada sistem manajemen bioskop."
      />

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              label="Total Film"
              value={stats.movies}
              to="/movies"
              accent="indigo"
            />
            <StatCard
              label="Total Pengguna"
              value={stats.users}
              to="/users"
              accent="emerald"
            />
            <StatCard
              label="Total Pemesanan"
              value={stats.bookings}
              to="/bookings"
              accent="amber"
            />
          </div>

          <section className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900">
                Film terbaru
              </h3>
              <Link
                to="/movies"
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Lihat semua
              </Link>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="text-left px-4 py-2.5 font-medium">Judul</th>
                    <th className="text-left px-4 py-2.5 font-medium">Status</th>
                    <th className="text-left px-4 py-2.5 font-medium">Jadwal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentMovies.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-4 py-6 text-center text-slate-500">
                        Belum ada film terdaftar.
                      </td>
                    </tr>
                  )}
                  {recentMovies.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50">
                      <td className="px-4 py-2.5 font-medium text-slate-900">
                        {m.title}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={statusBadgeClass(m.status)}>{m.status}</span>
                      </td>
                      <td className="px-4 py-2.5 text-slate-600">
                        {m.jadwal ? new Date(m.jadwal).toLocaleDateString('id-ID') : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </>
  )
}

function StatCard({ label, value, to, accent }) {
  const accents = {
    indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    amber: 'bg-amber-50 text-amber-700 ring-amber-100',
  }
  return (
    <Link
      to={to}
      className="rounded-xl border border-slate-200 bg-white p-5 hover:shadow-sm hover:border-slate-300 transition"
    >
      <div
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ring-1 ${accents[accent]}`}
      >
        {label}
      </div>
      <p className="mt-3 text-3xl font-semibold text-slate-900 tabular-nums">
        {value}
      </p>
      <p className="mt-1 text-xs text-slate-500">Klik untuk mengelola</p>
    </Link>
  )
}
