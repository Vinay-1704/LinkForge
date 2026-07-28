import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '@/services/analytics.service'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Link2, MousePointerClick, Activity, Clock, QrCode, TrendingUp,
  Star, Plus, ExternalLink, Copy, Zap,
} from 'lucide-react'
import { formatNumber, formatDate, truncate, copyToClipboard } from '@/utils/helpers'
import { useToast } from '@/context/ToastContext'
import { useAuth } from '@/context/AuthContext'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area,
} from 'recharts'

function StatCard({ icon: Icon, label, value, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="glass rounded-2xl p-5 card-hover"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="text-2xl font-black mb-0.5" style={{ color: 'hsl(var(--foreground))' }}>
        {typeof value === 'number' ? formatNumber(value) : value}
      </div>
      <div className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>{label}</div>
    </motion.div>
  )
}

function SkeletonCard() {
  return <div className="skeleton rounded-2xl h-32" />
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { toast } = useToast()

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardService.getDashboard,
  })

  const stats = data?.stats
  const recentUrls = data?.recent_urls || []
  const mostPopular = data?.most_popular

  const handleCopy = async (url) => {
    await copyToClipboard(url)
    toast.success('Copied to clipboard!')
  }

  const statCards = stats ? [
    { icon: Link2, label: 'Total URLs', value: stats.total_urls, color: 'btn-gradient' },
    { icon: MousePointerClick, label: 'Total Clicks', value: stats.total_clicks, color: 'bg-emerald-500' },
    { icon: Activity, label: 'Active Links', value: stats.active_links, color: 'bg-blue-500' },
    { icon: Clock, label: 'Expired Links', value: stats.expired_links, color: 'bg-orange-500' },
    { icon: QrCode, label: 'QR Codes', value: stats.qr_codes_generated, color: 'bg-purple-500' },
    { icon: TrendingUp, label: 'Avg Daily Clicks', value: stats.avg_daily_clicks, color: 'bg-pink-500' },
  ] : []

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="text-2xl font-black" style={{ color: 'hsl(var(--foreground))' }}>
          Welcome back, <span className="gradient-text">{user?.username}</span> 👋
        </h2>
        <p className="text-sm mt-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
          Here's what's happening with your links today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {isLoading
          ? Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
          : statCards.map((card, i) => <StatCard key={card.label} {...card} delay={i * 0.05} />)
        }
      </div>

      {/* Quick Create + Most Popular */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Quick Create */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ color: 'hsl(var(--foreground))' }}>
            <Zap className="w-5 h-5 text-indigo-500" /> Quick Create
          </h3>
          <p className="text-sm mb-4" style={{ color: 'hsl(var(--muted-foreground))' }}>
            Shorten a new URL in seconds.
          </p>
          <Link to="/urls/create"
            className="btn-gradient text-white font-semibold px-5 py-2.5 rounded-xl inline-flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Create New URL
          </Link>
        </motion.div>

        {/* Most Popular */}
        {mostPopular && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}
            className="glass rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ color: 'hsl(var(--foreground))' }}>
              <Star className="w-5 h-5 text-yellow-500" /> Most Popular
            </h3>
            <p className="text-sm font-semibold truncate mb-1" style={{ color: 'hsl(var(--foreground))' }}>
              {mostPopular.short_url}
            </p>
            <p className="text-xs mb-3 truncate" style={{ color: 'hsl(var(--muted-foreground))' }}>
              {truncate(mostPopular.original_url, 60)}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-indigo-500">{formatNumber(mostPopular.click_count)} clicks</span>
              <button onClick={() => handleCopy(mostPopular.short_url)}
                className="p-1.5 rounded-lg hover:opacity-70" style={{ color: 'hsl(var(--muted-foreground))' }}>
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Recent URLs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-lg" style={{ color: 'hsl(var(--foreground))' }}>Recent URLs</h3>
          <Link to="/urls" className="text-sm font-medium hover:opacity-70" style={{ color: 'hsl(var(--primary))' }}>
            View all →
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">{Array(3).fill(0).map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}</div>
        ) : recentUrls.length === 0 ? (
          <div className="text-center py-12">
            <Link2 className="w-12 h-12 mx-auto mb-3 opacity-20" style={{ color: 'hsl(var(--muted-foreground))' }} />
            <p style={{ color: 'hsl(var(--muted-foreground))' }}>No URLs yet. <Link to="/urls/create" className="font-semibold" style={{ color: 'hsl(var(--primary))' }}>Create one!</Link></p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentUrls.map((url) => (
              <div key={url.id} className="flex items-center gap-4 p-3 rounded-xl transition-colors hover:opacity-80"
                style={{ background: 'hsl(var(--muted))' }}>
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0">
                  <Link2 className="w-4 h-4 text-indigo-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: 'hsl(var(--foreground))' }}>
                    {url.short_url}
                  </p>
                  <p className="text-xs truncate" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    {truncate(url.original_url, 60)}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-medium" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    {formatNumber(url.click_count)} clicks
                  </span>
                  <button onClick={() => handleCopy(url.short_url)} className="p-1.5 rounded hover:opacity-70" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <a href={url.original_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded hover:opacity-70" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
