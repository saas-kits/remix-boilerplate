import React from "react"

import { Logo } from "@/lib/brand/logo"

export default function Footer() {
  return (
    <div className="relative w-full border-t py-24">
      <div className="absolute left-0 right-0 top-[-1px] mx-auto h-px w-96 bg-gradient-to-r from-border via-gray-400 to-border opacity-40"></div>
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap">
          <div className="flex w-full flex-col sm:w-2/5">
            <div className="flex items-center space-x-2">
              <Logo className="h-6" />
            </div>
            <p className="mt-3 text-sm text-gray-700 dark:text-gray-400">
              476 Shantivan Soc. Rajkot, India
            </p>
          </div>
          <div className="mt-6 grid flex-grow grid-cols-3 gap-6 sm:mt-0 sm:grid-cols-3 lg:grid-cols-4">
            <div>
              <div>Links</div>
              <div className="mt-4 flex flex-col space-y-4">
                <a
                  className="text-sm text-gray-700 hover:underline dark:text-gray-400"
                  href="/#"
                >
                  Media
                </a>
                <a
                  className="text-sm text-gray-700 hover:underline dark:text-gray-400"
                  href="/#"
                >
                  Brand
                </a>
                <a
                  className="text-sm text-gray-700 hover:underline dark:text-gray-400"
                  href="/#"
                >
                  Subscribe
                </a>
              </div>
            </div>
            <div>
              <div>Links</div>
              <div className="mt-4 flex flex-col space-y-4">
                <a
                  className="text-sm text-gray-700 hover:underline dark:text-gray-400"
                  href="/#"
                >
                  Media
                </a>
                <a
                  className="text-sm text-gray-700 hover:underline dark:text-gray-400"
                  href="/#"
                >
                  Brand
                </a>
                <a
                  className="text-sm text-gray-700 hover:underline dark:text-gray-400"
                  href="/#"
                >
                  Subscribe
                </a>
              </div>
            </div>
            <div>
              <div>Links</div>
              <div className="mt-4 flex flex-col space-y-4">
                <a
                  className="text-sm text-gray-700 hover:underline dark:text-gray-400"
                  href="/#"
                >
                  Media
                </a>
                <a
                  className="text-sm text-gray-700 hover:underline dark:text-gray-400"
                  href="/#"
                >
                  Brand
                </a>
                <a
                  className="text-sm text-gray-700 hover:underline dark:text-gray-400"
                  href="/#"
                >
                  Subscribe
                </a>
              </div>
            </div>
            <div>
              <div>Links</div>
              <div className="mt-4 flex flex-col space-y-4">
                <a
                  className="text-sm text-gray-700 hover:underline dark:text-gray-400"
                  href="/#"
                >
                  Media
                </a>
                <a
                  className="text-sm text-gray-700 hover:underline dark:text-gray-400"
                  href="/#"
                >
                  Brand
                </a>
                <a
                  className="text-sm text-gray-700 hover:underline dark:text-gray-400"
                  href="/#"
                >
                  Subscribe
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
