import "@testing-library/jest-dom";
import { fireEvent, render } from "@testing-library/react";

import { LoginButton } from "./LoginButton";

const BUTTON_TEST_ID = "login-button-test-id";
const mockOnClick = jest.fn();

describe("<LoginButton />", () => {
  const setup = () =>
    render(<LoginButton data-testid={BUTTON_TEST_ID} onClick={mockOnClick} />);

  it("should render the button itself", () => {
    const { getByTestId } = setup();
    getByTestId(BUTTON_TEST_ID);
  });

  it("should trigger the mockOnClick function when the button is pressed", () => {
    const { getByTestId } = setup();
    fireEvent.click(getByTestId(BUTTON_TEST_ID));
    expect(mockOnClick).toHaveBeenCalled();
  });
});
