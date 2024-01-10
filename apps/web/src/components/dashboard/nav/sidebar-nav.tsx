"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@repo/ui/utils"
import { buttonVariants } from "@repo/ui/button"
import { HTMLAttributes, ReactNode } from "react"
import Image from "next/image"
import { Button } from "@repo/ui/button"
import { Card, CardContent } from "@repo/ui/card"
import { ArrowUpCircleIcon, CoffeeIcon, LogOutIcon } from "lucide-react"

export interface SidebarNavProps extends HTMLAttributes<HTMLElement> {
  itemGroups: {
    title: string
    items: {
      href: string
      title: string
      icon: ReactNode
    }[]
  }[]
}

export function SidebarNav({ className, itemGroups, ...props }: SidebarNavProps) {
  const pathname=usePathname()

  return (
    <nav
      className={cn(
        "flex-col space-y-1 p-4",
        className
      )}
      {...props}
    >

      <div className="flex-col space-y-1">
        <Link className='flex items-center font-display text-2xl mb-4' href='/dashboard'>
          <Image
            alt='Trackit logo'
            src='/logo.svg'
            className='mr-2 rounded-sm'
            height={45}
            width={45}
            style={{ color: 'transparent' }}
          />
          <p className='font-display text-2xl font-bold drop-shadow-sm md:text-3xl'>
            Trackit
          </p>
        </Link>

        {
          itemGroups.map(({ title, items }) => (
            <div key={title} className="justify-start">
              <div className="text-sm font-semibold text-muted-foreground uppercase px-4 my-4 tracking-wider">{title}</div>
              <div className="ml-2 space-y-1">
                {items.map(({ href, title, icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      pathname===href
                        ? "bg-muted hover:bg-muted"
                        :"",
                      "w-full justify-start hover:bg-muted"
                    )}
                  >
                    {icon}
                    {title}
                  </Link>
                ))}
              </div>
            </div>
          ))
        }
      </div>

      <div className="self-end p-2">
        <Card className="backdrop-blur-xl my-6 bg-secondary w-full mx-2">
          <CardContent className="p-4 flex flex-col items-center justify-center space-y-2">
            <ArrowUpCircleIcon className="h-8 w-8" />
            <p className="text-sm text-center font-semibold">Loving Trackit? Help us grow by buying us a coffee.</p>

            <Button>
              <CoffeeIcon className="mr-2 h-4 w-4" />
              Buy a Coffee
            </Button>

          </CardContent>
        </Card>

        <Button asChild className="bg-red-500 hover:bg-red-300 text-white">
          <Link href="/api/logto/sign-out" className="ml-2 w-full">
            <LogOutIcon className="mr-2 h-4 w-4" />
            Logout
          </Link>
        </Button>
      </div>

    </nav>
  )
}