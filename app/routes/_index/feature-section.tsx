import {
  CheckCircle2Icon,
  CreditCard,
  Layers2Icon,
  MailIcon,
  SearchIcon,
  User2Icon,
} from "lucide-react";

export function FeatureSection() {
  return (
    <>
      <div>
        <div className="max-w-7xl mx-auto py:12 sm:py-24 px-6 lg:px-8">
          <h1 className="mt-16 text-4xl font-medium tracking-tight sm:text-5xl text-center wrap-balance">
            SaaS kit with{" "}
            <span className="bg-gradient-to-br from-yellow-500 to-orange-600 bg-clip-text text-transparent">
              Batteries Included
            </span>
          </h1>
          <p className="mt-6 text-base lg:text-lg leading-7 font-light text-gray-400 text-center wrap-balance">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic
            aliquid voluptas saepe maxime asperiores totam fuga assumenda iure
            repudiandae. Ab, ipsum vitae!
          </p>
          <div className="mx-auto mt-16 flex justify-center md:justify-center gap-2 md:gap-5 flex-wrap">
            <div className="flex flex-col min-w-[100px] md:min-w-[100px] items-center justify-center p-4 space-y-2 lg:col-span-1">
              <User2Icon color="currentColor" className="text-yellow-500" />
              <span className="text-yellow-500">Auth</span>
            </div>
            <div className="flex flex-col min-w-[100px] md:min-w-[100px] items-center justify-center p-4 space-y-2 lg:col-span-1">
              <MailIcon />
              <span>Emails</span>
            </div>
            <div className="flex flex-col min-w-[100px] md:min-w-[100px] items-center justify-center p-4 space-y-2 lg:col-span-1">
              <CreditCard />
              <span>Payments</span>
            </div>

            <div className="flex flex-col min-w-[100px] md:min-w-[100px] items-center justify-center p-4 space-y-2 lg:col-span-1">
              <SearchIcon />
              <span>SEO</span>
            </div>
            <div className="flex flex-col min-w-[100px] md:min-w-[100px] items-center justify-center p-4 space-y-2 lg:col-span-1">
              <Layers2Icon />
              <span>Styles</span>
            </div>
          </div>
        </div>
        <div className="w-full z-10">
          <div className="bg-gradient-to-b from-black to-[hsla(0, 0%, 100%, 0)] max-w-7xl mx-auto relative rounded-3xl border-t py-10 px-6">
            <div className="flex gap-8 md:gap-16 flex-wrap">
              <div className="bg-gray-300 h-80 w-1/2 rounded flex-grow md:flex-grow-0 order-2 md:order-1"></div>
              <div className="w-auto flex-grow order-1 md:order-2">
                <h1 className="text-2xl font-medium tracking-tight wrap-balance bg-gradient-to-br from-white to-[hsla(0,0%,100%,.5)] bg-clip-text text-transparent">
                  Painless Auth for Dev and users
                </h1>
                <div className="mt-6 space-y-4">
                  <div className="flex space-x-2 items-center">
                    <CheckCircle2Icon className="h-4 min-w-4" />
                    <p className="text-sm leading-7 font-light  text-center wrap-balance">
                      Email Password Login
                    </p>
                  </div>
                  <div className="flex space-x-2 items-center">
                    <CheckCircle2Icon className="h-4 min-w-4" />
                    <p className="text-sm leading-7 font-light  text-center wrap-balance">
                      Verify Email
                    </p>
                  </div>
                  <div className="flex space-x-2 items-center">
                    <CheckCircle2Icon className="h-4 min-w-4" />
                    <p className="text-sm leading-7 font-light  text-center wrap-balance">
                      Forgot Password / Reset Password
                    </p>
                  </div>
                  <div className="flex space-x-2 items-center">
                    <CheckCircle2Icon className="h-4 min-w-4" />
                    <p className="text-sm leading-7 font-light  text-center wrap-balance">
                      Social Login (Google)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
