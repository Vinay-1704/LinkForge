import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Plus, Copy, ExternalLink, Star, Trash2,
  ToggleLeft, ToggleRight, QrCode, Download, X,
  Filter, SortDesc, ChevronLeft, ChevronRight, Lock,
} from 'lucide-react'
import { urlService } from '@/services/url.service'
import { useToast } from '@/context/ToastContext'
import { formatDate, formatNumber, truncate, copyToClipboard, isExpired } from '@/utils/helpers'

function StatusBadge({ url }) {
  if (!url.is_active) return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400">Inactive</span>
  if (isExpired(url.expires_at)) return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-500/20 text-orange-400">Expired</span>
  return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">Active</span>
}

/** QR Code Modal — shows the QR image from the static backend URL */
function QrModal({ url, onClose }) {
  const { toast } = useToast()

  // Strip the backend origin so request goes through Vite's /static proxy (avoids CORS)
  const qrSrc = url.qr_code_url
    ? url.qr_code_url.replace(/^https?:\/\/[^/]+/, '')
    : null

  const handleDownload = async () => {
    if (!qrSrc) {
      toast.error('QR code not available')
      return
    }
    try {
      const response = await fetch(qrSrc)
      if (!response.ok) throw new Error('Failed to fetch QR')
      const blob = await response.blob()
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `qr-${url.short_code}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(link.href)
      toast.success('QR downloaded!')
    } catch {
      toast.error('Failed to download QR code')
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.7)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass rounded-2xl p-6 max-w-sm w-full relative"
          onClick={e => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-lg hover:opacity-70" style={{ color: 'hsl(var(--muted-foreground))' }}>
            <X className="w-5 h-5" />
          </button>

          <h3 className="font-bold text-lg mb-1" style={{ color: 'hsl(var(--foreground))' }}>QR Code</h3>
          <p className="text-xs mb-4 truncate" style={{ color: 'hsl(var(--muted-foreground))' }}>{url.short_url}</p>

          {qrSrc ? (
            <div className="flex justify-center mb-4">
              <img
                src={qrSrc}
                alt={`QR for ${url.short_code}`}
                className="w-48 h-48 rounded-xl bg-white p-2"
                onError={e => { e.target.style.display = 'none' }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center w-48 h-48 mx-auto mb-4 rounded-xl bg-gray-100 dark:bg-gray-800">
              <p className="text-xs text-center px-4" style={{ color: 'hsl(var(--muted-foreground))' }}>QR code not generated yet</p>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              disabled={!qrSrc}
              className="flex-1 btn-gradient text-white font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <Download className="w-4 h-4" /> Download PNG
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function MyURLsPage() {
  const { toast } = useToast()
  const qc = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortDir, setSortDir] = useState('desc')
  const [filterActive, setFilterActive] = useState(null)
  const [filterFav, setFilterFav] = useState(null)
  const [qrModal, setQrModal] = useState(null)  // holds url object
  const [selected, setSelected] = useState([])

  const { data, isLoading } = useQuery({
    queryKey: ['urls', page, search, sortBy, sortDir, filterActive, filterFav],
    queryFn: () => urlService.list({
      page, page_size: 10, search: search || undefined,
      is_active: filterActive,
      is_favorite: filterFav,
      sort_by: sortBy,
      sort_dir: sortDir,
    }),
  })

  const urls = data?.items || []
  const total = data?.total || 0
  const totalPages = data?.total_pages || 1

  const deleteMutation = useMutation({
    mutationFn: urlService.delete,
    onSuccess: () => { toast.success('URL deleted'); qc.invalidateQueries(['urls']); qc.invalidateQueries(['dashboard']) },
    onError: () => toast.error('Failed to delete'),
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_active }) => urlService.update(id, { is_active }),
    onSuccess: () => qc.invalidateQueries(['urls']),
  })

  const favMutation = useMutation({
    mutationFn: urlService.toggleFavorite,
    onSuccess: () => qc.invalidateQueries(['urls']),
  })

  const handleCopy = async (url) => {
    await copyToClipboard(url)
    toast.success('Copied!')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  const handleBulkDelete = async () => {
    if (!selected.length) return
    if (!confirm(`Delete ${selected.length} URL(s)?`)) return
    for (const id of selected) await deleteMutation.mutateAsync(id)
    setSelected([])
  }

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  return (
    <div className="space-y-6">
      {/* QR Modal */}
      {qrModal && <QrModal url={qrModal} onClose={() => setQrModal(null)} />}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black" style={{ color: 'hsl(var(--foreground))' }}>My URLs</h2>
          <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>{total} total links</p>
        </div>
        <Link to="/urls/create" className="btn-gradient text-white font-semibold px-4 py-2.5 rounded-xl inline-flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> New URL
        </Link>
      </div>

      {/* Filters bar */}
      <div className="glass rounded-xl p-4 flex flex-wrap gap-3 items-center">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 min-w-48">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(var(--muted-foreground))' }} />
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search URLs…"
              className="w-full pl-9 pr-4 py-2 rounded-lg border text-sm outline-none"
              style={{ background: 'hsl(var(--input))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
            />
          </div>
          <button type="submit" className="p-2 rounded-lg btn-gradient text-white"><Search className="w-4 h-4" /></button>
        </form>

        {/* Filter Active */}
        <select value={filterActive ?? ''} onChange={e => { setFilterActive(e.target.value === '' ? null : e.target.value === 'true'); setPage(1) }}
          className="px-3 py-2 rounded-lg border text-sm outline-none"
          style={{ background: 'hsl(var(--input))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}>
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        {/* Sort */}
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          className="px-3 py-2 rounded-lg border text-sm outline-none"
          style={{ background: 'hsl(var(--input))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}>
          <option value="created_at">Date Created</option>
          <option value="click_count">Click Count</option>
          <option value="original_url">URL</option>
        </select>

        <button onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}
          className="p-2 rounded-lg border text-sm" style={{ borderColor: 'hsl(var(--border))', color: 'hsl(var(--muted-foreground))' }}>
          <SortDesc className={`w-4 h-4 transition-transform ${sortDir === 'asc' ? 'rotate-180' : ''}`} />
        </button>

        {selected.length > 0 && (
          <button onClick={handleBulkDelete} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/20 text-red-500 text-sm font-medium">
            <Trash2 className="w-4 h-4" /> Delete {selected.length}
          </button>
        )}
      </div>

      {/* URL Table */}
      <div className="glass rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="space-y-2 p-4">{Array(5).fill(0).map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
        ) : urls.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl btn-gradient flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <p className="font-bold mb-2" style={{ color: 'hsl(var(--foreground))' }}>No URLs found</p>
            <p className="text-sm mb-4" style={{ color: 'hsl(var(--muted-foreground))' }}>Create your first short URL to get started.</p>
            <Link to="/urls/create" className="btn-gradient text-white font-semibold px-5 py-2.5 rounded-xl inline-flex items-center gap-2 text-sm">
              <Plus className="w-4 h-4" /> Create URL
            </Link>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: 'hsl(var(--border))' }}>
            {urls.map((url, i) => (
              <motion.div key={url.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 p-4 hover:opacity-90 transition-opacity">
                {/* Select */}
                <input type="checkbox" checked={selected.includes(url.id)} onChange={() => toggleSelect(url.id)}
                  className="w-4 h-4 accent-indigo-500 rounded shrink-0" />

                {/* QR Thumbnail */}
                {url.qr_code_url ? (
                  <button
                    onClick={() => setQrModal(url)}
                    title="View QR Code"
                    className="shrink-0 w-10 h-10 rounded-lg overflow-hidden border hover:opacity-80 transition-opacity"
                    style={{ borderColor: 'hsl(var(--border))' }}
                  >
                    <img
                      src={url.qr_code_url.replace(/^https?:\/\/[^/]+/, '')}
                      alt="QR"
                      className="w-full h-full object-cover bg-white"
                    />
                  </button>
                ) : (
                  <div className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: 'hsl(var(--muted))', color: 'hsl(var(--muted-foreground))' }}>
                    <QrCode className="w-5 h-5" />
                  </div>
                )}

                {/* URL Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold" style={{ color: 'hsl(var(--primary))' }}>{url.short_url}</span>
                    {url.has_password && <Lock className="w-3 h-3 text-yellow-500" />}
                    {url.is_favorite && <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />}
                    <StatusBadge url={url} />
                  </div>
                  <p className="text-xs mt-0.5 truncate" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    {truncate(url.original_url, 60)}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
                      {formatNumber(url.click_count)} clicks
                    </span>
                    <span className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
                      {formatDate(url.created_at)}
                    </span>
                    {url.expires_at && (
                      <span className="text-xs text-orange-400">
                        Expires {formatDate(url.expires_at)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => handleCopy(url.short_url)} title="Copy" className="p-1.5 rounded-lg hover:opacity-70" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    <Copy className="w-4 h-4" />
                  </button>
                  <a href={url.original_url} target="_blank" rel="noopener noreferrer" title="Open" className="p-1.5 rounded-lg hover:opacity-70" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button onClick={() => favMutation.mutate(url.id)} title="Favorite" className={`p-1.5 rounded-lg hover:opacity-70 ${url.is_favorite ? 'text-yellow-400' : ''}`} style={!url.is_favorite ? { color: 'hsl(var(--muted-foreground))' } : {}}>
                    <Star className={`w-4 h-4 ${url.is_favorite ? 'fill-current' : ''}`} />
                  </button>
                  <button onClick={() => setQrModal(url)} title="View / Download QR" className="p-1.5 rounded-lg hover:opacity-70" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    <QrCode className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleMutation.mutate({ id: url.id, is_active: !url.is_active })}
                    title={url.is_active ? 'Deactivate' : 'Activate'}
                    className="p-1.5 rounded-lg hover:opacity-70"
                    style={{ color: url.is_active ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))' }}>
                    {url.is_active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                  </button>
                  <button onClick={() => { if (confirm('Delete this URL?')) deleteMutation.mutate(url.id) }} title="Delete" className="p-1.5 rounded-lg hover:opacity-70 text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t" style={{ borderColor: 'hsl(var(--border))' }}>
            <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
              Page {page} of {totalPages} ({total} total)
            </p>
            <div className="flex items-center gap-2">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                className="p-2 rounded-lg border disabled:opacity-40" style={{ borderColor: 'hsl(var(--border))' }}>
                <ChevronLeft className="w-4 h-4" style={{ color: 'hsl(var(--foreground))' }} />
              </button>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
                className="p-2 rounded-lg border disabled:opacity-40" style={{ borderColor: 'hsl(var(--border))' }}>
                <ChevronRight className="w-4 h-4" style={{ color: 'hsl(var(--foreground))' }} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
