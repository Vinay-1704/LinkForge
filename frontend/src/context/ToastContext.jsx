import { createContext, useContext, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

const ICONS = {
  success: <CheckCircle className="w-5 h-5 text-green-500" />,
  error: <XCircle className="w-5 h-5 text-red-500" />,
  warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
}

function Toast({ id, type = 'info', title, message, onClose }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex items-start gap-3 p-4 rounded-xl shadow-xl border"
      style={{
        background: 'hsl(var(--card))',
        borderColor: 'hsl(var(--border))',
        minWidth: '300px',
        maxWidth: '400px',
      }}
    >
      {ICONS[type]}
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold text-sm" style={{ color: 'hsl(var(--foreground))' }}>{title}</p>}
        {message && <p className="text-sm mt-0.5" style={{ color: 'hsl(var(--muted-foreground))' }}>{message}</p>}
      </div>
      <button onClick={() => onClose(id)} className="p-0.5 rounded hover:opacity-70 transition-opacity" style={{ color: 'hsl(var(--muted-foreground))' }}>
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, type, title, message }])
    setTimeout(() => removeToast(id), duration)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = {
    success: (msg, title) => addToast({ type: 'success', title, message: msg }),
    error: (msg, title) => addToast({ type: 'error', title, message: msg }),
    warning: (msg, title) => addToast({ type: 'warning', title, message: msg }),
    info: (msg, title) => addToast({ type: 'info', title, message: msg }),
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map(t => (
            <Toast key={t.id} {...t} onClose={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
