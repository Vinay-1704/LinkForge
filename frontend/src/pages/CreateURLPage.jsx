import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Link2, Tag, Clock, Lock, AlignLeft, FolderOpen, Plus, X } from 'lucide-react'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { urlService } from '@/services/url.service'
import { useToast } from '@/context/ToastContext'

export default function CreateURLPage() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { is_active: true },
  })

  const mutation = useMutation({
    mutationFn: urlService.create,
    onSuccess: () => {
      toast.success('URL shortened successfully!')
      qc.invalidateQueries(['dashboard'])
      qc.invalidateQueries(['urls'])
      navigate('/urls')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.detail || 'Failed to create URL')
    },
  })

  const addTag = () => {
    const t = tagInput.trim()
    if (t && !tags.includes(t) && tags.length < 10) {
      setTags(prev => [...prev, t])
      setTagInput('')
    }
  }

  const onSubmit = (data) => {
    mutation.mutate({
      original_url: data.original_url,
      custom_alias: data.custom_alias || undefined,
      description: data.description || undefined,
      category: data.category || undefined,
      password: data.password || undefined,
      expires_at: data.expires_at || undefined,
      tags,
    })
  }

  const InputWrapper = ({ label, icon: Icon, error, children }) => (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: 'hsl(var(--foreground))' }}>
        {label}
      </label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 z-10" style={{ color: 'hsl(var(--muted-foreground))' }} />}
        {children}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )

  const inputClass = (hasIcon = true) =>
    `w-full ${hasIcon ? 'pl-10' : 'pl-3'} pr-4 py-2.5 rounded-lg border text-sm outline-none transition-all`

  const inputStyle = (hasError) => ({
    background: 'hsl(var(--input))',
    borderColor: hasError ? '#ef4444' : 'hsl(var(--border))',
    color: 'hsl(var(--foreground))',
  })

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-black mb-1" style={{ color: 'hsl(var(--foreground))' }}>Create Short URL</h2>
        <p className="text-sm mb-8" style={{ color: 'hsl(var(--muted-foreground))' }}>
          Fill in the details to generate your shortened link.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="glass rounded-2xl p-6 space-y-5">
          {/* Original URL */}
          <InputWrapper label="Original URL *" icon={Link2} error={errors.original_url?.message}>
            <input
              {...register('original_url', {
                required: 'URL is required',
                pattern: { value: /^https?:\/\/.+/, message: 'Must start with http:// or https://' },
              })}
              type="url"
              placeholder="https://example.com/very-long-url"
              className={inputClass()}
              style={inputStyle(!!errors.original_url)}
            />
          </InputWrapper>

          {/* Custom Alias */}
          <InputWrapper label="Custom Alias (optional)" icon={Link2} error={errors.custom_alias?.message}>
            <div className="flex items-center">
              <span className="absolute left-3 text-xs font-mono z-10" style={{ color: 'hsl(var(--muted-foreground))', top: '50%', transform: 'translateY(-50%)', left: '12px' }}>lf/</span>
              <input
                {...register('custom_alias', {
                  minLength: { value: 3, message: 'Min 3 characters' },
                  maxLength: { value: 50, message: 'Max 50 characters' },
                  pattern: { value: /^[a-zA-Z0-9_-]*$/, message: 'Letters, numbers, hyphens only' },
                })}
                placeholder="my-custom-link"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm outline-none"
                style={inputStyle(!!errors.custom_alias)}
              />
            </div>
          </InputWrapper>

          {/* Description */}
          <InputWrapper label="Description (optional)" icon={AlignLeft}>
            <textarea
              {...register('description')}
              rows={2}
              placeholder="What is this link for?"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm outline-none resize-none"
              style={inputStyle(false)}
            />
          </InputWrapper>

          {/* Category */}
          <InputWrapper label="Category (optional)" icon={FolderOpen}>
            <input
              {...register('category')}
              placeholder="Marketing, Social, Work…"
              className={inputClass()}
              style={inputStyle(false)}
            />
          </InputWrapper>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'hsl(var(--foreground))' }}>
              Tags (optional)
            </label>
            <div className="flex items-center gap-2 mb-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(var(--muted-foreground))' }} />
                <input
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Add tag and press Enter"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm outline-none"
                  style={inputStyle(false)}
                />
              </div>
              <button type="button" onClick={addTag} className="p-2.5 rounded-lg btn-gradient text-white">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
                    style={{ background: 'hsl(var(--primary) / 0.15)', color: 'hsl(var(--primary))' }}>
                    {tag}
                    <button type="button" onClick={() => setTags(prev => prev.filter(t => t !== tag))} className="hover:opacity-70">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Expiration + Password row */}
          <div className="grid grid-cols-2 gap-4">
            <InputWrapper label="Expiration (optional)" icon={Clock}>
              <input
                {...register('expires_at')}
                type="datetime-local"
                className={inputClass()}
                style={inputStyle(false)}
              />
            </InputWrapper>
            <InputWrapper label="Password (optional)" icon={Lock}>
              <input
                {...register('password')}
                type="password"
                placeholder="Protect with password"
                className={inputClass()}
                style={inputStyle(false)}
              />
            </InputWrapper>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 btn-gradient text-white font-semibold py-3 rounded-xl disabled:opacity-60"
            >
              {mutation.isPending ? 'Creating…' : '⚡ Shorten URL'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/urls')}
              className="px-6 py-3 rounded-xl border font-medium text-sm transition-colors hover:opacity-80"
              style={{ borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
