/* eslint-disable @typescript-eslint/no-explicit-any */
import { faker } from "@faker-js/faker";
import { FormControl, Select } from "@mui/material";
import { fireEvent, render, waitFor, within } from "@testing-library/react";
import { ComponentProps, PropsWithChildren } from "react";
import { Control, Controller } from "react-hook-form";

import { FormSelect, FormSelectTestIds } from "./FormSelect";

type ControllerProps = ComponentProps<typeof Controller>;
const mockOnChange = jest.fn();
const mockValue = faker.string.alphanumeric(10);
const mockInvalidField = faker.datatype.boolean();

jest.mock("@mui/material", () => {
  const actualMui = jest.requireActual("@mui/material");
  return {
    ...actualMui,
    Select: jest.fn((props) => <actualMui.Select {...props} />),
    FormControl: jest.fn(({ children }: PropsWithChildren) => <>{children}</>),
    MenuItem: jest.fn(
      ({
        children,
        "data-testid": testId,
      }: React.PropsWithChildren<{ "data-testid"?: string }>) => (
        <div data-testid={testId}>{children}</div>
      )
    ),
  };
});

const mockRenderProps = (value: string | string[]) =>
  ({
    field: { onChange: mockOnChange, value },
    fieldState: { invalid: mockInvalidField },
  } as any);

jest.mock("react-hook-form", () => ({
  ...jest.requireActual("react-hook-form"),
  Controller: jest.fn(({ render }: ControllerProps) => (
    <>{render(mockRenderProps(mockValue))}</>
  )),
}));

describe("<FormSelect />", () => {
  const control = {} as Control;
  const name = faker.lorem.word();
  const required = faker.datatype.boolean();
  const className = faker.string.alphanumeric(10);
  const size = faker.helpers.arrayElement<"small" | "medium">(["small", "medium"]);
  const onOpen = jest.fn();
  const options = new Array(faker.number.int({ min: 2, max: 10 }))
    .fill(null)
    .map((_) => ({
      label: faker.lorem.words(),
      value: faker.lorem.word(),
    }));

  const setup = (override?: Partial<ComponentProps<typeof FormSelect>>) =>
    render(
      <FormSelect
        {...{ control, name, required, options, className, size, onOpen }}
        {...override}
      />
    );

  it("should call Controller and FormControl with their right props", () => {
    setup();
    expect(Controller).toHaveBeenCalledWith(
      expect.objectContaining({ control, name, rules: { required } }),
      expect.anything()
    );
    expect(FormControl).toHaveBeenCalledWith(
      expect.objectContaining({ error: mockInvalidField, required, size, className }),
      expect.anything()
    );
  });

  describe("label rendering", () => {
    it("should correctly display the label if it was provided", () => {
      const label = faker.lorem.words();
      const { getByTestId } = setup({ label });
      const { getByText } = within(getByTestId(FormSelectTestIds.LABEL));
      getByText(label);
    });

    it("should NOT render the label component if no label was provided", () => {
      const { queryByTestId } = setup();
      expect(queryByTestId(FormSelectTestIds.LABEL)).toBeFalsy();
    });
  });

  describe("select rendering", () => {
    it("should call the select with its required props", () => {
      const { getByTestId } = setup();
      getByTestId(FormSelectTestIds.SELECT);
      expect(Select).toHaveBeenCalledWith(
        expect.objectContaining({ value: mockValue }),
        expect.anything()
      );
    });

    it("should call the select with multiple on if it was passed", () => {
      jest
        .mocked(Controller)
        .mockImplementationOnce(
          jest.fn(({ render }: ControllerProps) => (
            <>{render(mockRenderProps([mockValue]))}</>
          ))
        );

      const { getByTestId } = setup({ multiple: true });
      getByTestId(FormSelectTestIds.SELECT);
      expect(Select).toHaveBeenCalledWith(
        expect.objectContaining({ value: [mockValue] }),
        expect.anything()
      );
    });

    it("should display the loading progress if loading is true", async () => {
      const { getByTestId } = setup({ loading: true, native: true });
      fireEvent.mouseDown(getByTestId(FormSelectTestIds.SELECT));
      await waitFor(() => getByTestId(FormSelectTestIds.LOADING));
    });

    it("should display the options if loading is false", async () => {
      const { getByTestId, getAllByTestId } = setup({ native: true });
      fireEvent.mouseDown(getByTestId(FormSelectTestIds.SELECT));
      const itemElements = await waitFor(() => getAllByTestId(FormSelectTestIds.ITEM));
      expect(itemElements).toHaveLength(options.length);
    });
  });
});
