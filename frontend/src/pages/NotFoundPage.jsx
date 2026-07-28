import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft, Link2 } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'hsl(var(--background))' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
        <div className="text-8xl font-black gradient-text mb-4">404</div>
        <div className="w-20 h-20 rounded-2xl btn-gradient flex items-center justify-center mx-auto mb-6">
          <Link2 className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-black mb-3" style={{ color: 'hsl(var(--foreground))' }}>Link Not Found</h1>
        <p className="mb-8" style={{ color: 'hsl(var(--muted-foreground))' }}>
          This short link doesn't exist, or has been removed.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/" className="btn-gradient text-white font-semibold px-6 py-3 rounded-xl inline-flex items-center gap-2">
            <Home className="w-4 h-4" /> Go Home
          </Link>
          <button onClick={() => window.history.back()}
            className="px-6 py-3 rounded-xl border font-semibold inline-flex items-center gap-2"
            style={{ borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}>
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>
      </motion.div>
    </div>
  )
}
