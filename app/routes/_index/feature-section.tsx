import {
  CheckIcon,
  CreditCard,
  Database,
  Layers2Icon,
  MailIcon,
  SearchIcon,
  User2Icon,
} from "lucide-react"

export function FeatureSection() {
  return (
    <>
      <div>
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="wrap-balance mt-16 bg-black bg-gradient-to-br bg-clip-text text-left text-4xl font-medium tracking-tight text-transparent dark:from-white dark:to-[hsla(0,0%,100%,.5)] sm:text-5xl sm:leading-snug">
              SaaS kit with Batteries Included
            </h1>
            <p className="wrap-balance mt-6 text-left text-base font-light leading-7 text-gray-700 dark:text-gray-400 lg:text-lg">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic
              aliquid voluptas saepe maxime asperiores totam fuga assumenda iure
              repudiandae. Ab, ipsum vitae!
            </p>
          </div>

          <div className="mt-16 grid gap-x-10 gap-y-20 sm:grid-cols-2 md:grid-cols-3">
            <div className="relative w-full rounded-3xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-[7px] bg-gray-200 bg-gradient-to-br p-px dark:from-green-600 dark:to-green-300">
                <div className="flex h-full w-full items-center justify-center rounded-md dark:bg-black">
                  <User2Icon className="text-gray-800 dark:text-green-200" />
                </div>
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-700 dark:text-gray-300">
                Auth that just works
              </h3>
              <div className="mt-6 space-y-4 text-gray-700 dark:text-gray-400">
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
              <div className="flex h-12 w-12 items-center justify-center rounded-[7px] bg-gray-200 bg-gradient-to-br p-px dark:from-purple-600 dark:to-purple-300">
                <div className="flex h-full w-full items-center justify-center rounded-md dark:bg-black">
                  <CreditCard className="text-gray-600 dark:text-purple-200" />
                </div>
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-700 dark:text-gray-300">
                Stripe Payments
              </h3>
              <div className="mt-6 space-y-4 text-gray-700 dark:text-gray-400">
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
              <div className="flex h-12 w-12 items-center justify-center rounded-[7px] bg-gray-200 bg-gradient-to-br p-px dark:from-cyan-600 dark:to-cyan-300">
                <div className="flex h-full  w-full items-center justify-center rounded-md dark:bg-black">
                  <MailIcon className="text-gray-600 dark:text-cyan-200" />
                </div>
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-700 dark:text-gray-300">
                Emails
              </h3>
              <div className="mt-6 space-y-4 text-gray-700 dark:text-gray-400">
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
              <div className="flex h-12 w-12 items-center justify-center rounded-[7px] bg-gray-200 bg-gradient-to-br p-px dark:from-cyan-600 dark:to-cyan-300">
                <div className="flex h-full w-full items-center justify-center rounded-md dark:bg-black">
                  <Database className="text-gray-600 dark:text-cyan-200" />
                </div>
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-700 dark:text-gray-300">
                Database
              </h3>
              <div className="mt-6 space-y-4 text-gray-700 dark:text-gray-400">
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
              <div className="flex h-12 w-12 items-center justify-center rounded-[7px] bg-gray-200 bg-gradient-to-br p-px dark:from-fuchsia-600 dark:to-fuchsia-300">
                <div className="flex h-full w-full items-center justify-center rounded-md dark:bg-black">
                  <SearchIcon className="text-gray-600 dark:text-fuchsia-200" />
                </div>
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-700 dark:text-gray-300">
                SEO
              </h3>
              <div className="mt-6 space-y-4 text-gray-700 dark:text-gray-400">
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
              <div className="flex h-12 w-12 items-center justify-center rounded-[7px] bg-gray-200 bg-gradient-to-br p-px dark:from-red-600 dark:to-red-300">
                <div className="flex h-full w-full items-center justify-center rounded-md dark:bg-black">
                  <Layers2Icon className="text-gray-600 dark:text-red-200" />
                </div>
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-700 dark:text-gray-300">
                Styles
              </h3>
              <div className="mt-6 space-y-4 text-gray-700 dark:text-gray-400">
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
  )
}
