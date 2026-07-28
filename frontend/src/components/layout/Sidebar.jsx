import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Link2, BarChart2, Star, User, Settings,
  Shield, LogOut, ChevronLeft, Zap, Menu, X,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/urls', icon: Link2, label: 'My URLs' },
  { to: '/analytics', icon: BarChart2, label: 'Analytics' },
  { to: '/favorites', icon: Star, label: 'Favorites' },
  { to: '/profile', icon: User, label: 'Profile' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const closeMobile = () => setMobileOpen(false)

  return (
    <>
      {/* ── Mobile Overlay & Drawer ────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 md:hidden backdrop-blur-sm"
              onClick={closeMobile}
            />

            {/* Mobile Sidebar Content */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed inset-y-0 left-0 z-50 w-72 flex flex-col md:hidden border-r shadow-2xl"
              style={{
                background: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
              }}
            >
              {/* Logo & Close Button */}
              <div className="flex items-center justify-between px-4 py-5 border-b" style={{ borderColor: 'hsl(var(--border))' }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg btn-gradient flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-lg gradient-text">LinkForge</span>
                </div>
                <button
                  onClick={closeMobile}
                  className="p-1.5 rounded-lg hover:opacity-70"
                  style={{ color: 'hsl(var(--muted-foreground))' }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {navItems.map(({ to, icon: Icon, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={closeMobile}
                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{label}</span>
                  </NavLink>
                ))}

                {user?.role === 'admin' && (
                  <NavLink
                    to="/admin"
                    onClick={closeMobile}
                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                  >
                    <Shield className="w-4 h-4 shrink-0" />
                    <span>Admin</span>
                  </NavLink>
                )}
              </nav>

              {/* User + Logout */}
              <div className="border-t p-3" style={{ borderColor: 'hsl(var(--border))' }}>
                {user && (
                  <div className="flex items-center gap-3 px-2 py-2 mb-2 rounded-lg" style={{ background: 'hsl(var(--muted))' }}>
                    <div className="w-8 h-8 rounded-full btn-gradient flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {user.username?.[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: 'hsl(var(--foreground))' }}>{user.username}</p>
                      <p className="text-xs truncate" style={{ color: 'hsl(var(--muted-foreground))' }}>{user.email}</p>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => { closeMobile(); handleLogout(); }}
                  className="sidebar-link w-full text-red-500 hover:text-red-600"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Desktop Sidebar ─────────────────────────────────────────────────── */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden md:flex relative h-screen flex-col overflow-hidden border-r shrink-0"
        style={{
          background: 'hsl(var(--card))',
          borderColor: 'hsl(var(--border))',
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-5 border-b" style={{ borderColor: 'hsl(var(--border))' }}>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-lg btn-gradient flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-lg gradient-text">LinkForge</span>
              </motion.div>
            )}
          </AnimatePresence>
          {collapsed && (
            <div className="w-8 h-8 rounded-lg btn-gradient flex items-center justify-center mx-auto">
              <Zap className="w-4 h-4 text-white" />
            </div>
          )}
          <button
            onClick={() => setCollapsed(c => !c)}
            className="p-1.5 rounded-lg transition-colors hover:opacity-70"
            style={{ color: 'hsl(var(--muted-foreground))' }}
          >
            {collapsed ? <Menu className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              title={collapsed ? label : undefined}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="truncate"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}

          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              title={collapsed ? 'Admin' : undefined}
            >
              <Shield className="w-4 h-4 shrink-0" />
              {!collapsed && <span>Admin</span>}
            </NavLink>
          )}
        </nav>

        {/* User + Logout */}
        <div className="border-t p-3" style={{ borderColor: 'hsl(var(--border))' }}>
          {!collapsed && user && (
            <div className="flex items-center gap-3 px-2 py-2 mb-2 rounded-lg" style={{ background: 'hsl(var(--muted))' }}>
              <div className="w-8 h-8 rounded-full btn-gradient flex items-center justify-center text-white font-bold text-sm shrink-0">
                {user.username?.[0]?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: 'hsl(var(--foreground))' }}>{user.username}</p>
                <p className="text-xs truncate" style={{ color: 'hsl(var(--muted-foreground))' }}>{user.email}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="sidebar-link w-full text-red-500 hover:text-red-600"
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>
    </>
  )
}
