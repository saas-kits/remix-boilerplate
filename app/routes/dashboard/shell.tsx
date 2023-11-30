// import { BRAND_ASSETS } from "~/lib/brand/assets";
// import { brandConfig } from "~/lib/brand/config";
import { Sidebar } from "./sidebar";

export function Shell() {
  return (
    <div className="h-full">
      <div className="flex h-full">
        {/* <div className="w-72 h-full bg-zinc-800">
          {BRAND_ASSETS[brandConfig.default_logo]}
        </div> */}

        <div className="bg-background w-72 border-r">
          <Sidebar />
        </div>
        <div className="flex-grow">
          <div className="h-14 border-b w-full"></div>
        </div>
      </div>
    </div>
  );
}
