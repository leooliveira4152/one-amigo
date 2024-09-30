import { faker } from "@faker-js/faker";
import { render } from "@testing-library/react";
import { ComponentProps } from "react";
import { Control, Controller } from "react-hook-form";

import { FormCheckbox, FormCheckboxTestIds } from "./FormCheckbox";

type ControllerProps = ComponentProps<typeof Controller>;
const mockOnChange = jest.fn();
const mockValue = faker.string.alphanumeric();

jest.mock("react-hook-form", () => ({
  ...jest.requireActual("react-hook-form"),
  Controller: jest.fn(({ render }: ControllerProps) => (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <>{render({ field: { onChange: mockOnChange, value: mockValue } } as any)}</>
  )),
}));

describe("<FormCheckbox />", () => {
  const control = {} as Control;
  const name = faker.lorem.word();

  const setup = () => render(<FormCheckbox {...{ control, name }} />);

  it("should call the controller with the right props", () => {
    setup();
    expect(Controller).toHaveBeenCalledWith(
      expect.objectContaining({ control, name }),
      expect.anything()
    );
  });

  it("should render the checkbox with its right props", () => {
    const { getByTestId } = setup();
    getByTestId(FormCheckboxTestIds.CHECKBOX);
  });
});
