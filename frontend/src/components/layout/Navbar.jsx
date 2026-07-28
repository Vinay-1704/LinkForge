import { Menu, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'

export default function Navbar({ title = 'Dashboard', onOpenMobile }) {
  const { isDark, toggleTheme } = useTheme()
  const { user } = useAuth()

  return (
    <header
      className="h-16 flex items-center justify-between px-4 md:px-6 border-b shrink-0"
      style={{ background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
    >
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenMobile}
          className="p-2 rounded-lg md:hidden transition-all hover:opacity-70"
          style={{ background: 'hsl(var(--muted))', color: 'hsl(var(--foreground))' }}
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-base md:text-lg font-bold truncate" style={{ color: 'hsl(var(--foreground))' }}>
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg transition-all hover:opacity-70"
          style={{ background: 'hsl(var(--muted))', color: 'hsl(var(--foreground))' }}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Avatar */}
        {user && (
          <div className="w-8 h-8 rounded-full btn-gradient flex items-center justify-center text-white font-bold text-sm cursor-pointer shrink-0">
            {user.username?.[0]?.toUpperCase()}
          </div>
        )}
      </div>
    </header>
  )
}
