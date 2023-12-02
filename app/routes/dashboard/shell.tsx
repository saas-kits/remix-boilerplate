import { Button } from "~/components/ui/button";
import { Sidebar } from "./sidebar";
import { UserNav } from "./user-nav";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";

type Props = {
  children: React.ReactNode;
};

export function Shell({ children }: Props) {
  return (
    <div className="h-full">
      <div className="flex h-full">
        <div className="bg-background w-72 border-r hidden md:block">
          <Sidebar />
        </div>
        <div className="flex-grow">
          <div className="h-14 border-b w-full flex justify-between md:justify-end px-4 items-center">
            <Button variant="ghost">
              <HamburgerMenuIcon />
            </Button>

            <UserNav />
          </div>

          {/* content */}
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
