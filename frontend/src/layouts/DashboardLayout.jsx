import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '@/components/layout/Sidebar'
import Navbar from '@/components/layout/Navbar'
import { motion } from 'framer-motion'

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/urls': 'My URLs',
  '/analytics': 'Analytics',
  '/favorites': 'Favorites',
  '/profile': 'Profile',
  '/settings': 'Settings',
  '/admin': 'Admin Dashboard',
  '/urls/create': 'Create URL',
}

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const title = PAGE_TITLES[location.pathname] || 'LinkForge'

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'hsl(var(--background))' }}>
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar title={title} onOpenMobile={() => setMobileOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}
