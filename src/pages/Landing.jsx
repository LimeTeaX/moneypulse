// src/pages/Landing.jsx
// ─────────────────────────────────────────────
// Landing Page — Premium design, seamless transitions, fixed footer
// ─────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowRight, Check, Shield, TrendingUp, Wallet, 
  BarChart3, Bot, Repeat, Star, Menu, X, Users
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
      {/* ────────────────────────────────────────── */}
      {/* Navbar */}
      {/* ────────────────────────────────────────── */}
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

      {/* ────────────────────────────────────────── */}
      {/* Hero Section */}
      {/* ────────────────────────────────────────── */}
      <section id="hero" className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary-pale rounded-full px-4 py-1.5 mb-6">
              <span className="text-xs font-black text-positive">✨ NEW</span>
              <span className="text-xs text-ink">AI-powered financial insights</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-ink leading-tight">
              Control your money
              <br />
              with <span className="text-primary">clarity.</span>
            </h1>
            <p className="text-lg text-body mt-6 max-w-2xl mx-auto">
              Track your balance, monitor expenses, and grow your financial health with a cleaner, smarter workflow.
              Powered by AI, secured by Supabase.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <button onClick={() => navigate('/auth')} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-primary text-ink text-sm font-semibold hover:bg-primary-hover transition-all hover:scale-105">
                Get Started Free <ArrowRight size={16} />
              </button>
              <button onClick={() => scrollToSection('features')} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-ink/10 bg-white/50 backdrop-blur-sm text-ink text-sm font-semibold hover:bg-white transition-all">
                Learn More
              </button>
            </div>
            <div className="flex items-center justify-center gap-8 mt-10 text-sm text-mute">
              <div className="flex items-center gap-2"><Check size={16} className="text-positive" /> No credit card required</div>
              <div className="flex items-center gap-2"><Check size={16} className="text-positive" /> Free forever plan</div>
              <div className="flex items-center gap-2"><Check size={16} className="text-positive" /> Cancel anytime</div>
            </div>
          </div>

          {/* Dashboard Preview Mockup */}
          <div className="mt-16 relative">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-ink/5">
              <div className="bg-surface-soft px-4 py-3 border-b border-ink/5 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <div className="flex-1 text-center text-xs text-mute font-semibold">Dashboard Preview</div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-surface-soft rounded-xl p-4">
                    <p className="text-xs text-mute">Total Balance</p>
                    <p className="text-2xl font-black text-ink">Rp12.450.000</p>
                    <span className="text-xs text-positive">+12.5% this month</span>
                  </div>
                  <div className="bg-surface-soft rounded-xl p-4">
                    <p className="text-xs text-mute">Monthly Income</p>
                    <p className="text-2xl font-black text-ink">Rp8.200.000</p>
                    <span className="text-xs text-positive">+8.1%</span>
                  </div>
                  <div className="bg-surface-soft rounded-xl p-4">
                    <p className="text-xs text-mute">Monthly Expense</p>
                    <p className="text-2xl font-black text-ink">Rp3.850.000</p>
                    <span className="text-xs text-danger">-2.4%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────── */}
      {/* Seamless: Hero → Features */}
      {/* ────────────────────────────────────────── */}
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 h-20 bg-linear-to-b from-surface-soft to-white pointer-events-none z-10" />
        
        <section id="features" className="py-20 px-4 bg-white relative">
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
      </div>

      {/* ────────────────────────────────────────── */}
      {/* Seamless: Features → Stats */}
      {/* ────────────────────────────────────────── */}
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 h-20 bg-linear-to-b from-white to-surface-soft pointer-events-none z-10" />
        
        <section className="py-20 px-4 bg-surface-soft relative">
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
      </div>

      {/* ────────────────────────────────────────── */}
      {/* Seamless: Stats → Pricing */}
      {/* ────────────────────────────────────────── */}
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 h-20 bg-linear-to-b from-surface-soft to-white pointer-events-none z-10" />
        
        <section id="pricing" className="py-20 px-4 bg-white relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs font-black uppercase tracking-widest text-primary mb-2">Pricing</p>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-ink">Simple, transparent pricing</h2>
              <p className="text-body mt-4">Start for free, upgrade when you need more</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Free Plan */}
              <div className="p-6 bg-surface-soft rounded-2xl hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="mb-4">
                  <p className="text-sm font-black text-ink">Free</p>
                  <p className="text-3xl font-black text-ink mt-2">Rp0</p>
                  <p className="text-xs text-mute">Forever free</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-sm"><Check size={16} className="text-positive" /> Up to 100 transactions/month</li>
                  <li className="flex items-center gap-2 text-sm"><Check size={16} className="text-positive" /> Basic analytics</li>
                  <li className="flex items-center gap-2 text-sm"><Check size={16} className="text-positive" /> 1 financial account</li>
                  <li className="flex items-center gap-2 text-sm"><Check size={16} className="text-positive" /> AI assistant (5 chats/day)</li>
                </ul>
                <button onClick={() => navigate('/auth')} className="w-full py-3 rounded-xl border border-ink/10 bg-white text-ink text-sm font-semibold hover:bg-surface-soft transition-colors">Get Started</button>
              </div>

              {/* Pro Plan */}
              <div className="p-6 bg-primary-pale rounded-2xl border-2 border-primary relative hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary rounded-full text-xs font-black text-ink">POPULAR</div>
                <div className="mb-4">
                  <p className="text-sm font-black text-ink">Pro</p>
                  <p className="text-3xl font-black text-ink mt-2">Rp49.000</p>
                  <p className="text-xs text-mute">Per month, billed yearly</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-sm"><Check size={16} className="text-positive" /> Unlimited transactions</li>
                  <li className="flex items-center gap-2 text-sm"><Check size={16} className="text-positive" /> Advanced analytics + insights</li>
                  <li className="flex items-center gap-2 text-sm"><Check size={16} className="text-positive" /> Unlimited bank accounts</li>
                  <li className="flex items-center gap-2 text-sm"><Check size={16} className="text-positive" /> Unlimited AI chats</li>
                  <li className="flex items-center gap-2 text-sm"><Check size={16} className="text-positive" /> Priority support</li>
                </ul>
                <button onClick={() => navigate('/auth')} className="w-full py-3 rounded-xl bg-primary text-ink text-sm font-semibold hover:bg-primary-hover transition-colors">Start Free Trial</button>
              </div>

              {/* Business Plan */}
              <div className="p-6 bg-surface-soft rounded-2xl hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="mb-4">
                  <p className="text-sm font-black text-ink">Business</p>
                  <p className="text-3xl font-black text-ink mt-2">Custom</p>
                  <p className="text-xs text-mute">Contact sales</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-sm"><Check size={16} className="text-positive" /> Everything in Pro</li>
                  <li className="flex items-center gap-2 text-sm"><Check size={16} className="text-positive" /> Team collaboration</li>
                  <li className="flex items-center gap-2 text-sm"><Check size={16} className="text-positive" /> API access</li>
                  <li className="flex items-center gap-2 text-sm"><Check size={16} className="text-positive" /> Dedicated support</li>
                </ul>
                <button className="w-full py-3 rounded-xl border border-ink/10 bg-white text-ink text-sm font-semibold hover:bg-surface-soft transition-colors">Contact Sales</button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ────────────────────────────────────────── */}
      {/* Seamless: Pricing → Testimonials */}
      {/* ────────────────────────────────────────── */}
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 h-20 bg-linear-to-b from-white to-surface-soft pointer-events-none z-10" />
        
        <section id="testimonials" className="py-20 px-4 bg-surface-soft relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs font-black uppercase tracking-widest text-primary mb-2">Testimonials</p>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-ink">Loved by thousands of users</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Andi Wijaya', role: 'Freelancer', content: 'MoneyPulse helped me track my irregular income and save for my first house. The AI insights are spot on!', rating: 5, avatar: 'A' },
                { name: 'Sarah Putri', role: 'Small Business Owner', content: 'Managing business expenses has never been easier. The recurring bills feature saves me hours every month.', rating: 5, avatar: 'S' },
                { name: 'Budi Santoso', role: 'Investor', content: 'The analytics dashboard gives me clear visibility into my spending. Best finance app I have used.', rating: 5, avatar: 'B' },
              ].map((t, i) => (
                <div key={i} className="p-6 bg-white rounded-2xl hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, j) => <Star key={j} size={16} className="fill-primary text-primary" />)}
                  </div>
                  <p className="text-sm text-body mb-4">"{t.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-ink font-black">{t.avatar}</div>
                    <div>
                      <p className="text-sm font-semibold text-ink">{t.name}</p>
                      <p className="text-xs text-mute">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ────────────────────────────────────────── */}
      {/* CTA + Footer - Background ink solid */}
      {/* ────────────────────────────────────────── */}
      <div className="bg-ink">
        {/* CTA Card */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center bg-white/5 backdrop-blur-sm rounded-3xl p-12 relative overflow-hidden border border-white/10">
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
        <footer className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-black text-ink text-sm">M</div>
                  <span className="font-black text-white">MoneyPulse</span>
                </div>
                <p className="text-xs text-white/50">Smart personal finance management for everyone.</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-white mb-3">Product</p>
                <ul className="space-y-2 text-sm text-white/50">
                  <li><button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">Features</button></li>
                  <li><button onClick={() => scrollToSection('pricing')} className="hover:text-white transition-colors">Pricing</button></li>
                  <li><button className="hover:text-white transition-colors">FAQ</button></li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-white mb-3">Company</p>
                <ul className="space-y-2 text-sm text-white/50">
                  <li><button className="hover:text-white transition-colors">About</button></li>
                  <li><button className="hover:text-white transition-colors">Blog</button></li>
                  <li><button className="hover:text-white transition-colors">Contact</button></li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-white mb-3">Legal</p>
                <ul className="space-y-2 text-sm text-white/50">
                  <li><button className="hover:text-white transition-colors">Privacy Policy</button></li>
                  <li><button className="hover:text-white transition-colors">Terms of Service</button></li>
                </ul>
              </div>
            </div>
            <div className="text-center text-xs text-white/30 pt-8 mt-8 border-t border-white/10">
              &copy; 2024 MoneyPulse. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}