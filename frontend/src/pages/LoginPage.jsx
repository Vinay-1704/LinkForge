import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'

export default function LoginPage() {
  const { login } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await login(data)
      toast.success('Welcome back to LinkForge!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'hsl(var(--background))' }}>
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
      >
        {/* Card */}
        <div className="glass rounded-2xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl btn-gradient flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-2xl gradient-text">LinkForge</span>
          </div>

          <h1 className="text-2xl font-black mb-1" style={{ color: 'hsl(var(--foreground))' }}>Welcome back</h1>
          <p className="text-sm mb-8" style={{ color: 'hsl(var(--muted-foreground))' }}>
            Don't have an account? <Link to="/register" className="font-semibold" style={{ color: 'hsl(var(--primary))' }}>Sign up</Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'hsl(var(--foreground))' }}>Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(var(--muted-foreground))' }} />
                <input
                  {...register('email', { required: 'Email is required' })}
                  type="email"
                  placeholder="vinay@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm outline-none transition-all focus:ring-2"
                  style={{
                    background: 'hsl(var(--input))',
                    borderColor: errors.email ? '#ef4444' : 'hsl(var(--border))',
                    color: 'hsl(var(--foreground))',
                    '--tw-ring-color': 'hsl(var(--ring) / 0.4)',
                  }}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium" style={{ color: 'hsl(var(--foreground))' }}>Password</label>
                <Link to="/forgot-password" className="text-xs font-medium" style={{ color: 'hsl(var(--primary))' }}>Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(var(--muted-foreground))' }} />
                <input
                  {...register('password', { required: 'Password is required' })}
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border text-sm outline-none transition-all focus:ring-2"
                  style={{
                    background: 'hsl(var(--input))',
                    borderColor: errors.password ? '#ef4444' : 'hsl(var(--border))',
                    color: 'hsl(var(--foreground))',
                  }}
                />
                <button type="button" onClick={() => setShowPw(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70"
                  style={{ color: 'hsl(var(--muted-foreground))' }}>
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.password.message}</p>}
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input {...register('remember_me')} type="checkbox" className="w-4 h-4 rounded accent-indigo-500" />
              <span className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>Remember me</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gradient text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
