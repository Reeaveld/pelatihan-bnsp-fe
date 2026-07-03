export function Field({ label, error, required, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-700 mb-1">
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-rose-600">{error}</span>}
    </label>
  )
}

export function TextInput({ className = '', ...rest }) {
  return (
    <input
      className={[
        'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900',
        'placeholder-slate-400 shadow-sm',
        'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none',
        'disabled:bg-slate-50 disabled:text-slate-500',
        className,
      ].join(' ')}
      {...rest}
    />
  )
}

export function TextArea({ className = '', rows = 4, ...rest }) {
  return (
    <textarea
      rows={rows}
      className={[
        'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900',
        'placeholder-slate-400 shadow-sm resize-y',
        'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none',
        className,
      ].join(' ')}
      {...rest}
    />
  )
}

export function Select({ className = '', children, ...rest }) {
  return (
    <select
      className={[
        'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900',
        'shadow-sm',
        'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none',
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </select>
  )
}
