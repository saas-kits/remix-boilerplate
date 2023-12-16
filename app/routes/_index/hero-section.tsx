import { Button } from "~/components/ui/button";
import { SocialProof } from "./social-proof";
import { Discountbadge } from "./discount-badge";

export function HeroSection() {
  return (
    <div className="relative flex flex-col justify-center items-center min-h-[70vh] pb-12 pt-12 md:pt-0">
      <nav className="h-14 w-full absolute z-20 left-0 top-0 ">
        <div className="flex justify-between h-full mx-auto max-w-7xl px-6 items-center">
          <div className="flex space-x-2 items-center">
            <svg
              id="logo-36"
              className="h-6 w-6"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.9523 11.0726C18.5586 7.69873 18.1429 4.13644 18.1429 0H21.8571C21.8571 4.08998 21.4434 7.64774 21.0502 11.0254C20.7299 13.778 20.4235 16.411 20.3666 19.115C22.2316 17.1697 23.863 15.107 25.572 12.9463C27.6791 10.2823 29.9043 7.46945 32.829 4.54464L35.4554 7.17104C32.5633 10.0631 29.7547 12.2861 27.0884 14.3966L27.0859 14.3985C24.9141 16.1178 22.8365 17.7624 20.885 19.6334C23.579 19.5765 26.1911 19.2717 28.9272 18.9524C32.3011 18.5586 35.8636 18.1429 40 18.1429V21.8571C35.9102 21.8571 32.3524 21.4432 28.9749 21.0502L28.9724 21.05C26.2204 20.7298 23.5882 20.4236 20.885 20.3666C22.829 22.2302 24.8906 23.8609 27.0499 25.5687L27.0533 25.5716C29.7174 27.6789 32.5304 29.9039 35.4554 32.829L32.829 35.4554C29.9369 32.5634 27.714 29.755 25.6038 27.0889L25.5988 27.082L25.5946 27.0765C23.8775 24.9081 22.2349 22.8338 20.3666 20.885C20.4235 23.589 20.7299 26.222 21.0502 28.9746C21.4434 32.3523 21.8571 35.91 21.8571 40H18.1429C18.1429 35.8636 18.5586 32.3013 18.9523 28.9274L18.9531 28.9219C19.272 26.1877 19.5765 23.5772 19.6334 20.885C17.7651 22.8338 16.1225 24.9081 14.4054 27.0765L14.4012 27.082L14.3962 27.0889C12.286 29.755 10.0631 32.5634 7.17104 35.4554L4.54464 32.829C7.46959 29.9039 10.2826 27.6789 12.9467 25.5716L12.9501 25.5687C15.1094 23.8609 17.171 22.2302 19.115 20.3666C16.411 20.4237 13.7779 20.73 11.0251 21.0502C7.6476 21.4432 4.08984 21.8571 0 21.8571V18.1429C4.13644 18.1429 7.69894 18.5586 11.0728 18.9524C13.8089 19.2717 16.421 19.5765 19.115 19.6334C17.1627 17.7617 15.0843 16.1166 12.9116 14.3966C10.2453 12.2861 7.43666 10.0631 4.54464 7.17104L7.17104 4.54464C10.0957 7.46945 12.3209 10.2823 14.428 12.9463C16.137 15.1069 17.7684 17.1696 19.6334 19.1148C19.5765 16.4227 19.272 13.8123 18.9531 11.0781L18.9523 11.0726Z"
                fill="currentColor"
              ></path>
            </svg>
            <span className="font-medium text-lg">RemixKits</span>
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
                className="stroke-current text-border dark:text-[hsla(259, 0%, 100%, 0.08)]"
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

        <div className="mx-auto w-full max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-36 flex justify-start">
          <div className="mx-auto max-w-7xl lg:max-w-3xl lg:pt-8 justify-start">
            <div className="flex justify-center mt-16">
              <Discountbadge />
            </div>
            <h1 className="mt-6 text-4xl font-medium tracking-tight sm:text-6xl leading-tight sm:leading-[1.15] text-center wrap-balance bg-gradient-to-br bg-black dark:from-white dark:to-[hsla(0,0%,100%,.5)] bg-clip-text text-transparent">
              Launch SaaS in Days not in months
            </h1>
            <p className="mt-6 text-lg leading-7 font-light text-gray-700 dark:text-gray-400 text-center wrap-balance">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rerum
              quisquam, iusto voluptatem dolore voluptas non laboriosam soluta
              quos quod eos! Sapiente archit
            </p>
            <div className="mt-10 flex items-center gap-x-6 justify-center">
              <Button size="lg" className="px-16">
                Get started
              </Button>
            </div>
            <div className="flex justify-center mt-6">
              <SocialProof />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
