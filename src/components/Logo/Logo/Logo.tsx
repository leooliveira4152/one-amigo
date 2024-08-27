import { SVGProps } from "react";

import { LogoIcon } from "../LogoIcon";
import { LogoText } from "../LogoText";

export enum LogoTestIds {
  SVG = "logo-svg",
}

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      data-testid={LogoTestIds.SVG}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="100 110 880 820"
      {...props}>
      <LogoIcon svgElement={false} />
      <LogoText svgElement={false} />
    </svg>
  );
}
