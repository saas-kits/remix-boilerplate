import { Outlet } from "@remix-run/react";
import { BRAND_ASSETS } from "~/lib/brand/assets";
import { brandConfig } from "~/lib/brand/config";

export default function Layout() {
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm flex justify-center flex-col items-center">
          {BRAND_ASSETS[brandConfig.default_logo]}
          <Outlet />
        </div>
      </div>
    </>
  );
}
