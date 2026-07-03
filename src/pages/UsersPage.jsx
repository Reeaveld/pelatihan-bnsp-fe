import { useEffect, useMemo, useState } from 'react'
import { usersApi } from '../api/users'
import PageHeader from '../components/PageHeader'
import Button from '../components/Button'
import Modal from '../components/Modal'
import { Field, TextInput, Select } from '../components/Input'
import { EmptyState, ErrorState, LoadingState } from '../components/StateBanner'

const emptyForm = { nama: '', nohp: '', email: '', gender: 'L' }

export default function UsersPage() {
  const [items, setItems] = useState([])
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
      setItems(await usersApi.list())
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
      (u) =>
        u.nama?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.nohp?.toLowerCase().includes(q)
    )
  }, [items, query])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setFormError('')
    setModalOpen(true)
  }

  const openEdit = (user) => {
    setEditing(user)
    setForm({
      nama: user.nama || '',
      nohp: user.nohp || '',
      email: user.email || '',
      gender: user.gender || 'L',
    })
    setFormError('')
    setModalOpen(true)
  }

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.nama.trim() || !form.email.trim()) {
      setFormError('Nama dan email wajib diisi.')
      return
    }
    setSubmitting(true)
    setFormError('')
    try {
      if (editing) await usersApi.update(editing.id, form)
      else await usersApi.create(form)
      setModalOpen(false)
      await load()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (user) => {
    if (!window.confirm(`Hapus pengguna "${user.nama}"?`)) return
    try {
      await usersApi.remove(user.id)
      await load()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <>
      <PageHeader
        title="Manajemen Pengguna"
        description="Kelola daftar pengguna yang dapat memesan tiket bioskop."
        action={<Button onClick={openCreate}>+ Tambah Pengguna</Button>}
      />

      <div className="mb-4">
        <TextInput
          placeholder="Cari nama, email, atau nomor HP..."
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
          title="Belum ada pengguna"
          description="Tambahkan pengguna pertama untuk mulai menerima pemesanan."
          action={<Button onClick={openCreate}>+ Tambah Pengguna</Button>}
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="text-left px-4 py-2.5 font-medium">ID</th>
                <th className="text-left px-4 py-2.5 font-medium">Nama</th>
                <th className="text-left px-4 py-2.5 font-medium">Email</th>
                <th className="text-left px-4 py-2.5 font-medium">No. HP</th>
                <th className="text-left px-4 py-2.5 font-medium">Gender</th>
                <th className="text-right px-4 py-2.5 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-4 py-2.5 text-slate-500 tabular-nums">#{u.id}</td>
                  <td className="px-4 py-2.5 font-medium text-slate-900">{u.nama}</td>
                  <td className="px-4 py-2.5 text-slate-600">{u.email}</td>
                  <td className="px-4 py-2.5 text-slate-600">{u.nohp || '-'}</td>
                  <td className="px-4 py-2.5 text-slate-600">
                    {u.gender === 'L' ? 'Laki-laki' : u.gender === 'P' ? 'Perempuan' : '-'}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex justify-end gap-2">
                      <Button variant="secondary" size="sm" onClick={() => openEdit(u)}>
                        Ubah
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(u)}>
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
        title={editing ? 'Ubah Pengguna' : 'Tambah Pengguna Baru'}
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
          <Field label="Nama" required>
            <TextInput name="nama" value={form.nama} onChange={handleChange} />
          </Field>
          <Field label="Email" required>
            <TextInput type="email" name="email" value={form.email} onChange={handleChange} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="No. HP">
              <TextInput name="nohp" value={form.nohp} onChange={handleChange} />
            </Field>
            <Field label="Gender">
              <Select name="gender" value={form.gender} onChange={handleChange}>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </Select>
            </Field>
          </div>
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
