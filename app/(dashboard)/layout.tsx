'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Header from '@/components/layout/Header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function checkUser() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
      } else {
        setUser({ email: user.email || '' })
      }
      setLoading(false)
    }
    
    checkUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <p style={{ color: 'var(--text-secondary)' }}>Загрузка...</p>
        </div>
      ) : user ? (
        <>
          <Header userEmail={user.email} />
          <main>{children}</main>
        </>
      ) : null}
    </div>
  )
}
