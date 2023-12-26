import { createContext } from "react"

type SidebarContextType = {
  onNavLinkClick?: () => void
}

export const SidebarContext = createContext<SidebarContextType>({
  onNavLinkClick: () => null,
})
