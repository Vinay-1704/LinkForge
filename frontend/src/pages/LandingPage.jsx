import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Zap, Link2, BarChart2, Shield, QrCode, Globe, ChevronRight,
  Star, Check, ArrowRight, GitBranch, Menu, X, Share2,
} from 'lucide-react'
import { useState } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { Sun, Moon } from 'lucide-react'

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
}

const stagger = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true },
}

function LandingNav() {
  const [open, setOpen] = useState(false)
  const { isDark, toggleTheme } = useTheme()
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg btn-gradient flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-xl gradient-text">LinkForge</span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {['Features', 'How It Works', 'Pricing', 'FAQ'].map(s => (
            <a key={s} href={`#${s.toLowerCase().replace(' ', '-')}`}
              className="text-sm font-medium transition-colors hover:opacity-70"
              style={{ color: 'hsl(var(--muted-foreground))' }}>{s}</a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className="p-2 rounded-lg hover:opacity-70" style={{ color: 'hsl(var(--foreground))' }}>
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <Link to="/login" className="text-sm font-medium px-4 py-2 rounded-lg transition-colors hover:opacity-70" style={{ color: 'hsl(var(--foreground))' }}>Login</Link>
          <Link to="/register" className="text-sm font-semibold px-4 py-2 rounded-lg btn-gradient text-white">Get Started</Link>
        </div>
      </div>
    </nav>
  )
}

const features = [
  { icon: Link2, title: 'Smart URL Shortening', desc: 'Generate short links with custom aliases, expiration dates, and password protection.' },
  { icon: QrCode, title: 'QR Code Generation', desc: 'Auto-generate QR codes for every link. Download as PNG or SVG instantly.' },
  { icon: BarChart2, title: 'Deep Analytics', desc: 'Track clicks, browsers, devices, and countries with beautiful charts.' },
  { icon: Shield, title: 'Secure & Protected', desc: 'JWT auth, bcrypt passwords, rate limiting, and CORS protection built-in.' },
  { icon: Globe, title: 'Global Reach', desc: 'See exactly where in the world your clicks are coming from.' },
  { icon: Star, title: 'Favorites & Tags', desc: 'Organize links with favorites and custom tags for quick access.' },
]

const steps = [
  { n: '01', title: 'Create Account', desc: 'Sign up in seconds with email and password.' },
  { n: '02', title: 'Shorten Your URL', desc: 'Paste your long URL, add custom alias and options.' },
  { n: '03', title: 'Share & Track', desc: 'Share the short link and watch analytics in real time.' },
]



const plans = [
  { name: 'Free', price: '$0', features: ['50 links/month', '5K clicks/month', 'Basic analytics', 'QR codes'], cta: 'Get Started', highlighted: false },
  { name: 'Pro', price: '$9', features: ['Unlimited links', '100K clicks/month', 'Advanced analytics', 'Custom domains', 'Password protection'], cta: 'Start Pro', highlighted: true },
  { name: 'Enterprise', price: '$29', features: ['Everything in Pro', 'Unlimited clicks', 'API access', 'Priority support', 'SLA guarantee'], cta: 'Contact Sales', highlighted: false },
]

