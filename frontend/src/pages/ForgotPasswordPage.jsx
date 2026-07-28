import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import { authService } from '@/services/auth.service'

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async ({ email }) => {
    setLoading(true)
    try {
      await authService.forgotPassword(email)
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'hsl(var(--background))' }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="glass rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl btn-gradient flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-2xl gradient-text">LinkForge</span>
          </div>

          {sent ? (
            <div className="text-center py-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2" style={{ color: 'hsl(var(--foreground))' }}>Check your email</h2>
              <p className="text-sm mb-6" style={{ color: 'hsl(var(--muted-foreground))' }}>
                If that email address is in our database, we will send you an email to reset your password.
              </p>
              <Link to="/login" className="btn-gradient text-white font-semibold px-6 py-2.5 rounded-xl inline-block">
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-black mb-1" style={{ color: 'hsl(var(--foreground))' }}>Forgot password?</h1>
              <p className="text-sm mb-8" style={{ color: 'hsl(var(--muted-foreground))' }}>
                Enter your email and we'll send you a reset link.
              </p>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'hsl(var(--foreground))' }}>Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(var(--muted-foreground))' }} />
                    <input {...register('email', { required: 'Email is required' })} type="email" placeholder="vinay@gmail.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm outline-none"
                      style={{ background: 'hsl(var(--input))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }} />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <button type="submit" disabled={loading} className="w-full btn-gradient text-white font-semibold py-3 rounded-xl disabled:opacity-60">
                  {loading ? 'Sending…' : 'Send Reset Link'}
                </button>
              </form>
              <Link to="/login" className="flex items-center gap-1.5 text-sm mt-6 hover:opacity-70 transition-opacity" style={{ color: 'hsl(var(--muted-foreground))' }}>
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
