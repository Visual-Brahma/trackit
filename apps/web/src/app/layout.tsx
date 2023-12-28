import "@repo/ui/styles"
import './globals.css'
import { Toaster } from 'sonner'
import Script from 'next/script'
import type { Metadata, Viewport } from 'next'
import { LayoutProps } from '@/types'
import { Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Provider } from '@/components/providers'
import { UserProvider } from "@auth0/nextjs-auth0/client"

const playfairDisplay=Playfair_Display({ subsets: ['latin'] })

export const metadata: Metadata={
  title: 'Trackit - Google Meet Attendance Tracker',
  description: 'Introducing TrackIt - the ultimate Google Meet attendance tracker extension! Trackit takes the hassle out of tracking attendance by providing detailed reports on who attended your meetings and how much. With easy installation and seamless integration with Google Meet, TrackIt allows you to start tracking attendance immediately. Say goodbye to manual attendance taking and hello to effortless reporting with TrackIt. Try it now and streamline your virtual meetings!',
  metadataBase: new URL('https://trackit.visualbrahma.tech'),
  applicationName: 'Trackit',
  keywords: ["trackit", "visual brahma", "attendance", "google meet"],
  creator: "Visual Brahma",
}

export const viewport: Viewport={
  width: 'device-width',
  initialScale: 1,
  themeColor: '#6B13FA',
}

export default async function RootLayout({
  children,
}: LayoutProps) {

  return (
    <html lang="en">
      <UserProvider>
        <body className={playfairDisplay.className}>
          <Provider>
            {children}
          </Provider>
          <Toaster position={'top-right'} />
          <Script
            src='//code.tidio.co/zyi8qkhaweop5tc4oenpsdstwnvcjw6j.js'
            async={true}
          />
          <Analytics />
          <SpeedInsights />
        </body>
      </UserProvider>
    </html>
  )
}
