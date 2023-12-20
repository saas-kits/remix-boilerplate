import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { UserNav } from "./user-nav";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { SidebarContext } from "./sidebar.context";
import { ThemeToggle } from "./theme-toggle";

type Props = {
  children: React.ReactNode;
};

export function Shell({ children }: Props) {
  const [hamMenuOpen, setHamMenuOpen] = useState(false);

  const closeHamMenu = () => {
    setHamMenuOpen(false);
  };

  return (
    <div className="h-full">
      <div className="flex h-full">
        <div className="bg-background w-72 border-r hidden md:block">
          <Sidebar />
        </div>
        <div className="flex-grow">
          <div className="h-14 border-b w-full flex justify-between md:justify-end px-4 items-center">
            <div className="flex items-center md:hidden">
              <Sheet open={hamMenuOpen} onOpenChange={setHamMenuOpen}>
                <SheetTrigger>
                  <HamburgerMenuIcon height={18} width={18} />
                </SheetTrigger>
                <SheetContent side="left" className="px-2">
                  <SidebarContext.Provider
                    value={{ onNavLinkClick: closeHamMenu }}
                  >
                    <Sidebar />
                  </SidebarContext.Provider>
                </SheetContent>
              </Sheet>
            </div>

            <div className="flex space-x-2 items-center">
              <UserNav />
              <ThemeToggle />
            </div>
          </div>

          {/* content */}
          <div className="p-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
