// src/pages/Landing.jsx
// ─────────────────────────────────────────────
// Landing Page — Premium design with hero image
// ─────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowRight, Check, Shield, TrendingUp, Wallet, 
  BarChart3, Bot, Repeat, Star, Menu, X, Users,
  Zap, Globe, Lock, Award
} from 'lucide-react'

export default function LandingPage() {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-surface-soft">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => scrollToSection('hero')}>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-black text-ink text-sm group-hover:scale-105 transition-transform">
                M
              </div>
              <span className="font-black text-lg text-ink">MoneyPulse</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('features')} className="text-sm text-body hover:text-ink transition-colors">Features</button>
              <button onClick={() => scrollToSection('pricing')} className="text-sm text-body hover:text-ink transition-colors">Pricing</button>
              <button onClick={() => scrollToSection('testimonials')} className="text-sm text-body hover:text-ink transition-colors">Testimonials</button>
              <button onClick={() => navigate('/auth')} className="px-4 py-2 rounded-xl text-sm font-semibold text-ink hover:bg-surface-soft transition-colors">Sign In</button>
              <button onClick={() => navigate('/auth')} className="px-5 py-2 rounded-xl bg-primary text-ink text-sm font-semibold hover:bg-primary-hover transition-all hover:scale-105">Get Started</button>
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg hover:bg-surface-soft">
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-ink/5 p-4">
            <div className="flex flex-col gap-3">
              <button onClick={() => scrollToSection('features')} className="px-4 py-2 text-sm text-body hover:bg-surface-soft rounded-xl">Features</button>
              <button onClick={() => scrollToSection('pricing')} className="px-4 py-2 text-sm text-body hover:bg-surface-soft rounded-xl">Pricing</button>
              <button onClick={() => scrollToSection('testimonials')} className="px-4 py-2 text-sm text-body hover:bg-surface-soft rounded-xl">Testimonials</button>
              <button onClick={() => navigate('/auth')} className="px-4 py-2 text-sm font-semibold text-ink hover:bg-surface-soft rounded-xl">Sign In</button>
              <button onClick={() => navigate('/auth')} className="px-4 py-2 rounded-xl bg-primary text-ink text-sm font-semibold text-center">Get Started</button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section dengan Gambar */}
      <section id="hero" className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-primary-pale rounded-full px-4 py-1.5 mb-6">
                <span className="text-xs font-black text-positive">✨ NEW</span>
                <span className="text-xs text-ink">AI-powered financial insights</span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-ink leading-tight">
                Control your money
                <br />
                with <span className="text-primary">clarity.</span>
              </h1>
              <p className="text-lg text-body mt-6">
                Track your balance, monitor expenses, and grow your financial health with a cleaner, smarter workflow.
                Powered by AI, secured by Supabase.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button onClick={() => navigate('/auth')} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-primary text-ink text-sm font-semibold hover:bg-primary-hover transition-all hover:scale-105">
                  Get Started Free <ArrowRight size={16} />
                </button>
                <button onClick={() => scrollToSection('features')} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-ink/10 bg-white/50 backdrop-blur-sm text-ink text-sm font-semibold hover:bg-white transition-all">
                  Learn More
                </button>
              </div>
              <div className="flex items-center gap-8 mt-10 text-sm text-mute">
                <div className="flex items-center gap-2"><Check size={16} className="text-positive" /> No credit card required</div>
                <div className="flex items-center gap-2"><Check size={16} className="text-positive" /> Free forever plan</div>
                <div className="flex items-center gap-2"><Check size={16} className="text-positive" /> Cancel anytime</div>
              </div>
            </div>

            {/* Right Image/Illustration */}
            <div className="relative">
              <div className="bg-linear-to-br from-primary/20 via-primary/5 to-transparent rounded-3xl p-4">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-ink/5">
                  <div className="bg-surface-soft px-4 py-3 border-b border-ink/5 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <div className="flex-1 text-center text-xs text-mute font-semibold">Dashboard Preview</div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-surface-soft rounded-xl p-4 text-center">
                        <p className="text-xs text-mute">Total Balance</p>
                        <p className="text-xl font-black text-ink">Rp12.4M</p>
                        <span className="text-xs text-positive">+12.5%</span>
                      </div>
                      <div className="bg-surface-soft rounded-xl p-4 text-center">
                        <p className="text-xs text-mute">Income</p>
                        <p className="text-xl font-black text-ink">Rp8.2M</p>
                        <span className="text-xs text-positive">+8.1%</span>
                      </div>
                      <div className="bg-surface-soft rounded-xl p-4 text-center">
                        <p className="text-xs text-mute">Expense</p>
                        <p className="text-xl font-black text-ink">Rp3.8M</p>
                        <span className="text-xs text-danger">-2.4%</span>
                      </div>
                    </div>
                    {/* Chart preview */}
                    <div className="mt-4 h-24 bg-surface-soft rounded-xl flex items-end gap-2 p-3">
                      <div className="w-full h-12 bg-primary/30 rounded-lg" />
                      <div className="w-full h-16 bg-primary/50 rounded-lg" />
                      <div className="w-full h-20 bg-primary rounded-lg" />
                      <div className="w-full h-14 bg-primary/40 rounded-lg" />
                      <div className="w-full h-10 bg-primary/20 rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-black uppercase tracking-widest text-primary mb-2">Features</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-ink">Everything you need to manage<br />your finances</h2>
            <p className="text-body mt-4 max-w-2xl mx-auto">All the tools you need to take control of your financial life</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: TrendingUp, title: 'Smart Dashboard', desc: 'Real-time overview of your finances with interactive charts and insights.', color: 'green' },
              { icon: Wallet, title: 'Expense Tracking', desc: 'Categorize and track every transaction with powerful filters and search.', color: 'blue' },
              { icon: BarChart3, title: 'Advanced Analytics', desc: 'Visualize spending patterns with heatmaps, donut charts, and trends.', color: 'purple' },
              { icon: Repeat, title: 'Recurring Bills', desc: 'Never miss a payment with subscription and bill tracking.', color: 'orange' },
              { icon: Bot, title: 'AI Assistant', desc: 'Get personalized financial advice and insights from our AI assistant.', color: 'green' },
              { icon: Shield, title: 'Bank Grade Security', desc: 'Your data is encrypted and protected with Supabase RLS policies.', color: 'blue' },
            ].map((feat, i) => (
              <div key={i} className="group p-6 bg-surface-soft rounded-2xl hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
                <div className={`w-12 h-12 rounded-xl bg-${feat.color === 'green' ? 'primary-pale' : feat.color === 'blue' ? 'blue-50' : feat.color === 'purple' ? 'purple-50' : 'orange-50'} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feat.icon size={24} className={`text-${feat.color === 'green' ? 'positive' : feat.color === 'blue' ? 'blue-600' : feat.color === 'purple' ? 'purple-600' : 'orange-600'}`} />
                </div>
                <h3 className="text-lg font-black text-ink mb-2">{feat.title}</h3>
                <p className="text-sm text-mute">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '10k+', label: 'Active Users', icon: Users },
              { value: 'Rp50B+', label: 'Money Tracked', icon: TrendingUp },
              { value: '99.9%', label: 'Uptime', icon: Shield },
              { value: '24/7', label: 'AI Support', icon: Bot },
            ].map((stat, i) => (
              <div key={i} className="group">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-sm">
                  <stat.icon size={20} className="text-positive" />
                </div>
                <p className="text-3xl font-black text-ink">{stat.value}</p>
                <p className="text-sm text-mute mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center bg-ink rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-r from-primary/20 to-transparent" />
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Ready to take control of your finances?</h2>
            <p className="text-white/70 mb-8">Join thousands of users who trust MoneyPulse to manage their money</p>
            <button onClick={() => navigate('/auth')} className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-ink text-sm font-semibold hover:bg-primary-hover transition-all hover:scale-105">
              Get Started Free <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-white border-t border-ink/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-black text-ink text-sm">M</div>
                <span className="font-black text-ink">MoneyPulse</span>
              </div>
              <p className="text-xs text-mute">Smart personal finance management for everyone.</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-ink mb-3">Product</p>
              <ul className="space-y-2 text-sm text-mute">
                <li><button onClick={() => scrollToSection('features')} className="hover:text-ink">Features</button></li>
                <li><button onClick={() => scrollToSection('pricing')} className="hover:text-ink">Pricing</button></li>
                <li><button className="hover:text-ink">FAQ</button></li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-ink mb-3">Company</p>
              <ul className="space-y-2 text-sm text-mute">
                <li><button className="hover:text-ink">About</button></li>
                <li><button className="hover:text-ink">Blog</button></li>
                <li><button className="hover:text-ink">Contact</button></li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-ink mb-3">Legal</p>
              <ul className="space-y-2 text-sm text-mute">
                <li><button className="hover:text-ink">Privacy Policy</button></li>
                <li><button className="hover:text-ink">Terms of Service</button></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-xs text-mute pt-8 mt-8 border-t border-ink/5">
            &copy; 2024 MoneyPulse. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}