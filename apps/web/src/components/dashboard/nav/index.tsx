import { Drawer, DrawerContent, DrawerTrigger } from "@repo/ui/drawer";
import { SidebarNav, SidebarNavProps } from "./sidebar-nav";
import { Button } from "@repo/ui/button";
import { MenuIcon } from "lucide-react";

const Nav=({ itemGroups }: SidebarNavProps) => {
    return (
        <div>
            <SidebarNav className="hidden lg:block h-screen overflow-y-scroll overflow-x-hidden" itemGroups={itemGroups} />
            <div className="block lg:hidden">
                <Drawer>
                    <DrawerTrigger asChild>
                        <Button>
                            <MenuIcon />
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                        <SidebarNav itemGroups={itemGroups} />
                    </DrawerContent>
                </Drawer>
            </div>
        </div>
    );
}

export default Nav;