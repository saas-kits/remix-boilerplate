import { themeSessionResolver } from "@/services/session.server"
import { createThemeAction } from "remix-themes"

export const action = createThemeAction(themeSessionResolver)
