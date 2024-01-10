
import React from "react";
import { LayoutDashboard, Users, FileBarChart2, StickyNote, Cog, BookOpenText, SmartphoneNfc, MessageCircleHeart, Coffee, LogOut } from 'lucide-react';

export const SideNav = () => {
  return (
  
      <div className="bg-[#2A2D3E] rounded-r-[12px] text-white w-[220px] h-[100%]">
        <div className="relative mx-12 [background:linear-gradient(180deg,rgb(106.75,19.15,249.69)_0%,rgba(82.99,22.79,209.54,0.65)_96.88%,rgba(82.22,22.91,208.25,0.64)_100%)]  bg-clip-text  [font-family:'Inter-Black',Helvetica] font-black text-transparent text-[42px] mb-6 tracking-[0] leading-[normal]">
          Trackit
        </div>
        <div>
          <div className="relative mx-4 mt-2 mb-4 [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[22px] tracking-[0] leading-[normal] whitespace-nowrap mb-6">
            General
          </div>
          <div className="flex flex-col justify-between gap-[15px] relative ">
            <div className="flex gap-[18px] relative ml-6">
              <LayoutDashboard className='relative w-[16px] h-[16px]' />
              <div className="relative  [font-family:'Inter-Bold',Helvetica] font-bold text-[18px] tracking-[0] leading-[normal]">
                Dashboard
              </div>
            </div>
            <div className="flex gap-[18px] px-0 relative ml-6">
              <Users className='relative w-[16px] h-[16px]' />
              <div className="relative [font-family:'Inter-Bold',Helvetica] font-bold text-[18px] tracking-[0] leading-[normal]">
                Groups
              </div>
            </div>
            <div className=" gap-[18px] flex relative ml-6">
              <FileBarChart2 className='relative w-[16px] h-[16px]' />
              <div className="relative [font-family:'Inter-Bold',Helvetica] font-bold text-[18px] tracking-[0] leading-[normal]">
                Reports
              </div>
            </div>
            <div className=" gap-[18px] flex relative ml-6">
              <StickyNote className='relative w-[16px] h-[16px]' />
              <div className="relative [font-family:'Inter-Bold',Helvetica] font-bold text-[18px] tracking-[0] leading-[normal]">
                Notes
              </div>
            </div>
            <div className="flex gap-[18px] relative ml-6 mb-6">
              <Cog className='relative w-[16px] h-[16px]' />
              <div className="relative [font-family:'Inter-Bold',Helvetica] font-bold text-[18px] tracking-[0] leading-[normal]">
                Settings
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="relative [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[22px] px-4 tracking-[0] leading-[normal] mb-4">
            Help &amp; Support
          </div>
          <div className="flex-col justify-end gap-[10px] relative flex">
            <div className=" gap-[16px] relative flex ml-6 ">
              <BookOpenText className='relative w-[16px] h-[16px]' />
              <div className=" relative [font-family:'Inter-Bold',Helvetica] font-bold text-[18px] tracking-[0] leading-[normal]">
                Docs
              </div>
            </div>
            <div className="flex  items-start gap-[16px] relative ml-6">
              <SmartphoneNfc className='relative w-[16px] h-[16px]' />
              <div className="  relative [font-family:'Inter-Bold',Helvetica] font-bold text-[18px] tracking-[0] leading-[normal]">
                Contact Us
              </div>
            </div>
            <div className=" gap-[16px] relative flex items-start ml-6">
              <MessageCircleHeart className='relative w-[16px] h-[16px]' />
              <div className="relative [font-family:'Inter-Bold',Helvetica] font-bold text-[18px] tracking-[0] leading-[normal]">
                Feedback
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-[180px] h-[180px] items-center justify-center gap-[9px] pl-[16px] pr-[17px] py-[16.41px] relative bg-[#d9d9d926] rounded-[20px] border mx-[22.5px] mb-5 mt-4 border-solid border-[#f8f8f9]">
          <Coffee className="relative w-[35px] h-[35px]" />
          <p className="relative w-[180px] [font-family:'Inter-Medium',Helvetica] font-medium text-[18px] text-center tracking-[0] leading-[normal]">
            Loving Trackit? Help us grow by buying us a coffee.
          </p>
          <div className="flex-col w-[140px] items-center justify-center bg-[#6a13f9] rounded-[10px] flex relative">
            <div className="relative w-[110px] h-[30px] [font-family:'Inter-Bold',Helvetica] font-bold text-[16px] text-center tracking-[0] leading-[normal] py-2">
              Buy a Coffee
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start px-[18px] py-0 relative   rounded-[10px] mx-[28px] mb-12">
          <div className="flex items-center gap-[12px] h-[34px] relative bg-[#c32020]  rounded-[10px] ">
            <LogOut className="w-[20px] h-[20px] ml-[14px] relative" />
            <div className="w-fit relative [font-family:'Inter-Bold',Helvetica] font-bold text-white text-[18px] tracking-[0] leading-[normal] pr-[15px]">
              Log out
            </div>
          </div>
        </div>
      </div>
  

  );
};



export default SideNav;
