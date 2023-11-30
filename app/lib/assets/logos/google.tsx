import * as React from "react";
const GoogleLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 21 20"
    {...props}
  >
    <g clipPath="url(#a)">
      <path
        fill="#3F83F8"
        d="M20.308 10.23c0-.68-.055-1.363-.173-2.032h-9.432v3.851h5.402a4.63 4.63 0 0 1-2 3.039v2.499h3.223c1.893-1.742 2.98-4.314 2.98-7.357Z"
      />
      <path
        fill="#34A853"
        d="M10.702 20c2.697 0 4.971-.885 6.629-2.413l-3.223-2.5c-.897.61-2.054.956-3.402.956-2.61 0-4.821-1.76-5.615-4.126H1.766v2.576A10.001 10.001 0 0 0 10.702 20Z"
      />
      <path
        fill="#FBBC04"
        d="M5.089 11.917a5.99 5.99 0 0 1 0-3.829V5.512H1.767a10.009 10.009 0 0 0 0 8.98l3.322-2.575Z"
      />
      <path
        fill="#EA4335"
        d="M10.702 3.958a5.434 5.434 0 0 1 3.836 1.5l2.855-2.856A9.61 9.61 0 0 0 10.702.001a9.998 9.998 0 0 0-8.936 5.511l3.321 2.576c.79-2.37 3.006-4.13 5.615-4.13Z"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M.5 0h20v20H.5z" />
      </clipPath>
    </defs>
  </svg>
);
export default GoogleLogo;
