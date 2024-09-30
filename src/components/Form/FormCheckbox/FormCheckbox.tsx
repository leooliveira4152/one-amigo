import { Checkbox, FormControlLabel } from "@mui/material";
import { ComponentProps } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

export enum FormCheckboxTestIds {
  CHECKBOX = "form-checkbox",
}

type FormCheckboxProps<T extends FieldValues> = ComponentProps<typeof Checkbox> & {
  control: Control<T>;
  name: Path<T>;
  label?: string;
};

export function FormCheckbox<T extends FieldValues>({
  control,
  name,
  label,
}: FormCheckboxProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <FormControlLabel
          label={label}
          // TODO - check className customization
          className="ml-1"
          control={
            <Checkbox
              data-testid={FormCheckboxTestIds.CHECKBOX}
              {...{ onChange, value }}
            />
          }
        />
      )}
    />
  );
}
