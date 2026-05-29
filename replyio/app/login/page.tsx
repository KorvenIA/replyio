'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    console.log('Login result:', data, error)

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    await new Promise(resolve => setTimeout(resolve, 500))
    window.location.href = '/dashboard'
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#FFFFFF', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#1A1A1A'
    }}>
      <div style={{ 
        background: '#FFFFFF', 
        padding: '40px 32px', 
        borderRadius: '8px', 
        width: '360px',
        border: '1px solid #E5E5E5'
      }}>
        <h1 style={{ 
          textAlign: 'center', 
          marginBottom: '28px',
          fontSize: '20px',
          fontWeight: '600',
          letterSpacing: '-0.025em'
        }}>
          Replyio
        </h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888888', marginBottom: '6px' }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '8px 12px', 
                border: '1px solid #E5E5E5', 
                borderRadius: '6px',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888888', marginBottom: '6px' }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '8px 12px', 
                border: '1px solid #E5E5E5', 
                borderRadius: '6px',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {error && (
            <p style={{ 
              color: '#DC2626', 
              fontSize: '12px', 
              margin: '0',
              fontWeight: '500'
            }}>
              {error}
            </p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '10px 16px', 
              background: '#2563EB', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
              marginTop: '8px',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  )
}
