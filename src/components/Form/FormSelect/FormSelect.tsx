import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { ComponentProps } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

export enum FormSelectTestIds {
  LABEL = "form-select-label",
  SELECT = "form-select-select",
  LOADING = "form-select-loading",
  ITEM = "form-select-item",
}

type FormSelectProps<T extends FieldValues> = ComponentProps<typeof Select> & {
  control: Control<T>;
  name: Path<T>;
  options: { label: string; value: string }[];
  multiple?: boolean;
  className?: string;
  loading?: boolean;
  required?: boolean;
};

export function FormSelect<T extends FieldValues>({
  control,
  required,
  name,
  label,
  onOpen,
  options,
  multiple,
  className,
  native,
  size = "small",
  loading = false,
}: FormSelectProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={{ required }}
      render={({ field: { onChange, value }, fieldState }) => (
        <FormControl error={fieldState.invalid} {...{ size, required, className }}>
          {label && (
            <InputLabel data-testid={FormSelectTestIds.LABEL}>{label}</InputLabel>
          )}
          <Select
            data-testid={FormSelectTestIds.SELECT}
            native={native} // Only for test purposes
            multiple={multiple}
            value={value}
            label={label}
            onOpen={onOpen}
            // TODO - onChange isn't being tested
            onChange={(e) => onChange(e.target.value)} // Correctly pass the event value
            MenuProps={{
              // TODO - recheck this styling for general cases
              slotProps: { paper: { className: loading ? "flex justify-center" : "" } },
            }}
          >
            {loading ? (
              <CircularProgress
                data-testid={FormSelectTestIds.LOADING}
                size={30}
                className="mt-1"
                sx={({ palette }) => ({ color: palette.primary.light })}
              />
            ) : (
              // TODO - rewrite logic if there's a need for item customization
              options.map(({ label, value }) => (
                <MenuItem data-testid={FormSelectTestIds.ITEM} key={value} value={value}>
                  {label}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
      )}
    />
  );
}
