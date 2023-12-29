"use client"
import { useState, useEffect } from 'react'
import { LayoutProps } from '@/types'
import Link from 'next/link'
import Image from 'next/image'
import ThemeSelector from './theme_changer'
import { buttonVariants } from '@repo/ui/button'

const Layout=({ children }: LayoutProps) => {

    const [isScrolled, setIsScrolled]=useState(false)

    useEffect(() => {
        const handleScroll=() => {
            const scrollTop=window.scrollY
            if (scrollTop>0) {
                setIsScrolled(true)
            } else {
                setIsScrolled(false)
            }
        }
        document.addEventListener('scroll', handleScroll)
        return () => {
            document.removeEventListener('scroll', handleScroll)
        }
    }, []);

    return (
        <div>
            <div
                className={`fixed top-0 w-full ${isScrolled
                    ? 'border-b border-border backdrop-blur-xl':""
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
                        <p className='font-display text-2xl font-bold drop-shadow-sm md:text-3xl'>
                            Trackit
                        </p>
                    </Link>
                    <div className='flex items-center justify-center'>
                        <Link href='/app' className={buttonVariants({ variant: "default" })} >
                            {"Get Started"}
                        </Link>
                        <ThemeSelector />
                    </div>
                </div>
            </div>
            <div className='w-full py-5 text-center self-end'>{children}</div>
            <div className='w-full border-t border-border py-5 text-center self-end'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center'>
                    <div className='text-center sm:text-left'>
                        <p className='text-sm'>
                            &copy; 2024 Trackit. All rights reserved.
                        </p>
                    </div>
                    <div className='flex flex-col mt-4 sm:mt-0 sm:flex-row'>
                        <Link
                            href='/privacy-policy'
                            className={buttonVariants({ variant: "ghost" })}
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href='/guide'
                            className={buttonVariants({ variant: "ghost" })}
                        >
                            Guide
                        </Link>
                        <a
                            href='https://forms.office.com/r/B8gUAVbDPA'
                            className={buttonVariants({ variant: "ghost" })}
                        >
                            Feedback
                        </a>
                        <a
                            href='https://github.com/Visual-Brahma/trackit'
                            className={buttonVariants({ variant: "ghost" })}
                        >
                            Contribute
                        </a>
                        <a
                            href='https://www.buymeacoffee.com/blaze2004'
                            className={buttonVariants({ variant: "ghost" })}
                        >
                            Donate
                        </a>
                        <a
                            href='mailto:teamtrackit@gmail.com'
                            className={buttonVariants({ variant: "ghost" })}
                        >
                            Contact Us
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Layout;