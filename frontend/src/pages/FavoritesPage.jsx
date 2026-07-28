import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { urlService } from '@/services/url.service'
import { Star, Copy, ExternalLink, Trash2, Link2, QrCode } from 'lucide-react'
import { formatNumber, formatDate, truncate, copyToClipboard } from '@/utils/helpers'
import { useToast } from '@/context/ToastContext'
import { Link } from 'react-router-dom'

export default function FavoritesPage() {
  const { toast } = useToast()
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['urls', 'favorites'],
    queryFn: () => urlService.list({ is_favorite: true, page_size: 100 }),
  })

  const favMutation = useMutation({
    mutationFn: urlService.toggleFavorite,
    onSuccess: () => qc.invalidateQueries(['urls']),
  })

  const favorites = data?.items || []

  const handleCopy = async (url) => {
    await copyToClipboard(url)
    toast.success('Copied!')
  }

  const handleDownloadQr = async (url) => {
    try {
      const blob = await urlService.getQrPng(url.id)
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `qr-${url.short_code}.png`
      link.click()
    } catch {
      toast.error('Failed to download QR')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black" style={{ color: 'hsl(var(--foreground))' }}>Favorites</h2>
        <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
          Your starred links for quick access.
        </p>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => <div key={i} className="skeleton rounded-2xl h-40" />)}
        </div>
      ) : favorites.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-center py-20 glass rounded-2xl">
          <Star className="w-16 h-16 mx-auto mb-4 opacity-20" style={{ color: 'hsl(var(--muted-foreground))' }} />
          <p className="font-bold text-lg mb-2" style={{ color: 'hsl(var(--foreground))' }}>No favorites yet</p>
          <p className="text-sm mb-6" style={{ color: 'hsl(var(--muted-foreground))' }}>
            Star any URL from the My URLs page to see it here.
          </p>
          <Link to="/urls" className="btn-gradient text-white font-semibold px-5 py-2.5 rounded-xl inline-block text-sm">
            Browse My URLs
          </Link>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((url, i) => (
            <motion.div key={url.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-5 card-hover">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                </div>
                <button onClick={() => favMutation.mutate(url.id)} className="p-1.5 rounded-lg hover:opacity-70 text-yellow-400">
                  <Star className="w-4 h-4 fill-current" />
                </button>
              </div>

              <p className="text-sm font-bold mb-1 truncate" style={{ color: 'hsl(var(--primary))' }}>{url.short_url}</p>
              <p className="text-xs mb-3 truncate" style={{ color: 'hsl(var(--muted-foreground))' }}>
                {truncate(url.original_url, 50)}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium" style={{ color: 'hsl(var(--muted-foreground))' }}>
                  {formatNumber(url.click_count)} clicks · {formatDate(url.created_at)}
                </span>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleCopy(url.short_url)} className="p-1.5 rounded hover:opacity-70" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <a href={url.original_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded hover:opacity-70" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button onClick={() => handleDownloadQr(url)} className="p-1.5 rounded hover:opacity-70" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    <QrCode className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
