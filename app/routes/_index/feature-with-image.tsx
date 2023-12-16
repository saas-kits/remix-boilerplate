import { CheckIcon } from "lucide-react";
import { cn } from "~/lib/utils";

type Props = {
  features: string[];
  title: string;
  imagePosition?: "left" | "right";
  lightFeatureImage: string;
  darkFeatureImage: string;
};

export default function FeatureWithImage({
  features,
  title,
  imagePosition = "right",
  lightFeatureImage,
  darkFeatureImage,
}: Props) {
  return (
    <div>
      <div className="overflow-hidden py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 items-center"> */}
          <div className="mx-auto flex flex-wrap items-center max-w-2xl lg:max-w-none">
            <div
              className={cn("flex-grow w-full lg:w-[calc(50%-64px)]", {
                "lg:order-1": imagePosition === "right",
                "lg:order-2": imagePosition === "left",
              })}
            >
              <div className="lg:max-w-lg">
                <h1 className="text-4xl font-medium sm:text-5xl leading-tight sm:leading-tight tracking-tight text-left wrap-balance bg-gradient-to-br bg-black dark:from-white dark:to-[hsla(0,0%,100%,.5)] bg-clip-text text-transparent">
                  {title}
                </h1>

                <div className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-700 dark:text-gray-400 lg:max-w-none">
                  {features.map((feature) => (
                    <div
                      className="flex space-x-0 md:space-x-2 items-start text-gray-700 dark:text-gray-400"
                      key={feature}
                    >
                      <CheckIcon className="mt-[2px] min-w-max hidden md:block" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <img
              src={darkFeatureImage}
              alt="Product screenshot"
              className={cn(
                "hidden dark:block border w-full mt-16 lg:mt-0 lg:w-1/2 h-auto rounded-xl",
                {
                  "lg:order-1 lg:mr-16": imagePosition === "left",
                  "lg:order-2 lg:ml-16": imagePosition === "right",
                }
              )}
            />
            <img
              src={lightFeatureImage}
              alt="Product screenshot"
              className={cn(
                "block dark:hidden border w-full mt-16 lg:mt-0 lg:w-1/2 h-auto rounded-xl",
                {
                  "lg:order-1 lg:mr-16": imagePosition === "left",
                  "lg:order-2 lg:ml-16": imagePosition === "right",
                }
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
