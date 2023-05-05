import { FC, useState, useEffect } from 'react'
import { CustomComponentProps } from '@/types'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import { FaDesktop, FaMoon, FaSun } from 'react-icons/fa'

declare global {
  interface Window {
    tidioChatApi: any
  }
}

const Layout: FC<CustomComponentProps> = ({ children }) => {
  const { data: session } = useSession()
  const router = useRouter()

  const [isScrolled, setIsScrolled] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      if (scrollTop > 0) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    document.addEventListener('scroll', handleScroll)
    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className='dark:bg-black'>
      <Head>
        <title>Trackit</title>
        <meta
          name='description'
          content='Introducing TrackIt - the ultimate Google Meet attendance tracker extension! Trackit takes the hassle out of tracking attendance by providing detailed reports on who attended your meetings and how much. With easy installation and seamless integration with Google Meet, TrackIt allows you to start tracking attendance immediately. Say goodbye to manual attendance taking and hello to effortless reporting with TrackIt. Try it now and streamline your virtual meetings!'
        />
      </Head>
      <div
        className={`fixed top-0 w-full ${
          isScrolled
            ? 'border-b border-black-100 bg-white/50 backdrop-blur-xl dark:bg-black/50'
            : 'bg-white/0'
        } z-30 transition-all`}
      >
        <div className='mx-5 flex h-16 max-w-screen-xl items-center justify-between xl:mx-auto'>
          <Link className='flex items-center font-display text-2xl' href='/'>
            <Image
              alt='Trackit logo'
              src='/logo.png'
              className='mr-2 rounded-sm'
              height={45}
              width={45}
              loading='lazy'
              style={{ color: 'transparent' }}
            />
            <p className='font-display text-2xl font-bold drop-shadow-sm md:text-3xl text-black dark:text-white'>
              Trackit
            </p>
          </Link>
          <div className='flex flex-col mt-4 hidden sm:block sm:mt-0 sm:flex-row'>
            <Link
              href='/guide'
              className='text-gray-800 hover:text-gray-400 ml-4 dark:text-white'
            >
              Guide
            </Link>
            <a
              href='https://forms.office.com/r/B8gUAVbDPA'
              className='text-gray-800 hover:text-gray-400 ml-4 dark:text-white'
            >
              Feedback
            </a>
            <a
              // href="javascript:;"
              onClick={() => {
                window.tidioChatApi.display(true)
                window.tidioChatApi.open()
              }}
              className='text-gray-800 hover:text-gray-400 ml-4 dark:text-white'
            >
              Chat
            </a>
            <a
              href='https://www.buymeacoffee.com/blaze2004'
              className='text-gray-800 hover:text-gray-400 ml-4 dark:text-white'
            >
              Donate
            </a>
            <a
              href='mailto:teamtrackit@gmail.com'
              className='text-gray-800 hover:text-gray-400 ml-4 dark:text-white'
            >
              Contact Us
            </a>
          </div>
          <div className='flex items-center justify-center'>
            <button
              className='button-small'
              onClick={() => (session ? router.push('/app') : signIn())}
            >
              {session ? 'Dashboard' : 'Get Started'}
            </button>
            <button
              className='px-2 py-2 rounded-md hover:text-gray-500 sm:ml-4 focus:outline-none ring-2 ring-deep-purple'
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === undefined ? (
                <FaDesktop />
              ) : theme === 'dark' ? (
                <FaSun />
              ) : (
                <FaMoon />
              )}
            </button>
          </div>
        </div>
      </div>
      <div className='w-full py-5 text-center self-end'>{children}</div>
      <div className='w-full border-t border-gray-200 dark:border-white-200 py-5 text-center self-end'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center'>
          <div className='text-center sm:text-left'>
            <p className='text-sm dark:text-white'>
              &copy; 2023 Trackit. All rights reserved.
            </p>
          </div>
          <div className='flex flex-col mt-4 sm:mt-0 sm:flex-row'>
            <Link
              href='/privacy-policy'
              className='text-gray-800 hover:text-gray-400 ml-4 dark:text-white'
            >
              Privacy Policy
            </Link>
            <Link
              href='/guide'
              className='text-gray-800 hover:text-gray-400 ml-4 dark:text-white'
            >
              Guide
            </Link>
            <a
              href='https://github.com/Visual-Brahma/trackit'
              className='text-gray-800 hover:text-gray-400 ml-4 dark:text-white'
            >
              Contribute
            </a>
            <a
              href='https://www.buymeacoffee.com/blaze2004'
              className='text-gray-800 hover:text-gray-400 ml-4 dark:text-white'
            >
              Donate
            </a>
            <a
              href='mailto:teamtrackit@gmail.com'
              className='text-gray-800 hover:text-gray-400 ml-4 dark:text-white'
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout
