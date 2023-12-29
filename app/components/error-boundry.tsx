import { useRouteError } from "@remix-run/react"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type Props = {
  renderError?: (error: unknown) => React.ReactNode
}

export const CommonErrorBoundary = ({ renderError }: Props) => {
  const error = useRouteError()

  // Capture error and send to Sentry if needed

  return (
    <>
      {renderError ? (
        renderError(error)
      ) : (
        <div className="p-4">
          <Alert variant="destructive">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Something went wrong. Please try refreshing page
            </AlertDescription>
          </Alert>
        </div>
      )}
    </>
  )
}
