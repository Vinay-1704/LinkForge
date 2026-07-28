import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Zap, Link2, BarChart2, Shield, QrCode, Globe, ChevronRight,
  Star, Check, ArrowRight, GitBranch, Menu, X, Share2, Sun, Moon
} from 'lucide-react'
import { useState } from 'react'
import { useTheme } from '@/context/ThemeContext'

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
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
        <div className="hidden md:flex items-center gap-3">
          <button onClick={toggleTheme} className="p-2 rounded-lg hover:opacity-70" style={{ color: 'hsl(var(--foreground))' }}>
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <Link to="/login" className="text-sm font-medium px-4 py-2 rounded-lg transition-colors hover:opacity-70" style={{ color: 'hsl(var(--foreground))' }}>Login</Link>
          <Link to="/register" className="text-sm font-semibold px-4 py-2 rounded-lg btn-gradient text-white">Get Started</Link>
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-2">
          <button onClick={toggleTheme} className="p-2 rounded-lg hover:opacity-70" style={{ color: 'hsl(var(--foreground))' }}>
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button onClick={() => setOpen(!open)} className="p-2 rounded-lg" style={{ color: 'hsl(var(--foreground))' }}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden glass border-b border-white/10 px-4 py-4 space-y-3">
          {['Features', 'How It Works', 'Pricing', 'FAQ'].map(s => (
            <a key={s} href={`#${s.toLowerCase().replace(' ', '-')}`} onClick={() => setOpen(false)}
              className="block text-sm font-medium py-1" style={{ color: 'hsl(var(--foreground))' }}>{s}</a>
          ))}
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <Link to="/login" onClick={() => setOpen(false)} className="text-center text-sm font-medium py-2.5 rounded-lg border" style={{ borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}>Login</Link>
            <Link to="/register" onClick={() => setOpen(false)} className="text-center text-sm font-semibold py-2.5 rounded-lg btn-gradient text-white">Get Started</Link>
          </div>
        </div>
      )}
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
      <section className="pt-28 md:pt-36 pb-16 md:pb-24 px-4 sm:px-6 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div {...fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border"
            style={{ background: 'hsl(var(--muted))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}>
            <Zap className="w-3.5 h-3.5 text-indigo-500" /> Enterprise-grade URL Shortener & Analytics
          </motion.div>

          <motion.h1 {...fadeUp} className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight mb-6"
            style={{ color: 'hsl(var(--foreground))' }}>
            Shorten Links. <br />
            <span className="gradient-text">Amplify Your Reach.</span>
          </motion.h1>

          <motion.p {...fadeUp} className="text-base sm:text-xl max-w-2xl mx-auto mb-10"
            style={{ color: 'hsl(var(--muted-foreground))' }}>
            LinkForge empowers modern teams to create, manage, and analyze short links with instant QR codes and deep geolocation analytics.
          </motion.p>

          <motion.div {...fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto btn-gradient text-white font-bold text-base px-8 py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/25">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-base border glass flex items-center justify-center"
              style={{ borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}>
              Sign In
            </Link>
          </motion.div>

          {/* Stats Bar */}
          <motion.div {...fadeUp} className="mt-16 sm:mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { val: '10M+', lbl: 'Links Created' },
              { val: '99.9%', lbl: 'Uptime SLA' },
              { val: '50M+', lbl: 'Monthly Clicks' },
              { val: '<10ms', lbl: 'Redirect Latency' },
            ].map(s => (
              <div key={s.lbl} className="glass p-4 sm:p-5 rounded-2xl">
                <div className="text-2xl sm:text-3xl font-black gradient-text">{s.val}</div>
                <div className="text-xs sm:text-sm font-medium mt-1" style={{ color: 'hsl(var(--muted-foreground))' }}>{s.lbl}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 md:py-24 px-4 sm:px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-4xl font-black mb-4" style={{ color: 'hsl(var(--foreground))' }}>
              Everything You Need to Scale Your Links
            </h2>
            <p className="text-sm sm:text-base" style={{ color: 'hsl(var(--muted-foreground))' }}>
              Built for performance, security, and developer productivity.
            </p>
          </motion.div>

          <motion.div variants={stagger} initial="initial" whileInView="whileInView" viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(f => (
              <motion.div key={f.title} variants={fadeUp} className="glass p-6 rounded-2xl card-hover">
                <div className="w-12 h-12 rounded-xl btn-gradient flex items-center justify-center mb-5 shadow-lg shadow-indigo-500/20">
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'hsl(var(--foreground))' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'hsl(var(--muted-foreground))' }}>{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-16 md:py-24 px-4 sm:px-6 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-4xl font-black mb-4" style={{ color: 'hsl(var(--foreground))' }}>
              Three Simple Steps to Get Started
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map(s => (
              <motion.div key={s.n} {...fadeUp} className="glass p-8 rounded-2xl relative">
                <div className="text-4xl font-black gradient-text mb-4">{s.n}</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: 'hsl(var(--foreground))' }}>{s.title}</h3>
                <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 md:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-4xl font-black mb-4" style={{ color: 'hsl(var(--foreground))' }}>
              Simple, Transparent Pricing
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map(p => (
              <motion.div key={p.name} {...fadeUp}
                className={`glass p-8 rounded-3xl relative flex flex-col justify-between ${p.highlighted ? 'border-2 border-indigo-500 shadow-2xl shadow-indigo-500/20' : ''}`}>
                {p.highlighted && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 btn-gradient text-white text-xs font-bold px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                <div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'hsl(var(--foreground))' }}>{p.name}</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-black gradient-text">{p.price}</span>
                    <span className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>/month</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {p.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm" style={{ color: 'hsl(var(--foreground))' }}>
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link to="/register" className={`w-full text-center font-bold py-3.5 rounded-2xl transition-all ${p.highlighted ? 'btn-gradient text-white shadow-lg' : 'border border-white/10 hover:bg-white/5'}`}>
                  {p.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 md:py-24 px-4 sm:px-6 bg-black/20">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-black mb-4" style={{ color: 'hsl(var(--foreground))' }}>Frequently Asked Questions</h2>
          </motion.div>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <motion.div key={i} {...fadeUp} className="glass rounded-2xl p-6 cursor-pointer" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div className="flex justify-between items-center font-bold text-base" style={{ color: 'hsl(var(--foreground))' }}>
                  {f.q}
                  <ChevronRight className={`w-5 h-5 transition-transform ${openFaq === i ? 'rotate-90' : ''}`} />
                </div>
                {openFaq === i && <p className="mt-3 text-sm leading-relaxed" style={{ color: 'hsl(var(--muted-foreground))' }}>{f.a}</p>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t px-4 sm:px-6 text-center text-sm" style={{ borderColor: 'hsl(var(--border))', color: 'hsl(var(--muted-foreground))' }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-500" /> <span className="font-bold text-white">LinkForge</span> © {new Date().getFullYear()}
          </div>
          <p>Production-Ready URL Shortener & Analytics SaaS</p>
        </div>
      </footer>
    </div>
  )
}
