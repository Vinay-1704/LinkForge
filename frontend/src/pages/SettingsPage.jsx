import { useTheme } from '@/context/ThemeContext'
import { Sun, Moon, Bell, Shield, Database, Globe } from 'lucide-react'
import { motion } from 'framer-motion'

function SettingRow({ icon: Icon, title, description, children }) {
  return (
    <div className="flex items-center justify-between py-5 border-b last:border-0" style={{ borderColor: 'hsl(var(--border))' }}>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl btn-gradient flex items-center justify-center">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-semibold text-sm" style={{ color: 'hsl(var(--foreground))' }}>{title}</p>
          <p className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>{description}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-6 rounded-full transition-colors ${checked ? 'bg-indigo-500' : 'bg-gray-600'}`}
    >
      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-0.5'}`} />
    </button>
  )
}

export default function SettingsPage() {
  const { theme, toggleTheme, isDark } = useTheme()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="text-2xl font-black" style={{ color: 'hsl(var(--foreground))' }}>Settings</h2>
        <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>Customize your LinkForge experience.</p>
      </motion.div>

      {/* Appearance */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-bold mb-4" style={{ color: 'hsl(var(--foreground))' }}>Appearance</h3>
        <SettingRow icon={isDark ? Moon : Sun} title="Dark Mode" description="Toggle between dark and light theme">
          <Toggle checked={isDark} onChange={toggleTheme} />
        </SettingRow>
      </div>

      {/* Notifications */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-bold mb-4" style={{ color: 'hsl(var(--foreground))' }}>Notifications</h3>
        <SettingRow icon={Bell} title="Email Notifications" description="Receive email alerts for important events">
          <Toggle checked={false} onChange={() => {}} />
        </SettingRow>
        <SettingRow icon={Globe} title="Weekly Analytics Report" description="Get a weekly summary of your link performance">
          <Toggle checked={false} onChange={() => {}} />
        </SettingRow>
      </div>

      {/* Privacy */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-bold mb-4" style={{ color: 'hsl(var(--foreground))' }}>Privacy & Security</h3>
        <SettingRow icon={Shield} title="Two-Factor Authentication" description="Add an extra layer of security (coming soon)">
          <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 font-medium">Soon</span>
        </SettingRow>
        <SettingRow icon={Database} title="Data Export" description="Download all your data as CSV">
          <button className="px-4 py-2 rounded-lg text-sm font-medium border hover:opacity-80 transition-opacity"
            style={{ borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}>
            Export
          </button>
        </SettingRow>
      </div>

      {/* About */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-bold mb-4" style={{ color: 'hsl(var(--foreground))' }}>About</h3>
        <div className="space-y-2 text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
          <div className="flex justify-between"><span>Version</span><span className="font-mono">1.0.0</span></div>
          <div className="flex justify-between"><span>App</span><span className="font-semibold gradient-text">LinkForge</span></div>
          <div className="flex justify-between"><span>Built with</span><span>React + FastAPI</span></div>
        </div>
      </div>
    </div>
  )
}
