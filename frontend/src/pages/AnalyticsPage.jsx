import { useQuery } from '@tanstack/react-query'
import { analyticsService } from '@/services/analytics.service'
import { motion } from 'framer-motion'
import { MousePointerClick, TrendingUp, Globe, Monitor, BarChart3 } from 'lucide-react'
import { formatNumber } from '@/utils/helpers'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend, AreaChart, Area,
} from 'recharts'

const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#14b8a6', '#f59e0b', '#ef4444', '#10b981']

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="text-2xl font-black" style={{ color: 'hsl(var(--foreground))' }}>{formatNumber(value || 0)}</div>
      <div className="text-sm mt-0.5" style={{ color: 'hsl(var(--muted-foreground))' }}>{label}</div>
    </div>
  )
}

function ChartCard({ title, children }) {
  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="font-bold text-lg mb-5" style={{ color: 'hsl(var(--foreground))' }}>{title}</h3>
      {children}
    </div>
  )
}

function DistributionTable({ data = [], limit = 8 }) {
  const shown = data.slice(0, limit)
  return (
    <div className="space-y-2">
      {shown.map(({ name, value, percentage }) => (
        <div key={name} className="flex items-center gap-3">
          <div className="text-sm font-medium w-24 truncate" style={{ color: 'hsl(var(--foreground))' }}>{name}</div>
          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'hsl(var(--muted))' }}>
            <div className="h-full rounded-full" style={{ width: `${percentage}%`, background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }} />
          </div>
          <div className="text-sm text-right w-16" style={{ color: 'hsl(var(--muted-foreground))' }}>
            {formatNumber(value)} <span className="text-xs">({percentage}%)</span>
          </div>
        </div>
      ))}
    </div>
  )
}

const tooltipStyle = {
  contentStyle: {
    background: 'hsl(222 47% 9%)',
    border: '1px solid hsl(217 33% 17%)',
    borderRadius: '0.75rem',
  },
  labelStyle: { color: '#a1a1aa' },
}

export default function AnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: analyticsService.getUserAnalytics,
  })

  if (isLoading) return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Array(5).fill(0).map((_, i) => <div key={i} className="skeleton rounded-2xl h-28" />)}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {Array(4).fill(0).map((_, i) => <div key={i} className="skeleton rounded-2xl h-64" />)}
      </div>
    </div>
  )

  const daily = data?.daily_clicks || []
  const monthly = data?.monthly_clicks || []
  const browsers = data?.browser_distribution || []
  const devices = data?.device_distribution || []
  const countries = data?.top_countries || []
  const referrers = data?.top_referrers || []

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="text-2xl font-black" style={{ color: 'hsl(var(--foreground))' }}>Analytics</h2>
        <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>Track your link performance.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        <StatCard icon={MousePointerClick} label="Total Clicks" value={data?.total_clicks} color="btn-gradient" />
        <StatCard icon={TrendingUp} label="Today" value={data?.today_clicks} color="bg-emerald-500" />
        <StatCard icon={BarChart3} label="This Week" value={data?.this_week_clicks} color="bg-blue-500" />
        <StatCard icon={BarChart3} label="This Month" value={data?.this_month_clicks} color="bg-purple-500" />
        <StatCard icon={Globe} label="Countries" value={countries.length} color="bg-orange-500" />
      </div>

      {/* Charts row 1 */}
      <div className="grid md:grid-cols-2 gap-6">
        <ChartCard title="Daily Clicks (30 Days)">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={daily}>
              <defs>
                <linearGradient id="clicksGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 17%)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#71717a' }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#71717a' }} tickLine={false} axisLine={false} />
              <Tooltip {...tooltipStyle} />
              <Area type="monotone" dataKey="clicks" stroke="#6366f1" strokeWidth={2} fill="url(#clicksGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Monthly Clicks">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 17%)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#71717a' }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#71717a' }} tickLine={false} axisLine={false} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="clicks" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div className="grid md:grid-cols-2 gap-6">
        <ChartCard title="Browser Distribution">
          {browsers.length > 0 ? (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={180}>
                <PieChart>
                  <Pie data={browsers} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80}>
                    {browsers.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip {...tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1"><DistributionTable data={browsers} /></div>
            </div>
          ) : <p className="text-center py-10" style={{ color: 'hsl(var(--muted-foreground))' }}>No data yet</p>}
        </ChartCard>

        <ChartCard title="Device Distribution">
          {devices.length > 0 ? (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={180}>
                <PieChart>
                  <Pie data={devices} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80}>
                    {devices.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip {...tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1"><DistributionTable data={devices} /></div>
            </div>
          ) : <p className="text-center py-10" style={{ color: 'hsl(var(--muted-foreground))' }}>No data yet</p>}
        </ChartCard>
      </div>

      {/* Top Countries + Referrers */}
      <div className="grid md:grid-cols-2 gap-6">
        <ChartCard title="Top Countries">
          <DistributionTable data={countries} />
          {countries.length === 0 && <p className="text-center py-8" style={{ color: 'hsl(var(--muted-foreground))' }}>No geo data yet</p>}
        </ChartCard>
        <ChartCard title="Top Referrers">
          <DistributionTable data={referrers} />
          {referrers.length === 0 && <p className="text-center py-8" style={{ color: 'hsl(var(--muted-foreground))' }}>No referrer data yet</p>}
        </ChartCard>
      </div>
    </div>
  )
}
