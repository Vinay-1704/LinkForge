import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'

export default function RegisterPage() {
  const { register: registerUser } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const pw = watch('password', '')

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await registerUser({ username: data.username, email: data.email, password: data.password })
      toast.success('Account created! Welcome to LinkForge.')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const Field = ({ name, label, type = 'text', icon: Icon, placeholder, rules, extra }) => (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: 'hsl(var(--foreground))' }}>{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(var(--muted-foreground))' }} />}
        <input
          {...register(name, rules)}
          type={type}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm outline-none transition-all"
          style={{
            background: 'hsl(var(--input))',
            borderColor: errors[name] ? '#ef4444' : 'hsl(var(--border))',
            color: 'hsl(var(--foreground))',
            paddingRight: extra ? '2.5rem' : undefined,
          }}
        />
        {extra}
      </div>
      {errors[name] && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors[name].message}</p>}
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'hsl(var(--background))' }}>
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
        <div className="glass rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl btn-gradient flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-2xl gradient-text">LinkForge</span>
          </div>

          <h1 className="text-2xl font-black mb-1" style={{ color: 'hsl(var(--foreground))' }}>Create account</h1>
          <p className="text-sm mb-8" style={{ color: 'hsl(var(--muted-foreground))' }}>
            Already have an account? <Link to="/login" className="font-semibold" style={{ color: 'hsl(var(--primary))' }}>Sign in</Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Field name="username" label="Username" icon={User} placeholder="johndoe"
              rules={{
                required: 'Username is required',
                minLength: { value: 3, message: 'Min 3 characters' },
                pattern: { value: /^[a-zA-Z0-9_]+$/, message: 'Letters, numbers, underscores only' },
              }} />

            <Field name="email" label="Email" type="email" icon={Mail} placeholder="you@example.com"
              rules={{ required: 'Email is required' }} />

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'hsl(var(--foreground))' }}>Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(var(--muted-foreground))' }} />
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Minimum 8 characters' },
                    validate: {
                      hasUpper: v => /[A-Z]/.test(v) || 'Must contain uppercase letter',
                      hasLower: v => /[a-z]/.test(v) || 'Must contain lowercase letter',
                      hasDigit: v => /\d/.test(v) || 'Must contain a digit',
                    },
                  })}
                  type={showPw ? 'text' : 'password'}
                  placeholder="Min 8 chars, upper, lower, digit"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border text-sm outline-none"
                  style={{ background: 'hsl(var(--input))', borderColor: errors.password ? '#ef4444' : 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                />
                <button type="button" onClick={() => setShowPw(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'hsl(var(--muted-foreground))' }}>
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.password.message}</p>}
            </div>

            <Field name="confirm" label="Confirm Password" type="password" icon={Lock} placeholder="Re-enter password"
              rules={{
                required: 'Please confirm password',
                validate: v => v === pw || 'Passwords do not match',
              }} />

            <button type="submit" disabled={loading}
              className="w-full btn-gradient text-white font-semibold py-3 rounded-xl disabled:opacity-60">
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-xs text-center mt-6" style={{ color: 'hsl(var(--muted-foreground))' }}>
            By registering, you agree to our <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
