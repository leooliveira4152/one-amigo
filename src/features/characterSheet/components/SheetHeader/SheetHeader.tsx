import { Grid2, TextField, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import React, { ComponentProps } from "react";

import { Logo } from "@/components/Logo";
import { useCharacterSheetContext } from "@/features/context/CharacterSheetContext";
import { PLACEHOLDER_MISSING_INFO } from "@/utils";

import { BORDER_WIDTH, CHARACTER_SHEET_FONT, CONTENT_COLOR } from "../../common";

export function SheetHeader() {
  const t = useTranslations("characterSheet.header");
  const { characterData, characterOrganization, characterAbilities } =
    useCharacterSheetContext();

  const abilitiesNames =
    characterAbilities && characterAbilities.length
      ? characterAbilities.map(({ name }) => name).join(" / ")
      : null;

  return (
    <Grid2 container justifyContent="space-between" className="p-4">
      <Grid2
        size={5}
        className={`my-2 mt-4 rounded-full`}
        style={{ borderColor: CONTENT_COLOR, borderWidth: BORDER_WIDTH }}
      >
        <Grid2
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
          className="h-full w-full"
        >
          <Typography
            className={`font-alegreya font-semibold ${
              characterData?.nickname ? "text-xl" : "text-2xl"
            }`}
          >
            {characterData?.name ?? PLACEHOLDER_MISSING_INFO}
          </Typography>
          {characterData?.nickname && (
            <Typography
              className="font-alegreya font-bold"
              style={{ fontSize: 40 - characterData.nickname.length * 1.5 }}
            >
              {characterData.nickname}
            </Typography>
          )}
        </Grid2>
      </Grid2>
      <Grid2 size={3.5} className="my-2 px-4">
        <RoundedTextField label={t("abilities")} value={abilitiesNames} />
        <RoundedTextField
          label={t("organization")}
          value={characterOrganization?.name}
          className="mt-4"
        />
      </Grid2>
      <Grid2 size={3.5} className="flex justify-end my-2 px-6">
        <Logo width={100} />
      </Grid2>
    </Grid2>
  );
}

function RoundedTextField({
  label,
  value,
  className,
  ...props
}: ComponentProps<typeof TextField>) {
  const fontProps = {
    fontFamily: CHARACTER_SHEET_FONT,
    fontSize: 20,
    fontWeight: 600,
    color: `${CONTENT_COLOR} !important`,
    letterSpacing: 8,
  };

  return (
    <TextField
      disabled
      label={label ? `${label}`.toUpperCase() : ""}
      value={value ?? "???"}
      className={`mt-2 w-full ${className}`}
      variant="outlined"
      slotProps={{ input: { style: { borderRadius: 9999 } } }}
      sx={{
        "& input": {
          paddingLeft: "24px",
          WebkitTextFillColor: `${CONTENT_COLOR} !important`,
          fontFamily: CHARACTER_SHEET_FONT,
          fontSize: fontProps.fontSize - 3,
        },
        "& fieldset": {
          borderColor: `${CONTENT_COLOR} !important`,
          borderWidth: `${BORDER_WIDTH} !important`,
          paddingLeft: "19px",
        },
        "& label": { marginLeft: "24px", ...fontProps },
        "& span": { marginLeft: "-32px", ...fontProps },
      }}
      {...props}
    />
  );
}
