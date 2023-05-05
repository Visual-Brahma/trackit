import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/react'
import { SessionProvider } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Loading from '@/components/loading'
import { ThemeProvider } from 'next-themes'

export default function App ({
  Component,
  pageProps: { session, ...pageProps }
}: AppProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const handleStart = () => setIsLoading(true)
    const handleComplete = () => setIsLoading(false)

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  }, [router])

  return (
    <SessionProvider session={session}>
      <Script
        src='//code.tidio.co/zyi8qkhaweop5tc4oenpsdstwnvcjw6j.js'
        async={true}
      />
      <ThemeProvider attribute='class'>
        {isLoading && <Loading />}
        <Component {...pageProps} />
      </ThemeProvider>
      <Analytics />
    </SessionProvider>
  )
}
