import { render } from "@testing-library/react";
import { Logo, LogoTestIds } from "./Logo";
import { LogoIcon } from "../LogoIcon";
import { LogoText } from "../LogoText";

jest.mock("../LogoIcon");
jest.mock("../LogoText");

describe("<Logo />", () => {
  const setup = () => render(<Logo />);

  it("should render the SVG itself", () => {
    const { getByTestId } = setup();
    getByTestId(LogoTestIds.SVG);
  });

  it("should call both sub-elements (with their right props)", () => {
    setup();
    expect(jest.mocked(LogoIcon).mock.calls[0][0]).toStrictEqual({
      svgElement: false,
    });
    expect(jest.mocked(LogoText).mock.calls[0][0]).toStrictEqual({
      svgElement: false,
    });
  });
});
