import { useEffect, useMemo, useState } from 'react'
import { moviesApi } from '../api/movies'
import PageHeader from '../components/PageHeader'
import Button from '../components/Button'
import Modal from '../components/Modal'
import { Field, TextInput, TextArea, Select } from '../components/Input'
import { EmptyState, ErrorState, LoadingState } from '../components/StateBanner'
import { formatDate, statusBadgeClass } from '../utils/format'

const emptyForm = { title: '', description: '', status: 'Segera Tayang', jadwal: '', image: null }

export default function MoviesPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [imageFile, setImageFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await moviesApi.list()
      setItems(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    return items.filter((m) => {
      const matchQuery =
        !query ||
        m.title?.toLowerCase().includes(query.toLowerCase()) ||
        m.description?.toLowerCase().includes(query.toLowerCase())
      const matchStatus = statusFilter === 'all' || m.status === statusFilter
      return matchQuery && matchStatus
    })
  }, [items, query, statusFilter])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setImageFile(null)
    setFormError('')
    setModalOpen(true)
  }

  const openEdit = (movie) => {
    setEditing(movie)
    setForm({
      title: movie.title || '',
      description: movie.description || '',
      status: movie.status || 'Segera Tayang',
      jadwal: movie.jadwal ? movie.jadwal.substring(0, 10) : '',
    })
    setImageFile(null)
    setFormError('')
    setModalOpen(true)
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) {
      setFormError('Judul film wajib diisi.')
      return
    }
    setSubmitting(true)
    setFormError('')
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('status', form.status);
      formData.append('jadwal', form.jadwal);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (editing) {
        await moviesApi.update(editing.id, formData)
      } else {
        await moviesApi.create(formData)
      }
      setModalOpen(false)
      await load()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (movie) => {
    if (!window.confirm(`Hapus film "${movie.title}"? Tindakan ini tidak bisa dibatalkan.`)) return
    try {
      await moviesApi.remove(movie.id)
      await load()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <>
      <PageHeader
        title="Manajemen Film"
        description="Tambah, ubah, dan hapus daftar film yang tersedia di bioskop."
        action={<Button onClick={openCreate}>+ Tambah Film</Button>}
      />

      <div className="mb-4 flex flex-col sm:flex-row gap-3">
        <TextInput
          placeholder="Cari judul atau deskripsi..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="sm:max-w-xs"
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="sm:max-w-[200px]"
        >
          <option value="all">Semua status</option>
          <option value="Segera Tayang">Segera Tayang</option>
          <option value="Sedang Tayang">Sedang Tayang</option>
        </Select>
      </div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Tidak ada film ditemukan"
          description="Coba ubah kata kunci pencarian, atau tambahkan film baru."
          action={<Button onClick={openCreate}>+ Tambah Film</Button>}
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="text-left px-4 py-2.5 font-medium">ID</th>
                <th className="text-left px-4 py-2.5 font-medium">Judul</th>
                <th className="text-left px-4 py-2.5 font-medium">Status</th>
                <th className="text-left px-4 py-2.5 font-medium">Jadwal</th>
                <th className="text-right px-4 py-2.5 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50">
                  <td className="px-4 py-2.5 text-slate-500 tabular-nums">#{m.id}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      {m.image ? (
                        <img src={`http://localhost:3000/uploads/${m.image}`} alt={m.title} className="w-10 h-14 object-cover rounded-md bg-slate-200 shrink-0" />
                      ) : (
                        <div className="w-10 h-14 rounded-md bg-slate-200 shrink-0 flex items-center justify-center text-slate-400 text-xs">No Img</div>
                      )}
                      <div>
                        <p className="font-medium text-slate-900">{m.title}</p>
                        {m.description && (
                          <p className="text-xs text-slate-500 line-clamp-1 max-w-xs">
                            {m.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={statusBadgeClass(m.status)}>{m.status}</span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-600">{formatDate(m.jadwal)}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex justify-end gap-2">
                      <Button variant="secondary" size="sm" onClick={() => openEdit(m)}>
                        Ubah
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(m)}>
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
        title={editing ? 'Ubah Film' : 'Tambah Film Baru'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Judul" required>
            <TextInput name="title" value={form.title} onChange={handleChange} />
          </Field>
          <Field label="Deskripsi">
            <TextArea name="description" value={form.description} onChange={handleChange} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Status">
              <Select name="status" value={form.status} onChange={handleChange}>
                <option value="Segera Tayang">Segera Tayang</option>
                <option value="Sedang Tayang">Sedang Tayang</option>
              </Select>
            </Field>
            <Field label="Jadwal">
              <TextInput
                type="date"
                name="jadwal"
                value={form.jadwal}
                onChange={handleChange}
              />
            </Field>
          </div>
          <Field label="Gambar Poster (Opsional)">
             <input 
               type="file"
               accept="image/*"
               onChange={(e) => setImageFile(e.target.files[0])}
               className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2.5 file:px-4
                  file:rounded-xl file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100
                  cursor-pointer"
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
