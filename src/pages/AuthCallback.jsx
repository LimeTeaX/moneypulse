// src/pages/AuthCallback.jsx
// ─────────────────────────────────────────────
// Auth Callback — Handle redirect from Google OAuth
// ─────────────────────────────────────────────

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleCallback = async () => {
      // Ambil session setelah redirect dari Google
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Auth callback error:', error)
        navigate('/auth')
        return
      }
      
      if (session) {
        // Login sukses, redirect ke dashboard
        navigate('/dashboard')
      } else {
        // Gagal, balik ke auth page
        navigate('/auth')
      }
    }

    handleCallback()
  }, [navigate])

  return (
    <div className="min-h-screen bg-surface-soft flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-ink font-semibold">Completing sign in...</p>
        <p className="text-mute text-sm mt-1">Please wait while we redirect you.</p>
      </div>
    </div>
  )
}