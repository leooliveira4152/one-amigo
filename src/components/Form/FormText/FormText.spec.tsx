import { faker } from "@faker-js/faker";
import { TextField } from "@mui/material";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { ChangeEvent, ComponentProps } from "react";
import { Control, Controller } from "react-hook-form";

import { FormText, FormTextTestIds } from "./FormText";

type ControllerProps = ComponentProps<typeof Controller>;
const mockOnChange = jest.fn();
const mockValue = faker.string.alphanumeric();
const mockInvalidField = faker.datatype.boolean();

jest.mock("@mui/material", () => {
  const actualMui = jest.requireActual("@mui/material");
  return {
    ...actualMui,
    TextField: jest.fn((props) => <actualMui.TextField {...props} />),
  };
});

const mockRenderProps = (value: string | string[]) =>
  ({
    field: {
      onChange: (e: ChangeEvent<HTMLInputElement>) => mockOnChange(e.target?.value),
      value,
    },
    fieldState: { invalid: mockInvalidField },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);

jest.mock("react-hook-form", () => ({
  ...jest.requireActual("react-hook-form"),
  Controller: jest.fn(({ render }: ControllerProps) => (
    <>{render(mockRenderProps(mockValue))}</>
  )),
}));

describe("<FormText />", () => {
  const control = {} as Control;
  const name = faker.lorem.word();
  const label = faker.lorem.word();
  const required = faker.datatype.boolean();
  const multiline = faker.datatype.boolean();

  const setup = (override?: Partial<ComponentProps<typeof FormText>>) =>
    render(<FormText {...{ control, name, label, required, multiline }} {...override} />);

  it("should call the controller with the right props", () => {
    setup();
    expect(Controller).toHaveBeenCalledWith(
      expect.objectContaining({ control, name, rules: { required } }),
      expect.anything()
    );
  });

  it("should pass the right props and call onChange properly if input is not multiple", () => {
    const input = faker.string.alphanumeric(10);
    const { getByTestId } = setup();
    fireEvent.change(getByTestId(FormTextTestIds.SINGLE_INPUT), {
      target: { value: input },
    });
    expect(mockOnChange).toHaveBeenCalledWith(input);
    expect(TextField).toHaveBeenCalledWith(
      expect.objectContaining({ required, label, multiline, autoComplete: "off" }),
      expect.anything()
    );
  });

  describe("multiple inputs", () => {
    beforeEach(() => {
      jest
        .mocked(Controller)
        .mockImplementation(
          jest.fn(({ render }: ControllerProps) => (
            <>{render(mockRenderProps([mockValue]))}</>
          ))
        );
    });

    it("should call not call onChange when the user is typing", async () => {
      const input = faker.string.alphanumeric(10);
      const { getByTestId } = setup({ multiInput: true });
      fireEvent.change(getByTestId(FormTextTestIds.MULTIPLE_INPUT), {
        target: { value: input },
      });
      expect(mockOnChange).not.toHaveBeenCalled();
      // TODO - test onKeyDown when you learn to do so
    });

    it("should delete the chip component when user clicks on delete icon", async () => {
      const { container } = setup({ multiInput: true });
      const deleteIcon = container.querySelector(".MuiChip-deleteIcon");
      await waitFor(() => fireEvent.click(deleteIcon!));
      expect(mockOnChange).toHaveBeenCalled();
    });
  });
});
