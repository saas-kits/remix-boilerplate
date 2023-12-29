import { Logo } from "@/lib/brand/logo"
import { Button } from "@/components/ui/button"

import { Discountbadge } from "./discount-badge"
import { SocialProof } from "./social-proof"

export function HeroSection() {
  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center pb-12 pt-12 md:pt-0">
      <nav className="absolute left-0 top-0 z-20 h-14 w-full ">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
          <div className="flex items-center space-x-2">
            <Logo className="h-5" />
          </div>
          <div className="space-x-2">
            <Button variant="link">Pricing</Button>
            <Button variant="link">Demo</Button>
          </div>
        </div>
      </nav>
      <div className="relative isolate overflow-hidden bg-background">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="fixed inset-0 -z-10 h-full w-full [mask-image:radial-gradient(100%_100%_at_top_right,black,transparent)] dark:[mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
        >
          <defs>
            <pattern
              id="a"
              width={20}
              height={20}
              patternTransform="scale(10)"
              patternUnits="userSpaceOnUse"
            >
              <rect width="100%" height="100%" fill="hsla(0, 0%, 100%, 0)" />
              <path
                fill="none"
                stroke="hsla(259, 0%, 100%, 0.08)"
                strokeWidth={0.1}
                d="M10 0v20ZM0 10h20Z"
                className="dark:text-[hsla(259, 0%, 100%, 0.08)] stroke-current text-border"
              />
            </pattern>
          </defs>
          <rect
            width="800%"
            height="800%"
            fill="url(#a)"
            transform="translate(-108)"
          />
        </svg>

        <div className="mx-auto flex w-full max-w-7xl justify-start px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-36">
          <div className="mx-auto max-w-7xl justify-start lg:max-w-3xl lg:pt-8">
            <div className="mt-16 flex justify-center">
              <Discountbadge />
            </div>
            <h1 className="wrap-balance mt-6 bg-black bg-gradient-to-br bg-clip-text text-center text-4xl font-medium leading-tight tracking-tight text-transparent dark:from-white dark:to-[hsla(0,0%,100%,.5)] sm:text-6xl sm:leading-[1.15]">
              Launch SaaS in Days not in months
            </h1>
            <p className="wrap-balance mt-6 text-center text-lg font-light leading-7 text-gray-700 dark:text-gray-400">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rerum
              quisquam, iusto voluptatem dolore voluptas non laboriosam soluta
              quos quod eos! Sapiente archit
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" className="px-16">
                Get started
              </Button>
            </div>
            <div className="mt-6 flex justify-center">
              <SocialProof />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
