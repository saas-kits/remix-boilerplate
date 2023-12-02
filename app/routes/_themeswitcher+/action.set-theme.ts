import { createThemeAction } from "remix-themes";
import { themeSessionResolver } from "~/services/session.server";

export const action = createThemeAction(themeSessionResolver);
