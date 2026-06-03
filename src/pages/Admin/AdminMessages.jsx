import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { adminGetMessages, adminMarkRead } from '../../api/endpoints'
import Modal from '../../components/ui/Modal'

export default function AdminMessages() {
  const qc = useQueryClient()
  const [selected, setSelected] = useState(null)
  const { data: messages = [], isLoading } = useQuery({ queryKey: ['admin-messages'], queryFn: adminGetMessages })

  const markReadMut = useMutation({
    mutationFn: adminMarkRead,
    onSuccess: () => { toast.success('Marked as read'); qc.invalidateQueries({ queryKey: ['admin-messages'] }) },
    onError: () => toast.error('Failed'),
  })

  const unread = messages.filter(m => !m.is_read).length

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="font-heading text-3xl text-text">Messages</h1>
        {unread > 0 && (
          <span className="bg-accent text-white text-xs font-body px-2 py-0.5 rounded-full">{unread} unread</span>
        )}
      </div>
      {isLoading ? <p className="text-muted font-body">Loading…</p> : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => setSelected(msg)}
              className={`bg-white rounded-xl border p-4 cursor-pointer hover:border-accent transition-colors ${
                msg.is_read ? 'border-sand' : 'border-accent/50 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {!msg.is_read && <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />}
                    <p className="font-body font-bold text-text text-sm truncate">{msg.name}</p>
                    <p className="text-muted text-xs">{msg.email}</p>
                  </div>
                  <p className="font-body text-sm text-text truncate">{msg.subject}</p>
                  <p className="font-body text-xs text-muted truncate mt-0.5">{msg.message}</p>
                </div>
                <p className="text-xs text-muted flex-shrink-0">
                  {new Date(msg.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.subject}>
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm font-body">
              <div><span className="text-muted">From:</span> {selected.name}</div>
              <div><span className="text-muted">Email:</span> {selected.email}</div>
              {selected.phone && <div><span className="text-muted">Phone:</span> {selected.phone}</div>}
              <div><span className="text-muted">Date:</span> {new Date(selected.created_at).toLocaleString()}</div>
            </div>
            <p className="font-body text-text leading-relaxed whitespace-pre-wrap border-t border-sand pt-4">
              {selected.message}
            </p>
            {!selected.is_read && (
              <button
                onClick={() => { markReadMut.mutate(selected.id); setSelected(null) }}
                className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-body hover:bg-accent/90"
              >
                Mark as Read
              </button>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
