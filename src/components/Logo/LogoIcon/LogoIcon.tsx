import { SVGProps } from "react";

export enum LogoIconTestIds {
  SVG = "logo-icon-svg",
  DEFS = "logo-icon-defs",
  GROUP = "logo-icon-group",
}

enum GradientIds {
  LARGE_RING = "large-ring",
  SMALL_RING_INNER = "small-ring-inner",
  SMALL_RING_OUTER = "small-ring-outer",
  SMALL_PLANET = "small-planet",
  LARGE_STAR = "large-star",
  MEDIUM_STAR = "medium-star",
  SMALL_STAR = "small-star",
}

function LogoIcon() {
  return (
    <>
      <defs data-testid={LogoIconTestIds.DEFS}>
        <linearGradient
          id={GradientIds.SMALL_RING_INNER}
          x1="828.59"
          y1="367.78"
          x2="404"
          y2="321"
          gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#d363d3" />
          <stop offset=".04" stop-color="#c75cce" />
          <stop offset=".16" stop-color="#a94bc4" />
          <stop offset=".28" stop-color="#943ebd" />
          <stop offset=".4" stop-color="#8737b8" />
          <stop offset=".51" stop-color="#8335b7" />
          <stop offset="1" stop-color="#ca5dd0" />
        </linearGradient>
        <linearGradient
          id={GradientIds.SMALL_RING_OUTER}
          x1="801.4"
          y1="626.46"
          x2="912.94"
          y2="232.46"
          gradientUnits="userSpaceOnUse">
          <stop offset=".27" stop-color="#d363d3" />
          <stop offset=".3" stop-color="#be56cb" />
          <stop offset=".34" stop-color="#a84ac4" />
          <stop offset=".38" stop-color="#9740be" />
          <stop offset=".44" stop-color="#8b39ba" />
          <stop offset=".51" stop-color="#8436b7" />
          <stop offset=".73" stop-color="#d363d3" />
        </linearGradient>
        <linearGradient
          id={GradientIds.SMALL_PLANET}
          x1="429.28"
          y1="704.08"
          x2="429.28"
          y2="737.02"
          gradientUnits="userSpaceOnUse">
          <stop offset=".11" stop-color="#8335b7" />
          <stop offset=".3" stop-color="#8e3bbb" />
          <stop offset=".66" stop-color="#ae4dc6" />
          <stop offset="1" stop-color="#d363d3" />
        </linearGradient>
        <linearGradient
          id={GradientIds.LARGE_STAR}
          x1="673.94"
          y1="113.59"
          x2="671.43"
          y2="217.63"
          gradientUnits="userSpaceOnUse">
          <stop offset=".34" stop-color="#6822b0" />
          <stop offset=".52" stop-color="#8c38bc" />
          <stop offset=".73" stop-color="#b24fc8" />
          <stop offset=".89" stop-color="#ca5dd0" />
          <stop offset="1" stop-color="#d363d3" />
        </linearGradient>
        <linearGradient
          id={GradientIds.SMALL_STAR}
          x1="737.82"
          y1="198.64"
          x2="737.41"
          y2="240.24"
          gradientUnits="userSpaceOnUse">
          <stop offset=".22" stop-color="#8335b7" />
          <stop offset=".23" stop-color="#8335b7" />
          <stop offset=".57" stop-color="#ae4dc6" />
          <stop offset=".84" stop-color="#c95dcf" />
          <stop offset="1" stop-color="#d363d3" />
        </linearGradient>
        <linearGradient
          id={GradientIds.MEDIUM_STAR}
          x1="794.06"
          y1="584.02"
          x2="794.47"
          y2="633.69"
          gradientUnits="userSpaceOnUse">
          <stop offset=".34" stop-color="#8335b7" />
          <stop offset=".41" stop-color="#9e44c0" />
          <stop offset=".49" stop-color="#b552c8" />
          <stop offset=".58" stop-color="#c65bce" />
          <stop offset=".68" stop-color="#cf61d1" />
          <stop offset=".8" stop-color="#d363d3" />
        </linearGradient>
        <linearGradient
          id={GradientIds.LARGE_RING}
          x1="893.58"
          y1="460.35"
          x2="101.97"
          y2="442.36"
          gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#5810b0" />
          <stop offset=".13" stop-color="#7624b8" />
          <stop offset=".4" stop-color="#c257ce" />
          <stop offset=".46" stop-color="#d363d3" />
          <stop offset=".52" stop-color="#cf61d1" />
          <stop offset=".57" stop-color="#c55cce" />
          <stop offset=".62" stop-color="#b454c7" />
          <stop offset=".67" stop-color="#9d48bf" />
          <stop offset=".71" stop-color="#813bb5" />
          <stop offset=".77" stop-color="#722bb3" />
          <stop offset=".84" stop-color="#5810b0" />
        </linearGradient>
      </defs>
      <g data-testid={LogoIconTestIds.GROUP}>
        <path
          fill={`url(#${GradientIds.SMALL_RING_OUTER})`}
          strokeWidth={0}
          d="M776.13,558.8l11.99-30.29s86.06-26.69,88.76-77.36c-.9-42.88-58.47-65.67-58.47-65.67l11.99-19.79s94.45,45.28,62.37,115.44c0,0-20.69,43.78-116.64,77.66Z"
        />
        <path
          fill="#fff"
          strokeWidth={0}
          d="M751.85,368.69c3.36,9.24,6.14,18.76,8.3,28.51,5.19-6.52,10.02-12.97,14.51-19.38-6.55-3.35-14.23-6.39-22.8-9.14Z"
        />
        <circle fill="#fff" strokeWidth={0} cx="568.24" cy="491.29" r="13.94" />
        <circle fill="#fff" strokeWidth={0} cx="524.41" cy="646.89" r="7.87" />
        <circle fill="#fff" strokeWidth={0} cx="506.82" cy="261.48" r="7.87" />
        <circle
          fill={`url(#${GradientIds.SMALL_PLANET})`}
          strokeWidth={0}
          cx="429.28"
          cy="720.55"
          r="16.47"
        />
        <path
          fill={`url(#${GradientIds.LARGE_STAR})`}
          strokeWidth={0}
          d="M673.93,124.38l6.99,18.88c1.76,4.74,5.5,8.49,10.24,10.24l18.88,6.99c1.06.39,1.06,1.89,0,2.29l-18.88,6.99c-4.74,1.76-8.49,5.5-10.24,10.24l-6.99,18.88c-.39,1.06-1.89,1.06-2.29,0l-6.99-18.88c-1.76-4.74-5.5-8.49-10.24-10.24l-18.88-6.99c-1.06-.39-1.06-1.89,0-2.29l18.88-6.99c4.74-1.76,8.49-5.5,10.24-10.24l6.99-18.88c.39-1.06,1.89-1.06,2.29,0Z"
        />
        <path
          fill={`url(#${GradientIds.SMALL_STAR})`}
          strokeWidth={0}
          d="M738.04,204.32l3.01,8.13c.65,1.76,2.04,3.14,3.79,3.79l8.13,3.01c.39.15.39.7,0,.85l-8.13,3.01c-1.76.65-3.14,2.04-3.79,3.79l-3.01,8.13c-.15.39-.7.39-.85,0l-3.01-8.13c-.65-1.76-2.04-3.14-3.79-3.79l-8.13-3.01c-.39-.15-.39-.7,0-.85l8.13-3.01c1.76-.65,3.14-2.04,3.79-3.79l3.01-8.13c.15-.39.7-.39.85,0Z"
        />
        <path
          fill={`url(#${GradientIds.MEDIUM_STAR})`}
          strokeWidth={0}
          d="M794.7,586.58l5.07,13.71c.65,1.76,2.04,3.14,3.79,3.79l13.71,5.07c.39.15.39.7,0,.85l-13.71,5.07c-1.76.65-3.14,2.04-3.79,3.79l-5.07,13.71c-.15.39-.7.39-.85,0l-5.07-13.71c-.65-1.76-2.04-3.14-3.79-3.79l-13.71-5.07c-.39-.15-.39-.7,0-.85l13.71-5.07c1.76-.65,3.14-2.04,3.79-3.79l5.07-13.71c.15-.39.7-.39.85,0Z"
        />
        <path
          fill={`url(#${GradientIds.LARGE_RING})`}
          strokeWidth={0}
          d="M855.59,249.13c0-17.53-14.21-31.75-31.75-31.75s-31.75,14.21-31.75,31.75,14.21,31.75,31.75,31.75c.08,0,.15-.01.23-.01-13.5,151-277.63,304.58-277.63,304.58-241.68,131.58-283.66,61.45-283.66,61.45-35.98-32.46,23.36-116.24,23.36-116.24l-6.57-31.21c-85.16,122.34-35.38,162.52-35.38,162.52,75.56,80.96,301.05-48.18,301.05-48.18,315.04-197.82,304.15-328.86,301.89-343.13,5.23-5.66,8.45-13.2,8.45-21.52ZM803.63,249.13c0-11.17,9.05-20.22,20.22-20.22s20.22,9.05,20.22,20.22-9.05,20.22-20.22,20.22-20.22-9.05-20.22-20.22Z"
        />
        <path
          fill={`url(#${GradientIds.SMALL_RING_INNER})`}
          strokeWidth={0}
          d="M490.47,312.33v.74c-5.47-14.79-19.69-25.33-36.38-25.33-21.42,0-38.78,17.36-38.78,38.78s17.36,38.78,38.78,38.78c19.03,0,34.85-13.72,38.14-31.8,20.49-.17,217.61-.8,286.5,36.8l13.59-20.79s-112.34-47.18-301.85-37.18ZM454.09,351.22c-13.64,0-24.7-11.06-24.7-24.7s11.06-24.7,24.7-24.7,24.7,11.06,24.7,24.7-11.06,24.7-24.7,24.7Z"
        />
        <circle fill="#fff" strokeWidth={0} cx="634" cy="412.28" r="53.17" />
        <path
          fill="#fff"
          strokeWidth={0}
          d="M618.69,204.89h0c-12.36-4.16-25.14-7.4-38.26-9.63,0,0,0,0,0,0h0c-9.81-1.67-19.81-2.77-29.96-3.29-1.99-.1-3.99-.19-6-.25-2.4-.08-4.8-.13-7.22-.13-140.87,0-255.07,114.2-255.07,255.07,0,11.74.81,23.29,2.35,34.61l3.45,16.4,4.15,19.74c15.02,52.13,45.27,96.47,86.86,129.1,9.78-2.62,18.48-5.89,30.1-9.93-8.74-5.75-16.98-12.08-24.73-18.9,5.12,4.51,10.46,8.79,16.02,12.84,48.12-13.96,83.3-58.33,83.3-110.95,0-63.81-51.73-115.54-115.54-115.54-20.96,0-40.6,5.61-57.54,15.37,13.48-113.22,109.81-201.02,226.66-201.02.59,0,1.18.02,1.77.03,3.16.02,6.3.12,9.43.27-3.13-.15-6.27-.25-9.43-.27-.35,2.49-.54,5.04-.54,7.63,0,30.08,24.47,54.55,54.55,54.55,23.41,0,43.42-14.83,51.15-35.59,34.14,18.13,63.15,44.63,84.22,76.83.06.01.13.03.19.04,14.26,3.22,26.33,6.44,36.14,9.31-30.05-59.07-82.43-104.86-146.02-126.27ZM379.31,613.1c1.65,1.55,3.33,3.08,5.04,4.58-1.7-1.5-3.38-3.03-5.04-4.58ZM462.34,519.57c0,48.24-36.27,87.99-83.03,93.52-44.22-41.46-70.35-100.33-70.35-166.44,0-2.3.04-4.59.11-6.87-.06,2.16-.1,4.32-.11,6.5,16.17-13.07,36.75-20.92,59.17-20.92,52.03,0,94.2,42.18,94.2,94.2ZM309.92,425.76c.19-2.13.41-4.25.67-6.36-.25,2.11-.47,4.23-.67,6.36ZM309.12,438.68c.06-1.85.15-3.69.25-5.52-.11,1.83-.19,3.68-.25,5.52ZM309.44,432.13c.12-1.93.27-3.86.44-5.77-.17,1.92-.31,3.84-.44,5.77ZM593.02,259.29c-18.34,0-33.27-14.92-33.27-33.27,0-2.22.23-4.38.64-6.48,2.69.27,5.37.6,8.03.96.42.06.84.12,1.25.18,2.28.33,4.56.68,6.82,1.07.48.08.96.17,1.44.26,2.27.41,4.54.85,6.78,1.33.37.08.75.16,1.12.24,2.56.56,5.1,1.15,7.62,1.79.02,0,.05.01.07.02,10.75,2.73,21.19,6.22,31.27,10.42,0,0,0,0,0,0-4.19,13.59-16.85,23.49-31.8,23.49ZM640.05,242.82c.43.22.86.44,1.29.66-.43-.22-.86-.45-1.29-.66ZM631.86,238.89c.5.23,1.01.46,1.51.69-.5-.23-1-.46-1.51-.69Z"
        />
        <path
          fill="#fff"
          strokeWidth={0}
          d="M791.12,428.43c-7.87,9.7-16.43,19.48-25.63,29.33-.7,36.36-9.9,70.06-25.7,99.55.82-1.53,1.63-3.08,2.41-4.64-11.37-6.65-24.6-10.48-38.73-10.48-42.45,0-76.86,34.41-76.86,76.86,0,12.68,3.09,24.64,8.53,35.18-29.67,13.35-62.85,20.72-97.89,20.72-26.04,0-48.05-1.36-71.36-9.39-12.69,5.15-24.97,9.73-36.81,13.74,33.61,16.3,68.32,22.44,108.18,22.44,140.87,0,255.07-114.2,255.07-255.07,0-8.39-.42-10.05-1.21-18.23ZM653.83,644.76,653.84,644.76c-4-7.7-6.27-16.44-6.27-25.71,0-30.87,25.03-55.9,55.9-55.9,10.36,0,20.06,2.83,28.38,7.74,1.86-2.94,3.66-5.93,5.38-8.97-19.65,34.61-48.52,63.11-83.39,82.83ZM739.77,557.34c-.82,1.53-1.66,3.05-2.52,4.56.86-1.51,1.7-3.03,2.52-4.56Z"
        />
      </g>
    </>
  );
}

export function LogoIconWrapper({
  svgElement = true,
  ...props
}: SVGProps<SVGSVGElement> & { svgElement?: boolean }) {
  if (!svgElement) return <LogoIcon />;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="200 110 720 650"
      data-testid={LogoIconTestIds.SVG}
      {...props}>
      <LogoIcon />
    </svg>
  );
}
