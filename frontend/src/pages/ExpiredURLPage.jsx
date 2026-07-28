import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, Home, Zap } from 'lucide-react'

export default function ExpiredURLPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'hsl(var(--background))' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
        <div className="w-24 h-24 rounded-3xl bg-orange-500/20 flex items-center justify-center mx-auto mb-6">
          <Clock className="w-12 h-12 text-orange-400" />
        </div>
        <h1 className="text-3xl font-black mb-3" style={{ color: 'hsl(var(--foreground))' }}>Link Expired</h1>
        <p className="mb-8 leading-relaxed" style={{ color: 'hsl(var(--muted-foreground))' }}>
          This short link has expired and is no longer active.
          The original creator may have set an expiration date.
        </p>
        <div className="glass rounded-2xl p-6 mb-8 text-left">
          <p className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'hsl(var(--foreground))' }}>
            <Zap className="w-4 h-4 text-indigo-500" /> Create your own short link
          </p>
          <p className="text-sm mb-4" style={{ color: 'hsl(var(--muted-foreground))' }}>
            With LinkForge, you can create short links with or without expiration dates.
          </p>
          <Link to="/register" className="btn-gradient text-white font-semibold px-5 py-2.5 rounded-xl inline-block text-sm">
            Get Started Free
          </Link>
        </div>
        <Link to="/" className="flex items-center justify-center gap-2 text-sm hover:opacity-70 transition-opacity" style={{ color: 'hsl(var(--muted-foreground))' }}>
          <Home className="w-4 h-4" /> Back to Home
        </Link>
      </motion.div>
    </div>
  )
}
