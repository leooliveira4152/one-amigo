import { render } from "@testing-library/react";
import { ComponentProps } from "react";

import { LogoIconTestIds, LogoIconWrapper } from "./LogoIcon";

describe("<LogoIcon />", () => {
  const setup = (override?: ComponentProps<typeof LogoIconWrapper>) =>
    render(<LogoIconWrapper {...override} />);

  it("should render every required element in default conditions", () => {
    const { getByTestId } = setup();
    getByTestId(LogoIconTestIds.SVG);
    getByTestId(LogoIconTestIds.DEFS);
    getByTestId(LogoIconTestIds.GROUP);
  });

  it("should render every required element BUT the SVG one if svgElement is false", () => {
    const { getByTestId, queryByTestId } = setup({ svgElement: false });
    expect(queryByTestId(LogoIconTestIds.SVG)).toBeFalsy();
    getByTestId(LogoIconTestIds.DEFS);
    getByTestId(LogoIconTestIds.GROUP);
  });
});
