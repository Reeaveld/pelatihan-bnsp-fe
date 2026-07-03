import { useEffect, useMemo, useState } from 'react'
import { bookingsApi } from '../api/bookings'
import { usersApi } from '../api/users'
import { moviesApi } from '../api/movies'
import PageHeader from '../components/PageHeader'
import Button from '../components/Button'
import Modal from '../components/Modal'
import { Field, TextInput, Select } from '../components/Input'
import { EmptyState, ErrorState, LoadingState } from '../components/StateBanner'

const emptyForm = { user_id: '', movie_id: '', seat_number: '' }

export default function BookingsPage() {
  const [items, setItems] = useState([])
  const [users, setUsers] = useState([])
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const [b, u, m] = await Promise.all([
        bookingsApi.list(),
        usersApi.list(),
        moviesApi.list(),
      ])
      setItems(b)
      setUsers(u)
      setMovies(m)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    if (!query) return items
    const q = query.toLowerCase()
    return items.filter(
      (b) =>
        b.user_nama?.toLowerCase().includes(q) ||
        b.movie_title?.toLowerCase().includes(q) ||
        b.seat_number?.toLowerCase().includes(q)
    )
  }, [items, query])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setFormError('')
    setModalOpen(true)
  }

  const openEdit = (booking) => {
    setEditing(booking)
    setForm({
      user_id: booking.user_id ?? '',
      movie_id: booking.movie_id ?? '',
      seat_number: booking.seat_number || '',
    })
    setFormError('')
    setModalOpen(true)
  }

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.user_id || !form.movie_id || !form.seat_number) {
      setFormError('Pengguna, film, dan nomor kursi wajib diisi.')
      return
    }
    setSubmitting(true)
    setFormError('')
    try {
      const payload = {
        user_id: Number(form.user_id),
        movie_id: Number(form.movie_id),
        seat_number: form.seat_number.trim(),
      }
      if (editing) await bookingsApi.update(editing.id, payload)
      else await bookingsApi.create(payload)
      setModalOpen(false)
      await load()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (booking) => {
    if (!window.confirm(`Hapus pemesanan #${booking.id}?`)) return
    try {
      await bookingsApi.remove(booking.id)
      await load()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <>
      <PageHeader
        title="Manajemen Pemesanan"
        description="Daftar pemesanan tiket berikut pengguna dan film terkait."
        action={<Button onClick={openCreate}>+ Tambah Pemesanan</Button>}
      />

      <div className="mb-4">
        <TextInput
          placeholder="Cari nama pengguna, film, atau kursi..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="sm:max-w-sm"
        />
      </div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Belum ada pemesanan"
          description="Buat pemesanan pertama untuk melihatnya di sini."
          action={<Button onClick={openCreate}>+ Tambah Pemesanan</Button>}
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="text-left px-4 py-2.5 font-medium">ID</th>
                <th className="text-left px-4 py-2.5 font-medium">Pengguna</th>
                <th className="text-left px-4 py-2.5 font-medium">Film</th>
                <th className="text-left px-4 py-2.5 font-medium">Kursi</th>
                <th className="text-right px-4 py-2.5 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50">
                  <td className="px-4 py-2.5 text-slate-500 tabular-nums">#{b.id}</td>
                  <td className="px-4 py-2.5">
                    <p className="font-medium text-slate-900">{b.user_nama}</p>
                    <p className="text-xs text-slate-500">{b.email}</p>
                  </td>
                  <td className="px-4 py-2.5 text-slate-700">{b.movie_title}</td>
                  <td className="px-4 py-2.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 ring-1 ring-slate-200">
                      {b.seat_number}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex justify-end gap-2">
                      <Button variant="secondary" size="sm" onClick={() => openEdit(b)}>
                        Ubah
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(b)}>
                        Hapus
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Ubah Pemesanan' : 'Tambah Pemesanan Baru'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Batal</Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Pengguna" required>
            <Select name="user_id" value={form.user_id} onChange={handleChange}>
              <option value="">— pilih pengguna —</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nama} ({u.email})
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Film" required>
            <Select name="movie_id" value={form.movie_id} onChange={handleChange}>
              <option value="">— pilih film —</option>
              {movies.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Nomor kursi" required>
            <TextInput
              name="seat_number"
              value={form.seat_number}
              onChange={handleChange}
              placeholder="contoh: A1"
            />
          </Field>
          {formError && (
            <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
              {formError}
            </p>
          )}
        </form>
      </Modal>
    </>
  )
}
