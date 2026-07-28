import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { User, Mail, Camera, Lock, Trash2, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { authService } from '@/services/auth.service'
import { formatDate } from '@/utils/helpers'
import { useNavigate } from 'react-router-dom'

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [showPw, setShowPw] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const profileForm = useForm({ defaultValues: { username: user?.username, email: user?.email } })
  const pwForm = useForm()

  const profileMutation = useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: (data) => { updateUser(data); toast.success('Profile updated!') },
    onError: (err) => toast.error(err?.response?.data?.detail || 'Failed to update profile'),
  })

  const pwMutation = useMutation({
    mutationFn: authService.changePassword,
    onSuccess: () => { toast.success('Password changed!'); pwForm.reset() },
    onError: (err) => toast.error(err?.response?.data?.detail || 'Failed to change password'),
  })

  const deleteMutation = useMutation({
    mutationFn: authService.deleteAccount,
    onSuccess: async () => {
      toast.info('Account deleted')
      await logout()
      navigate('/')
    },
    onError: () => toast.error('Failed to delete account'),
  })

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="text-2xl font-black" style={{ color: 'hsl(var(--foreground))' }}>Profile</h2>
        <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>Manage your account details.</p>
      </motion.div>

      {/* Avatar Section */}
      <div className="glass rounded-2xl p-6 flex items-center gap-5">
        <div className="w-20 h-20 rounded-2xl btn-gradient flex items-center justify-center text-white text-3xl font-black shrink-0">
          {user?.username?.[0]?.toUpperCase()}
        </div>
        <div>
          <h3 className="font-bold text-xl" style={{ color: 'hsl(var(--foreground))' }}>{user?.username}</h3>
          <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>{user?.email}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: 'hsl(var(--primary) / 0.15)', color: 'hsl(var(--primary))' }}>
              {user?.role}
            </span>
            <span className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
              Joined {formatDate(user?.created_at)}
            </span>
          </div>
        </div>
      </div>

      {/* Update Profile */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-bold text-lg mb-5" style={{ color: 'hsl(var(--foreground))' }}>Update Profile</h3>
        <form onSubmit={profileForm.handleSubmit((data) => profileMutation.mutate(data))} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'hsl(var(--foreground))' }}>Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(var(--muted-foreground))' }} />
              <input {...profileForm.register('username', { required: true, minLength: 3 })}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm outline-none"
                style={{ background: 'hsl(var(--input))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'hsl(var(--foreground))' }}>Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(var(--muted-foreground))' }} />
              <input {...profileForm.register('email', { required: true })} type="email"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm outline-none"
                style={{ background: 'hsl(var(--input))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }} />
            </div>
          </div>
          <button type="submit" disabled={profileMutation.isPending} className="btn-gradient text-white font-semibold px-6 py-2.5 rounded-xl disabled:opacity-60">
            {profileMutation.isPending ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-bold text-lg mb-5" style={{ color: 'hsl(var(--foreground))' }}>Change Password</h3>
        <form onSubmit={pwForm.handleSubmit((data) => pwMutation.mutate(data))} className="space-y-4">
          {[
            { name: 'current_password', label: 'Current Password', rules: { required: 'Required' } },
            { name: 'new_password', label: 'New Password', rules: { required: 'Required', minLength: { value: 8, message: 'Min 8 characters' } } },
          ].map(({ name, label, rules }) => (
            <div key={name}>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'hsl(var(--foreground))' }}>{label}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(var(--muted-foreground))' }} />
                <input {...pwForm.register(name, rules)} type={showPw ? 'text' : 'password'}
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border text-sm outline-none"
                  style={{ background: 'hsl(var(--input))', borderColor: pwForm.formState.errors[name] ? '#ef4444' : 'hsl(var(--border))', color: 'hsl(var(--foreground))' }} />
                <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'hsl(var(--muted-foreground))' }}>
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {pwForm.formState.errors[name] && <p className="text-red-500 text-xs mt-1">{pwForm.formState.errors[name].message}</p>}
            </div>
          ))}
          <button type="submit" disabled={pwMutation.isPending} className="btn-gradient text-white font-semibold px-6 py-2.5 rounded-xl disabled:opacity-60">
            {pwMutation.isPending ? 'Updating…' : 'Change Password'}
          </button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="rounded-2xl p-6 border-2 border-red-500/30" style={{ background: 'hsl(var(--card))' }}>
        <h3 className="font-bold text-lg mb-2 text-red-500">Danger Zone</h3>
        <p className="text-sm mb-4" style={{ color: 'hsl(var(--muted-foreground))' }}>
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        {!confirmDelete ? (
          <button onClick={() => setConfirmDelete(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-500 font-medium text-sm hover:bg-red-500/30 transition-colors">
            <Trash2 className="w-4 h-4" /> Delete Account
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <p className="text-sm text-red-400">Are you absolutely sure?</p>
            <button onClick={() => deleteMutation.mutate()} disabled={deleteMutation.isPending} className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium text-sm disabled:opacity-60">
              {deleteMutation.isPending ? 'Deleting…' : 'Yes, Delete'}
            </button>
            <button onClick={() => setConfirmDelete(false)} className="px-4 py-2 rounded-lg border text-sm font-medium" style={{ borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
