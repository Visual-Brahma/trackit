import { Drawer, DrawerContent, DrawerTrigger } from "@repo/ui/drawer";
import { SidebarNav, SidebarNavProps } from "./sidebar-nav";
import { Button } from "@repo/ui/button";
import { MenuIcon } from "lucide-react";

const Nav=({ itemGroups }: SidebarNavProps) => {
    return (
        <div>
            <SidebarNav className="hidden md:block h-screen overflow-y-scroll" itemGroups={itemGroups} />
            <div className="block md:hidden">
                <Drawer>
                    <DrawerTrigger asChild>
                        <Button>
                            <MenuIcon />
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent className="h-[96%]" >
                        <SidebarNav itemGroups={itemGroups} className="overflow-y-scroll"/>
                    </DrawerContent>
                </Drawer>
            </div>
        </div>
    );
}

export default Nav;