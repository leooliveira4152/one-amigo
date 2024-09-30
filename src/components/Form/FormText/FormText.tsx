import { Box, Chip, TextField } from "@mui/material";
import { ComponentProps, useState, KeyboardEvent, ChangeEvent } from "react";
import {
  Control,
  Controller,
  ControllerRenderProps,
  FieldValues,
  Path,
} from "react-hook-form";

export enum FormTextTestIds {
  SINGLE_INPUT = "form-text-single-input",
  MULTIPLE_INPUT = "form-text-multiple-input",
}

type FormTextProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  required?: boolean;
  disabled?: boolean;
  multiline?: boolean;
  multiInput?: boolean;
  size?: ComponentProps<typeof TextField>["size"];
};

export function FormText<T extends FieldValues>({
  control,
  name,
  label,
  required,
  disabled,
  multiline = false,
  multiInput = false,
  size = "small",
}: FormTextProps<T>) {
  const [currValue, setCurrValue] = useState("");

  const commonProps = { required, label, size, disabled, multiline, autoComplete: "off" };

  return (
    <Controller
      control={control}
      rules={{ required }}
      name={name}
      render={({ field: { onChange, value }, fieldState }) =>
        multiInput ? (
          <TextField
            {...commonProps}
            value={currValue}
            error={fieldState.invalid}
            onChange={handleChange}
            onKeyDown={(e) => handleKeyUp(e, value, onChange)}
            slotProps={{
              input: {
                inputProps: { "data-testid": FormTextTestIds.MULTIPLE_INPUT },
                endAdornment: (
                  <Box className="p-2 max-w-[50%]">
                    {(value as string[]).map((item, index) => (
                      <Chip
                        key={index}
                        size="small"
                        onDelete={() => handleDelete(value, item, index, onChange)}
                        label={item}
                      />
                    ))}
                  </Box>
                ),
              },
            }}
          />
        ) : (
          <TextField
            {...commonProps}
            slotProps={{
              input: { inputProps: { "data-testid": FormTextTestIds.SINGLE_INPUT } },
            }}
            value={value}
            error={fieldState.invalid}
            onChange={onChange}
          />
        )
      }
    />
  );

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setCurrValue(e.target.value);
  }

  function handleKeyUp(
    e: KeyboardEvent<HTMLDivElement>,
    values: string[],
    onChange: ControllerRenderProps["onChange"]
  ) {
    console.log("here", e);
    if (e.key == "Enter") {
      const target = e.target as HTMLInputElement;
      onChange([...values, target.value as string]);
      setCurrValue("");
    }
  }

  function handleDelete(
    values: string[],
    item: string,
    index: number,
    onChange: ControllerRenderProps["onChange"]
  ) {
    const arr = [...values];
    arr.splice(index, 1);
    console.log(item);
    onChange(arr);
  }
}
