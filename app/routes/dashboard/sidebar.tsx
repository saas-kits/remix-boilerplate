import { useContext } from "react"
import { NavLink } from "@remix-run/react"
import { CreditCard, Globe, Layers2 } from "lucide-react"

import { Logo } from "@/lib/brand/logo"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import { SidebarContext } from "./sidebar.context"

type SidebarProps = {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn("relative h-full pb-12", className)}>
      <div className="flex h-14 items-center space-x-2 border-b px-5">
        {/* TODO: drive this logo using brand config */}
        <Logo className="h-5" />
      </div>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <NavigationLink to="/dashboard">
              <Layers2 className="mr-2 h-4 w-4" />
              Dashboard
            </NavigationLink>
            <NavigationLink to="test">
              <Globe className="mr-2 h-4 w-4" />
              Analytics
            </NavigationLink>
            <NavigationLink to="plans">
              <CreditCard className="mr-2 h-4 w-4" />
              Billing
            </NavigationLink>
          </div>
        </div>
      </div>
    </div>
  )
}

type NavigationLinkProps = {
  to: string
  children: React.ReactNode
}

const NavigationLink = ({ to, children }: NavigationLinkProps) => {
  const { onNavLinkClick } = useContext(SidebarContext)
  return (
    <NavLink
      to={to}
      className="block cursor-pointer"
      end
      onClick={() => {
        onNavLinkClick?.()
      }}
    >
      {({ isActive }) => (
        <Button
          variant="ghost"
          className={cn("w-full justify-start", {
            "bg-zinc-100 font-semibold dark:bg-zinc-900": isActive,
          })}
        >
          {children}
        </Button>
      )}
    </NavLink>
  )
}
