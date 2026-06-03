export default function AdminTable({ columns, data, onEdit, onDelete, extraActions, actionStyle = 'link' }) {
  const editClassName = actionStyle === 'button'
    ? 'mr-2 inline-flex items-center justify-center rounded-full border border-[#d8c1a0] bg-[#f7efe2] px-3 py-1.5 text-xs font-medium text-[#6f5743] transition-colors hover:border-[#b8945b] hover:bg-[#fff7ea] hover:text-[#b8945b]'
    : 'mr-4 text-xs text-accent hover:underline'

  const deleteClassName = actionStyle === 'button'
    ? 'inline-flex items-center justify-center rounded-full border border-[#f0c8c8] bg-[#fff4f4] px-3 py-1.5 text-xs font-medium text-[#c45a5a] transition-colors hover:border-[#e28a8a] hover:bg-[#ffeaea]'
    : 'text-xs text-red-400 hover:underline'

  return (
    <div className="overflow-x-auto rounded-xl border border-sand">
      <table className="w-full text-sm font-body">
        <thead className="bg-beige text-muted uppercase text-xs tracking-wide">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 text-left font-medium">{col.label}</th>
            ))}
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-sand bg-white">
          {data.length === 0 && (
            <tr><td colSpan={columns.length + 1} className="px-4 py-8 text-center text-muted">No records found.</td></tr>
          )}
          {data.map((row) => (
            <tr key={row.id ?? row.slug} className="hover:bg-beige/50 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-text max-w-xs truncate">
                  {col.render ? col.render(row) : row[col.key] ?? '-'}
                </td>
              ))}
              <td className={`px-4 py-3 text-right whitespace-nowrap ${actionStyle === 'button' ? 'min-w-[260px]' : ''}`}>
                {extraActions?.(row)}
                <button
                  onClick={() => onEdit(row)}
                  className={editClassName}
                >Edit</button>
                <button
                  onClick={() => onDelete(row)}
                  className={deleteClassName}
                >Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
