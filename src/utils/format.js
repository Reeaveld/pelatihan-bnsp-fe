export function formatDate(value) {
  if (!value) return '-'
  try {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date)
  } catch {
    return value
  }
}

export function statusBadgeClass(status) {
  const base =
    'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium'
  if (status === 'Sedang Tayang')
    return `${base} bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200`
  if (status === 'Segera Tayang')
    return `${base} bg-amber-50 text-amber-700 ring-1 ring-amber-200`
  return `${base} bg-slate-100 text-slate-700 ring-1 ring-slate-200`
}
