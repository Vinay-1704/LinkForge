import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '@/services/analytics.service'
import { motion } from 'framer-motion'
import { Users, Link2, MousePointerClick, Shield, UserX, Trash2, Search, ChevronLeft, ChevronRight, ToggleRight, ToggleLeft } from 'lucide-react'
import { useState } from 'react'
import { formatNumber, formatDate } from '@/utils/helpers'
import { useToast } from '@/context/ToastContext'

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="text-2xl font-black" style={{ color: 'hsl(var(--foreground))' }}>{formatNumber(value || 0)}</div>
      <div className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>{label}</div>
    </div>
  )
}

export default function AdminDashboardPage() {
  const { toast } = useToast()
  const qc = useQueryClient()
  const [userPage, setUserPage] = useState(1)
  const [userSearch, setUserSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [tab, setTab] = useState('users')

  const { data: dashData, isLoading: dashLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: adminService.getDashboard,
  })

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users', userPage, userSearch],
    queryFn: () => adminService.listUsers({ page: userPage, page_size: 15, search: userSearch || undefined }),
  })

  const { data: urlsData } = useQuery({
    queryKey: ['admin-urls'],
    queryFn: () => adminService.listUrls({ page: 1, page_size: 20 }),
  })

  const toggleUserMutation = useMutation({
    mutationFn: ({ id, is_active }) => adminService.updateUser(id, { is_active }),
    onSuccess: () => { toast.success('User status updated'); qc.invalidateQueries(['admin-users']) },
    onError: () => toast.error('Failed to update user'),
  })

  const deleteUserMutation = useMutation({
    mutationFn: adminService.deleteUser,
    onSuccess: () => { toast.success('User deleted'); qc.invalidateQueries(['admin-users', 'admin-dashboard']) },
    onError: () => toast.error('Failed to delete user'),
  })

  const deleteUrlMutation = useMutation({
    mutationFn: adminService.deleteUrl,
    onSuccess: () => { toast.success('URL removed'); qc.invalidateQueries(['admin-urls', 'admin-dashboard']) },
    onError: () => toast.error('Failed to delete URL'),
  })

  const stats = dashData?.stats
  const users = usersData?.items || []
  const urls = urlsData?.items || []

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="text-2xl font-black" style={{ color: 'hsl(var(--foreground))' }}>
          Admin Dashboard <span className="text-base font-normal text-indigo-500">⚡ Super Access</span>
        </h2>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard icon={Users} label="Total Users" value={stats?.total_users} color="btn-gradient" />
        <StatCard icon={Users} label="Active Users" value={stats?.active_users} color="bg-green-500" />
        <StatCard icon={UserX} label="Disabled" value={stats?.disabled_users} color="bg-red-500" />
        <StatCard icon={Link2} label="Total URLs" value={stats?.total_urls} color="bg-blue-500" />
        <StatCard icon={Link2} label="Today's URLs" value={stats?.today_urls} color="bg-purple-500" />
        <StatCard icon={MousePointerClick} label="Total Clicks" value={stats?.total_clicks} color="bg-orange-500" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {['users', 'urls'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${tab === t ? 'btn-gradient text-white' : 'border hover:opacity-80'}`}
            style={tab !== t ? { borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' } : {}}>
            {t === 'users' ? '👤 Users' : '🔗 URLs'}
          </button>
        ))}
      </div>

      {/* Users Table */}
      {tab === 'users' && (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="p-4 border-b flex items-center gap-3" style={{ borderColor: 'hsl(var(--border))' }}>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(var(--muted-foreground))' }} />
              <input value={searchInput} onChange={e => setSearchInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { setUserSearch(searchInput); setUserPage(1) } }}
                placeholder="Search users…" className="w-full pl-9 pr-4 py-2 rounded-lg border text-sm outline-none"
                style={{ background: 'hsl(var(--input))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }} />
            </div>
          </div>
          {usersLoading ? (
            <div className="space-y-2 p-4">{Array(5).fill(0).map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}</div>
          ) : (
            <div className="divide-y" style={{ borderColor: 'hsl(var(--border))' }}>
              {users.map(u => (
                <div key={u.id} className="flex items-center gap-4 p-4">
                  <div className="w-9 h-9 rounded-full btn-gradient flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {u.username?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm truncate" style={{ color: 'hsl(var(--foreground))' }}>{u.username}</p>
                      {u.role === 'admin' && <Shield className="w-3.5 h-3.5 text-indigo-500" />}
                      <span className={`px-2 py-0.5 rounded-full text-xs ${u.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {u.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                    <p className="text-xs truncate" style={{ color: 'hsl(var(--muted-foreground))' }}>
                      {u.email} · {u.url_count} URLs · {formatNumber(u.total_clicks)} clicks · Joined {u.created_at?.slice(0,10)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => toggleUserMutation.mutate({ id: u.id, is_active: !u.is_active })}
                      title={u.is_active ? 'Disable' : 'Enable'}
                      className="p-1.5 rounded-lg hover:opacity-70" style={{ color: u.is_active ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))' }}>
                      {u.is_active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    </button>
                    <button onClick={() => { if (confirm(`Delete user ${u.username}?`)) deleteUserMutation.mutate(u.id) }}
                      className="p-1.5 rounded-lg hover:opacity-70 text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {usersData?.total_pages > 1 && (
            <div className="flex items-center justify-between p-4 border-t" style={{ borderColor: 'hsl(var(--border))' }}>
              <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>Page {userPage} of {usersData.total_pages}</p>
              <div className="flex gap-2">
                <button disabled={userPage <= 1} onClick={() => setUserPage(p => p - 1)} className="p-2 rounded-lg border disabled:opacity-40" style={{ borderColor: 'hsl(var(--border))' }}><ChevronLeft className="w-4 h-4" style={{ color: 'hsl(var(--foreground))' }} /></button>
                <button disabled={userPage >= usersData.total_pages} onClick={() => setUserPage(p => p + 1)} className="p-2 rounded-lg border disabled:opacity-40" style={{ borderColor: 'hsl(var(--border))' }}><ChevronRight className="w-4 h-4" style={{ color: 'hsl(var(--foreground))' }} /></button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* URLs Moderation */}
      {tab === 'urls' && (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="divide-y" style={{ borderColor: 'hsl(var(--border))' }}>
            {urls.map(url => (
              <div key={url.id} className="flex items-center gap-3 p-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: 'hsl(var(--primary))' }}>{url.short_url || url.short_code}</p>
                  <p className="text-xs truncate" style={{ color: 'hsl(var(--muted-foreground))' }}>{url.original_url}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    {formatNumber(url.click_count)} clicks
                  </p>
                </div>
                <button onClick={() => { if (confirm('Delete this URL?')) deleteUrlMutation.mutate(url.id) }}
                  className="p-1.5 rounded-lg text-red-500 hover:opacity-70">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {urls.length === 0 && (
              <p className="text-center py-12" style={{ color: 'hsl(var(--muted-foreground))' }}>No URLs on the platform yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
