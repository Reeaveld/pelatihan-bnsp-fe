import { useState, useEffect } from 'react'
import { ordersApi } from '../api/orders'
import { useAuth } from '../context/AuthContext'
import PageHeader from '../components/PageHeader'
import Button from '../components/Button'
import { EmptyState, ErrorState, LoadingState } from '../components/StateBanner'
import { formatDate } from '../utils/format'

export default function HistoryPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await ordersApi.getHistory(user.id)
      setOrders(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) load()
  }, [user])

  const handleCancel = async (orderId) => {
    if (!window.confirm('Anda yakin ingin membatalkan pesanan ini?')) return
    try {
      await ordersApi.cancel(orderId, user.id)
      await load()
    } catch (err) {
      alert(err.message)
    }
  }

  const API_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:3000'

  return (
    <div className="w-full">
      <PageHeader
        title="Riwayat Pembelian"
        description="Lihat daftar tiket yang sudah Anda pesan dan status pembayarannya."
      />

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : orders.length === 0 ? (
        <EmptyState
          title="Belum ada riwayat"
          description="Anda belum memesan tiket apa pun. Mulai jelajahi film yang sedang tayang."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
               <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 mb-1">{order.movie_name}</h3>
                    <p className="text-xs font-medium text-slate-500">Pemesanan: {formatDate(order.created_at)}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                     Berhasil
                  </span>
               </div>
               
               <div className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <p className="text-xs text-slate-500 mb-1">Jadwal Tayang</p>
                        <p className="font-semibold text-slate-900">{order.watch_at}</p>
                     </div>
                     <div>
                        <p className="text-xs text-slate-500 mb-1">Tempat Duduk</p>
                        <p className="font-semibold text-slate-900">{order.seat}</p>
                     </div>
                     <div>
                        <p className="text-xs text-slate-500 mb-1">Jumlah Tiket</p>
                        <p className="font-semibold text-slate-900">{order.ticket}x</p>
                     </div>
                     <div>
                        <p className="text-xs text-slate-500 mb-1">Total Harga</p>
                        <p className="font-bold text-indigo-600">Rp {order.price.toLocaleString('id-ID')}</p>
                     </div>
                  </div>

                  {order.payment_proof && (
                     <div className="pt-4 border-t border-slate-100">
                        <p className="text-xs text-slate-500 mb-2">Bukti Pembayaran</p>
                        <a href={`${API_URL}/uploads/${order.payment_proof}`} target="_blank" rel="noreferrer" className="block relative h-32 rounded-xl overflow-hidden border border-slate-200 group bg-slate-100">
                           <img src={`${API_URL}/uploads/${order.payment_proof}`} alt="Bukti Pembayaran" className="w-full h-full object-cover group-hover:opacity-75 transition-opacity" />
                           <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="bg-slate-900/70 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">Lihat Penuh</span>
                           </div>
                        </a>
                     </div>
                  )}
               </div>

               <div className="p-5 pt-0">
                  <Button variant="danger" className="w-full rounded-xl" onClick={() => handleCancel(order.id)}>
                     Batalkan Pesanan
                  </Button>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
