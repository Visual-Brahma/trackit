"use client";
import { Drawer, DrawerContent, DrawerTrigger } from "@repo/ui/drawer";
import { SidebarNav, SidebarNavProps } from "./sidebar-nav";
import { Button } from "@repo/ui/button";
import { MenuIcon } from "lucide-react";
import { useState } from "react";

const Nav = ({ itemGroups }: SidebarNavProps) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <SidebarNav
        className="hidden md:block h-screen overflow-y-scroll"
        itemGroups={itemGroups}
      />
      <div className="block md:hidden">
        <Drawer open={open} onClose={() => setOpen(false)}>
          <DrawerTrigger asChild>
            <Button onClick={() => setOpen(true)}>
              <MenuIcon />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="h-[96%]">
            <SidebarNav
              drawer
              setDraweropen={setOpen}
              itemGroups={itemGroups}
              className="overflow-y-scroll"
            />
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};

export default Nav;
