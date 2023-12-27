import { cn } from "@/lib/utils"

type PricingCardProps = {
  children: React.ReactNode
  isFeatured?: boolean
}
export const PricingCard = ({ children, isFeatured }: PricingCardProps) => {
  return (
    <div
      className={cn("rounded-[13px] p-px", {
        "bg-gradient-to-b from-zinc-400 to-white dark:from-zinc-500 dark:to-black":
          isFeatured,
        "bg-gradient-to-b from-border to-white dark:to-black": !isFeatured,
      })}
    >
      <div className="relative h-full w-full rounded-xl bg-white p-6 pb-24 dark:bg-background">
        {children}
      </div>
    </div>
  )
}

type FeatureListContainerProps = {
  children: React.ReactNode
}

export const FeatureListContainer = ({
  children,
}: FeatureListContainerProps) => {
  return (
    <ul className="mt-8 space-y-3 text-sm leading-6 xl:mt-10">{children}</ul>
  )
}

export const CTAContainer = ({ children }: FeatureListContainerProps) => {
  return (
    <div className="absolute bottom-0 left-0 mx-6 mb-6 mt-8 w-[calc(100%-48px)]">
      {children}
    </div>
  )
}

type FeaturedBadgeContainerProps = {
  children: React.ReactNode
}

export const FeaturedBadgeContainer = ({children}: FeaturedBadgeContainerProps) => {
  return (
    <div className="absolute -top-2 left-0 flex h-4 w-full items-center justify-center text-sm">
      <span className="rounded-full bg-black px-4 py-1 text-xs font-semibold text-white dark:bg-white dark:text-black">{children}</span>
    </div>
  )
}
