import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] grid place-items-center text-center">
      <div>
        <p className="text-sm font-semibold text-indigo-600">404</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">
          Halaman tidak ditemukan
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          URL yang Anda kunjungi tidak tersedia atau sudah dipindahkan.
        </p>
        <Link
          to="/"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          ← Kembali ke dashboard
        </Link>
      </div>
    </div>
  )
}
