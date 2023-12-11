import {
  CheckIcon,
  CreditCard,
  Database,
  Layers2Icon,
  MailIcon,
  SearchIcon,
  User2Icon,
} from "lucide-react";

export function FeatureSection() {
  return (
    <>
      <div>
        <div className="max-w-7xl mx-auto py-24 md:py-32 px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-left mt-16 text-4xl font-medium tracking-tight sm:text-5xl sm:leading-snug wrap-balance bg-gradient-to-br bg-black dark:from-white dark:to-[hsla(0,0%,100%,.5)] bg-clip-text text-transparent">
              SaaS kit with Batteries Included
            </h1>
            <p className="mt-6 text-base lg:text-lg leading-7 font-light text-gray-700 dark:text-gray-400 text-left wrap-balance">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic
              aliquid voluptas saepe maxime asperiores totam fuga assumenda iure
              repudiandae. Ab, ipsum vitae!
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-x-10 mt-16 gap-y-20">
            <div className="relative w-full rounded-3xl">
              <div className="h-12 w-12 flex justify-center items-center rounded-[7px] p-px bg-gradient-to-br bg-green-200 dark:from-green-600 dark:to-green-300">
                <div className="h-full w-full dark:bg-black flex items-center justify-center rounded-md">
                  <User2Icon className="text-green-600 dark:text-green-200" />
                </div>
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-700 dark:text-gray-300">
                Auth that just works
              </h3>
              <div className="mt-6 text-gray-700 dark:text-gray-400 space-y-4">
                <div className="flex space-x-2">
                  <CheckIcon />
                  <div>Email Password Auth</div>
                </div>
                <div className="flex space-x-2">
                  <CheckIcon />
                  <div>Lorem ipsum dolor sit amet.</div>
                </div>
                <div className="flex space-x-2">
                  <CheckIcon />
                  <div>Lorem ipsum dolor sit.</div>
                </div>
              </div>
            </div>
            <div className="relative w-full rounded-3xl">
              <div className="h-12 w-12 flex justify-center items-center rounded-[7px] p-px bg-gradient-to-br from-purple-400 to-purple-800 dark:from-purple-600 dark:to-purple-300">
                <div className="h-full w-full dark:bg-black flex items-center justify-center rounded-md">
                  <CreditCard className="text-purple-100 dark:text-purple-200" />
                </div>
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-700 dark:text-gray-300">
                Stripe Payments
              </h3>
              <div className="mt-6 text-gray-700 dark:text-gray-400 space-y-4">
                <div className="flex space-x-2">
                  <CheckIcon />
                  <div>Checkout and Billing</div>
                </div>
                <div className="flex space-x-2">
                  <CheckIcon />
                  <div>Webhooks for events</div>
                </div>
                <div className="flex space-x-2">
                  <CheckIcon />
                  <div>Monhtly and Annual Plans</div>
                </div>
              </div>
            </div>
            <div className="relative w-full rounded-3xl">
              <div className="h-12 w-12 flex justify-center items-center rounded-[7px] p-px bg-gradient-to-br from-cyan-400 to-cyan-800 dark:from-cyan-600 dark:to-cyan-300">
                <div className="h-full w-full  dark:bg-black flex items-center justify-center rounded-md">
                  <MailIcon className="text-cyan-200 dark:text-cyan-200" />
                </div>
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-700 dark:text-gray-300">
                Emails
              </h3>
              <div className="mt-6 text-gray-700 dark:text-gray-400 space-y-4">
                <div className="flex space-x-2">
                  <CheckIcon />
                  <div>Beautiful Mail Templates</div>
                </div>
                <div className="flex space-x-2">
                  <CheckIcon />
                  <div>Transactional Mails</div>
                </div>
                <div className="flex space-x-2">
                  <CheckIcon />
                  <div>DNS Setup</div>
                </div>
              </div>
            </div>
            <div className="relative w-full rounded-3xl">
              <div className="h-12 w-12 flex justify-center items-center rounded-[7px] p-px bg-gradient-to-br from-cyan-400 to-cyan-800 dark:from-cyan-600 dark:to-cyan-300">
                <div className="h-full w-full dark:bg-black flex items-center justify-center rounded-md">
                  <Database className="text-cyan-100 dark:text-cyan-200" />
                </div>
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-700 dark:text-gray-300">
                Database
              </h3>
              <div className="mt-6 text-gray-700 dark:text-gray-400 space-y-4">
                <div className="flex space-x-2">
                  <CheckIcon />
                  <div>Mongo Database</div>
                </div>
                <div className="flex space-x-2">
                  <CheckIcon />
                  <div>Prisma ORM</div>
                </div>
                <div className="flex space-x-2">
                  <CheckIcon />
                  <div>Postgres Database</div>
                </div>
              </div>
            </div>
            <div className="relative w-full rounded-3xl">
              <div className="h-12 w-12 flex justify-center items-center rounded-[7px] p-px bg-gradient-to-br from-fuchsia-400 to-fuchsia-800 dark:from-fuchsia-600 dark:to-fuchsia-300">
                <div className="h-full w-full dark:bg-black flex items-center justify-center rounded-md">
                  <SearchIcon className="text-fuchsia-100 dark:text-fuchsia-200" />
                </div>
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-700 dark:text-gray-300">
                SEO
              </h3>
              <div className="mt-6 text-gray-700 dark:text-gray-400 space-y-4">
                <div className="flex space-x-2">
                  <CheckIcon />
                  <div>Meta Tags</div>
                </div>
                <div className="flex space-x-2">
                  <CheckIcon />
                  <div>Og tags for social media</div>
                </div>
                <div className="flex space-x-2">
                  <CheckIcon />
                  <div>Sitemap generation</div>
                </div>
              </div>
            </div>
            <div className="relative w-full rounded-3xl">
              <div className="h-12 w-12 flex justify-center items-center rounded-[7px] p-px bg-gradient-to-br from-red-400 to-red-800 dark:from-red-600 dark:to-red-300">
                <div className="h-full w-full dark:bg-black flex items-center justify-center rounded-md">
                  <Layers2Icon className="text-red-100 dark:text-red-200" />
                </div>
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-700 dark:text-gray-300">
                Styles
              </h3>
              <div className="mt-6 text-gray-700 dark:text-gray-400 space-y-4">
                <div className="flex space-x-2">
                  <CheckIcon />
                  <div>Carefully crafted components</div>
                </div>
                <div className="flex space-x-2">
                  <CheckIcon />
                  <div>Dark mode support</div>
                </div>
                <div className="flex space-x-2">
                  <CheckIcon />
                  <div>Responsibe by default</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
