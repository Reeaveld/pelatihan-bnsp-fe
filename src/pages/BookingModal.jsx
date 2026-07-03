import { useState, useRef } from 'react'
import Modal from '../components/Modal'
import { Field, TextInput, Select } from '../components/Input'
import Button from '../components/Button'
import { ordersApi } from '../api/orders'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function BookingModal({ movie, onClose }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [form, setForm] = useState({
    watch_at: '10:00',
    seat: 'A1',
    ticket: 1
  })
  const [file, setFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const TICKET_PRICE = 35000
  const TAX_RATE = 0.10
  
  const calculateTotal = () => {
    const qty = parseInt(form.ticket) || 0
    const baseTotal = TICKET_PRICE * qty
    const tax = baseTotal * TAX_RATE
    return baseTotal + tax
  }

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      setError('Bukti pembayaran wajib diunggah.')
      return
    }
    
    setSubmitting(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('user_id', user.id)
      formData.append('movie_name', movie.title)
      formData.append('watch_at', form.watch_at)
      formData.append('seat', form.seat)
      formData.append('ticket', form.ticket)
      formData.append('price', calculateTotal())
      formData.append('payment_proof', file)

      await ordersApi.create(formData)
      onClose()
      navigate('/history')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open={true}
      onClose={onClose}
      title="Pesan Tiket"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} className="rounded-xl">Batal</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={submitting} 
            className="rounded-xl bg-indigo-600 hover:bg-indigo-700 border-none shadow-md"
          >
            {submitting ? 'Memproses...' : 'Konfirmasi & Bayar'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5 py-2">
        <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 mb-6">
          <div className="w-16 h-20 bg-slate-200 rounded-lg overflow-hidden shrink-0">
             <img 
               src={movie.image ? `http://localhost:3000/uploads/${movie.image}` : `https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=200&auto=format&fit=crop&seed=${movie.id}`} 
               alt={movie.title}
               className="w-full h-full object-cover"
             />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">{movie.title}</h4>
            <p className="text-sm text-slate-500 line-clamp-2">{movie.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Jam Tayang" required>
            <Select name="watch_at" value={form.watch_at} onChange={handleChange} className="rounded-xl">
              <option value="10:00">10:00</option>
              <option value="12:30">12:30</option>
              <option value="15:00">15:00</option>
              <option value="19:00">19:00</option>
              <option value="21:15">21:15</option>
            </Select>
          </Field>
          <Field label="Tempat Duduk" required>
             <Select name="seat" value={form.seat} onChange={handleChange} className="rounded-xl">
              {['A1','A2','A3','B1','B2','B3','C1','C2','C3'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </Field>
        </div>

        <Field label="Jumlah Tiket" required>
           <TextInput 
             type="number" 
             name="ticket" 
             value={form.ticket} 
             onChange={handleChange} 
             min="1" 
             max="10"
             className="rounded-xl"
           />
        </Field>

        <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-2">
           <div className="flex justify-between text-sm text-slate-600">
             <span>Harga Tiket ({form.ticket}x)</span>
             <span>Rp {(TICKET_PRICE * form.ticket).toLocaleString('id-ID')}</span>
           </div>
           <div className="flex justify-between text-sm text-slate-600">
             <span>Pajak (10%)</span>
             <span>Rp {(TICKET_PRICE * form.ticket * TAX_RATE).toLocaleString('id-ID')}</span>
           </div>
           <div className="pt-2 border-t border-indigo-100 flex justify-between font-bold text-indigo-900 text-lg">
             <span>Total</span>
             <span>Rp {calculateTotal().toLocaleString('id-ID')}</span>
           </div>
        </div>

        <Field label="Bukti Pembayaran (Transfer ke BCA 123456789 a.n CinemaX)" required>
           <input 
             type="file"
             accept="image/*"
             onChange={handleFileChange}
             ref={fileInputRef}
             className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2.5 file:px-4
                file:rounded-xl file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100
                cursor-pointer"
           />
        </Field>

        {error && (
          <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 font-medium">
            {error}
          </p>
        )}
      </form>
    </Modal>
  )
}
