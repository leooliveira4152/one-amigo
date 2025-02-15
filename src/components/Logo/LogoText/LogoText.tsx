import { SVGProps } from "react";

export enum LogoTextTestIds {
  SVG = "logo-text-svg",
  GROUP = "logo-text-group",
}

function LogoText() {
  return (
    <g data-testid={LogoTextTestIds.GROUP}>
      <path
        fill="#fff"
        strokeWidth={0}
        d="M115.12,863.96c0-29.47,21.65-51.12,52.32-51.12s52.32,21.65,52.32,51.12-21.65,51.12-52.32,51.12-52.32-21.65-52.32-51.12ZM195.11,863.96c0-16.54-10.98-28.57-27.66-28.57s-27.66,12.03-27.66,28.57,10.98,28.57,27.66,28.57,27.66-12.03,27.66-28.57Z"
      />
      <path
        fill="#fff"
        strokeWidth={0}
        d="M232.69,854.19c0-25.41,15.03-41.34,42.1-41.34s42.1,15.94,42.1,41.34v58.94h-24.36v-58.94c0-12.03-5.71-18.79-17.74-18.79s-17.74,6.77-17.74,18.79v58.94h-24.36v-58.94Z"
      />
      <path
        fill="#fff"
        strokeWidth={0}
        d="M334.78,814.8h72.62v22.55h-48.26v16.09h39.54v19.54h-39.54v17.59h48.26v22.55h-72.62v-98.33Z"
      />
      <path
        fill="#fff"
        strokeWidth={0}
        d="M461.97,856c0-26.76,15.19-43.15,43.15-43.15s43.45,16.39,43.45,43.15v57.13h-24.36v-27.96h-38.49v27.96h-23.75v-57.13ZM524.21,864.12v-8.12c0-13.53-5.86-20.6-19.24-20.6s-19.24,7.07-19.24,20.6v8.12h38.49Z"
      />
      <path
        fill="#fff"
        strokeWidth={0}
        d="M564.21,850.88c0-26.31,15.33-38.04,35.18-38.04,11.88,0,21.35,4.66,27.21,13.53,5.86-8.87,15.33-13.53,27.21-13.53,19.84,0,35.18,11.73,35.18,38.04v62.24h-24.36v-62.24c0-11.43-5.56-15.49-12.93-15.49s-12.93,4.06-12.93,15.49v62.24h-24.36v-62.24c0-11.43-5.71-15.49-12.93-15.49s-12.93,4.06-12.93,15.49v62.24h-24.36v-62.24Z"
      />
      <path fill="#fff" strokeWidth={0} d="M706.88,814.8h24.36v98.33h-24.36v-98.33Z" />
      <path
        fill="#fff"
        strokeWidth={0}
        d="M746.42,863.96c0-29.47,21.65-51.12,52.32-51.12,24.51,0,43.45,13.83,49.92,34.58h-26.76c-4.66-7.52-12.78-12.03-23.15-12.03-16.69,0-27.66,12.03-27.66,28.57s10.97,28.57,27.66,28.57c12.33,0,21.05-4.96,25.56-14.58h-31.57v-19.54h58.18v10.67c-2.41,26.76-23.3,46-52.17,46-30.67,0-52.32-21.65-52.32-51.12Z"
      />
      <path
        fill="#fff"
        strokeWidth={0}
        d="M860.23,863.96c0-29.47,21.65-51.12,52.32-51.12s52.32,21.65,52.32,51.12-21.65,51.12-52.32,51.12-52.32-21.65-52.32-51.12ZM940.22,863.96c0-16.54-10.97-28.57-27.66-28.57s-27.66,12.03-27.66,28.57,10.97,28.57,27.66,28.57,27.66-12.03,27.66-28.57Z"
      />
    </g>
  );
}

export function LogoTextWrapper({
  svgElement = true,
  ...props
}: SVGProps<SVGSVGElement> & { svgElement?: boolean }) {
  if (!svgElement) return <LogoText />;
  return (
    <svg
      data-testid={LogoTextTestIds.SVG}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="100 795 880 135"
      {...props}
    >
      <LogoText />
    </svg>
  );
}
