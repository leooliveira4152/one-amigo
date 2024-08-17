import { render } from "@testing-library/react";
import { ComponentProps } from "react";
import { LogoTextTestIds, LogoTextWrapper } from "./LogoText";

describe("<LogoIcon />", () => {
  const setup = (override?: ComponentProps<typeof LogoTextWrapper>) =>
    render(<LogoTextWrapper {...override} />);

  it("should render every required element in default conditions", () => {
    const { getByTestId } = setup();
    getByTestId(LogoTextTestIds.SVG);
    getByTestId(LogoTextTestIds.GROUP);
  });

  it("should render every required element BUT the SVG one if svgElement is false", () => {
    const { getByTestId, queryByTestId } = setup({ svgElement: false });
    expect(queryByTestId(LogoTextTestIds.SVG)).toBeFalsy();
    getByTestId(LogoTextTestIds.GROUP);
  });
});