const faqs = [
  { q: 'Is LinkForge free?', a: 'Yes! Our free plan includes 50 links per month with basic analytics.' },
  { q: 'Can I use custom domains?', a: 'Custom domains are available on the Pro and Enterprise plans.' },
  { q: 'How long do short links last?', a: 'Links never expire unless you set an expiration date yourself.' },
  { q: 'Is my data secure?', a: 'Absolutely. We use JWT, bcrypt, and industry-standard security practices.' },
]

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div className="min-h-screen" style={{ background: 'hsl(var(--background))' }}>
      <LandingNav />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />
        </div>

        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div {...fadeUp}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 glass border"
              style={{ color: 'hsl(var(--primary))' }}>
              <Zap className="w-3.5 h-3.5" /> The URL Shortener Built for Developers
            </span>
          </motion.div>

          <motion.h1 {...fadeUp} transition={{ delay: 0.1, duration: 0.6 }}
            className="text-5xl md:text-7xl font-black mb-6 leading-tight"
            style={{ color: 'hsl(var(--foreground))' }}>
            Shorten. Share.<br />
            <span className="gradient-text">Track Everything.</span>
          </motion.h1>

          <motion.p {...fadeUp} transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl max-w-2xl mx-auto mb-10"
            style={{ color: 'hsl(var(--muted-foreground))' }}>
            LinkForge is a production-ready URL shortener with deep analytics,
            QR codes, custom aliases, and a beautiful dashboard — all for free.
          </motion.p>

          <motion.div {...fadeUp} transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="btn-gradient text-white font-semibold px-8 py-3.5 rounded-xl inline-flex items-center gap-2">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/login" className="px-8 py-3.5 rounded-xl font-semibold border inline-flex items-center gap-2 transition-colors hover:opacity-80"
              style={{ borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}>
              Sign In <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div {...fadeUp} transition={{ delay: 0.4 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[['10K+', 'Links Created'], ['99.9%', 'Uptime'], ['50+', 'Countries']].map(([n, l]) => (
              <div key={l} className="text-center">
                <div className="text-3xl font-black gradient-text">{n}</div>
                <div className="text-sm mt-1" style={{ color: 'hsl(var(--muted-foreground))' }}>{l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4" style={{ color: 'hsl(var(--foreground))' }}>
              Everything You Need
            </h2>
            <p className="text-lg" style={{ color: 'hsl(var(--muted-foreground))' }}>
              Built with modern tech for maximum performance and reliability.
            </p>
          </motion.div>

          <motion.div {...stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <motion.div key={title} {...fadeUp}
                className="glass rounded-2xl p-6 card-hover">
                <div className="w-12 h-12 rounded-xl btn-gradient flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2" style={{ color: 'hsl(var(--foreground))' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'hsl(var(--muted-foreground))' }}>{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6" style={{ background: 'hsl(var(--card))' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4" style={{ color: 'hsl(var(--foreground))' }}>How It Works</h2>
            <p style={{ color: 'hsl(var(--muted-foreground))' }}>Three simple steps to get started.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map(({ n, title, desc }) => (
              <motion.div key={n} {...fadeUp} className="text-center">
                <div className="text-6xl font-black gradient-text mb-4">{n}</div>
                <h3 className="font-bold text-xl mb-2" style={{ color: 'hsl(var(--foreground))' }}>{title}</h3>
                <p style={{ color: 'hsl(var(--muted-foreground))' }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Pricing */}
      <section id="pricing" className="py-24 px-6" style={{ background: 'hsl(var(--card))' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4" style={{ color: 'hsl(var(--foreground))' }}>Simple Pricing</h2>
            <p style={{ color: 'hsl(var(--muted-foreground))' }}>Start free, scale as you grow.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map(({ name, price, features, cta, highlighted }) => (
              <motion.div key={name} {...fadeUp}
                className={`rounded-2xl p-6 card-hover relative ${highlighted ? 'ring-2' : 'glass'}`}
                style={highlighted ? { background: 'hsl(var(--primary) / 0.1)', ringColor: 'hsl(var(--primary))' } : {}}>
                {highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                <h3 className="font-bold text-xl mb-1" style={{ color: 'hsl(var(--foreground))' }}>{name}</h3>
                <div className="text-4xl font-black gradient-text mb-6">{price}<span className="text-lg font-normal text-gray-400">/mo</span></div>
                <ul className="space-y-3 mb-8">
                  {features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm" style={{ color: 'hsl(var(--foreground))' }}>
                      <Check className="w-4 h-4 text-green-500" />{f}
                    </li>
                  ))}
                </ul>
                <Link to="/register" className={`block text-center font-semibold py-2.5 rounded-xl transition-all ${highlighted ? 'btn-gradient text-white' : 'border hover:opacity-80'}`}
                  style={!highlighted ? { borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' } : {}}>
                  {cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4" style={{ color: 'hsl(var(--foreground))' }}>FAQ</h2>
          </motion.div>
          <div className="space-y-4">
            {faqs.map(({ q, a }, i) => (
              <motion.div key={i} {...fadeUp} className="glass rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold"
                  style={{ color: 'hsl(var(--foreground))' }}>
                  {q}
                  <ChevronRight className={`w-4 h-4 transition-transform ${openFaq === i ? 'rotate-90' : ''}`} style={{ color: 'hsl(var(--muted-foreground))' }} />
                </button>
                {openFaq === i && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="px-5 pb-5 text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    {a}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-6">
        <motion.div {...fadeUp} className="max-w-4xl mx-auto text-center glass rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }} />
          <h2 className="text-4xl font-black mb-4 relative" style={{ color: 'hsl(var(--foreground))' }}>
            Ready to <span className="gradient-text">Forge</span> your links?
          </h2>
          <p className="mb-8 relative" style={{ color: 'hsl(var(--muted-foreground))' }}>
            Join thousands of users who trust LinkForge with their link management.
          </p>
          <Link to="/register" className="btn-gradient text-white font-semibold px-10 py-4 rounded-xl inline-flex items-center gap-2">
            Start for Free <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-6" style={{ borderColor: 'hsl(var(--border))' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md btn-gradient flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold gradient-text">LinkForge</span>
            <span className="text-sm ml-2" style={{ color: 'hsl(var(--muted-foreground))' }}>© 2026 All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:opacity-70 transition-opacity" style={{ color: 'hsl(var(--muted-foreground))' }}><Share2 className="w-5 h-5" /></a>
            <a href="#" className="hover:opacity-70 transition-opacity" style={{ color: 'hsl(var(--muted-foreground))' }}><GitBranch className="w-5 h-5" /></a>
            <a href="#" className="hover:opacity-70 transition-opacity" style={{ color: 'hsl(var(--muted-foreground))' }}><Globe className="w-5 h-5" /></a>
          </div>
        </div>
      </footer>
    </div>
  )
}
