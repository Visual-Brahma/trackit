import SideNav from '@/components/ui/dashboard/SideNav';
import React from 'react'
import DrawerComp from '@/components/ui/Drawer'


export default function Layout({ children }: { children: React.ReactNode; }):JSX.Element {


    return (
      <div className="flex h-screen flex-col md:flex-row ">
        <div className="w-full flex-none md:w-64 md:hidden">
        <DrawerComp/>
        </div>
        <div className='hidden md:block'>
          <SideNav/>
        </div>
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
      </div> 
    );

  
}