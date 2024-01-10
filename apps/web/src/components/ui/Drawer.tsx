'use client'
import { Drawer } from 'vaul';
import React from "react";
import { LayoutDashboard, Users, FileBarChart2, StickyNote, Cog, BookOpenText, SmartphoneNfc, MessageCircleHeart, Coffee, LogOut} from 'lucide-react';
import { Button } from './button'
export const DrawerComp = (): JSX.Element=> {

  return (


  <Drawer.Root shouldScaleBackground>
    <Drawer.Trigger asChild>
      <Button className=' rounded-[24px] ml-[12px] mt-[12px]'><LayoutDashboard/></Button>
    </Drawer.Trigger>
    <Drawer.Portal>
      <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="bg-zinc-100 flex flex-col rounded-t-[10px] h-[96%] w-[200px] mt-24 fixed bottom-0 left-0 right-0 rounded-r-[12px]">
          <div className="relative h-full bg-[#2A2D3E] rounded-r-[12px] text-white">
            <div className="relative mx-[20px] [background:linear-gradient(180deg,rgb(106.75,19.15,249.69)_0%,rgba(82.99,22.79,209.54,0.65)_96.88%,rgba(82.22,22.91,208.25,0.64)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Inter-Black',Helvetica] font-black text-transparent text-[34px] tracking-[0] leading-[normal]">
              Trackit
            </div>
            <div>
              <div className="relative   [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[16px] tracking-[0] leading-[normal] whitespace-nowrap mb-6 ml-2 pt-[10px]">
                General
              </div>
              <div className="flex flex-col items-start justify-between gap-[15px] mb-4 relative ">
                <div className="flex  px-[20px] gap-[15px] relative">
                  <LayoutDashboard className="relative w-[16px] h-[16px] " />
                  <div className="relative [font-family:'Inter-Bold',Helvetica] font-bold text-[16px] tracking-[0] leading-[normal]">
                    Dashboard
                  </div>
                </div>
                <div className="flex gap-[15px] pb-[1.75px] px-[20px] relative">
                  <Users className="relative w-[16px] h-[16px]" />
                  <div className="relative mt-[2px] [font-family:'Inter-Bold',Helvetica] font-bold text-[16px] tracking-[0] leading-[normal]">
                    Groups
                  </div>
                </div>
                <div className=" items-start gap-[15px] px-[20px] flex relative">
                  <FileBarChart2 className="relative w-[16px] h-[16px]" />
                  <div className="relative mt-[2px] [font-family:'Inter-Bold',Helvetica] font-bold text-[16px] tracking-[0] leading-[normal]">
                    Reports
                  </div>
                </div>
                <div className=" items-start gap-[15px] px-[20px] flex relative">
                  <StickyNote className="relative w-[16px] h-[16px]" />
                  <div className="relative mt-[2px] [font-family:'Inter-Bold',Helvetica] font-bold text-[16px] tracking-[0] leading-[normal]">
                    Notes
                  </div>
                </div>
                <div className="flex items-start gap-[15px] px-[20px] relative mb-2">
                  <Cog className="relative w-[16px] h-[16px]" />
                  <div className="relative mt-[2px] [font-family:'Inter-Bold',Helvetica] font-bold text-[16px] tracking-[0] leading-[normal]">
                    Settings
                  </div>
                </div>
              </div>
            </div>
            <div className="relative w-[200px] h-[191px] ">
              <div className="relative  [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[16px] mt-6 tracking-[0] leading-[normal] ml-2 mb-4 ">
                Help &amp; Support
              </div>
              <div className="flex-col w-[170px] h-[120px] gap-[10px] relative flex items-start">
                <div className=" gap-[16px] relative px-[20px] flex items-start mt-[15px]">
                <BookOpenText className="relative w-[16px] h-[16px]" />
                  <div className=" relative [font-family:'Inter-Bold',Helvetica] font-bold text-[16px] tracking-[0] leading-[normal]">
                    Docs
                  </div>
                </div>
                <div className="flex  items-start gap-[16px] px-[20px] relative">
                <SmartphoneNfc className="relative w-[16px] h-[16px]" />
                  <div className="w-fit relative [font-family:'Inter-Bold',Helvetica] font-bold text-[16px] tracking-[0] leading-[normal]">
                    Contact Us
                  </div>
                </div>
                <div className=" gap-[16px] relative flex px-[20px] items-start">
                <MessageCircleHeart className="relative w-[16px] h-[16px]" />
                  <div className=" relative [font-family:'Inter-Bold',Helvetica] font-bold text-[16px] tracking-[0] leading-[normal]">
                    Feedback
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-[120px] h-[120px] items-center justify-center gap-[9px]  relative bg-[#d9d9d926] rounded-[20px] border border-solid border-[#f8f8f9] left-[25px]">
              <p className="relative [font-family:'Inter-Medium',Helvetica] font-medium text-[10px] text-center tracking-[0] leading-[normal]">
                Loving Trackit? Help us grow by buying us a coffee.
              </p>
              <Coffee className="relative w-[35px] h-[35px]"/>
            </div>
            <div className="flex flex-col w-[45px] h-[45px] items-start justify-center my-4 pl-[4px] relative bg-[#c32020] left-[65px] rounded-[100px]">
                <LogOut className="pl-[8px] relative"/>
            </div>
          </div>
        </Drawer.Content>
    </Drawer.Portal>
  </Drawer.Root>
  );
};


export default DrawerComp;


