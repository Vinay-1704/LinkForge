import { Search, Bell, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'

export default function Navbar({ title = 'Dashboard' }) {
  const { isDark, toggleTheme } = useTheme()
  const { user } = useAuth()

  return (
    <header
      className="h-16 flex items-center justify-between px-6 border-b"
      style={{ background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
    >
      <h1 className="text-lg font-bold" style={{ color: 'hsl(var(--foreground))' }}>{title}</h1>

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
          <div className="w-8 h-8 rounded-full btn-gradient flex items-center justify-center text-white font-bold text-sm cursor-pointer">
            {user.username?.[0]?.toUpperCase()}
          </div>
        )}
      </div>
    </header>
  )
}
