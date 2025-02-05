import { Box, Grid2, Radio, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { ComponentProps } from "react";

import { BORDER_WIDTH, CONTENT_COLOR } from "@/features/characterSheet/common";
import { FirestoreCharacterAttributes } from "@/features/firebase/firestore";
import { getObjectEntries, PLACEHOLDER_MISSING_INFO } from "@/utils";

type SheetAttributeProps<T extends keyof FirestoreCharacterAttributes> = {
  label: T;
  attributes?: FirestoreCharacterAttributes[T];
};

// TODO - add saving throws
export function SheetAttribute<T extends keyof FirestoreCharacterAttributes>({
  label,
  attributes,
}: SheetAttributeProps<T>) {
  const attributeText = useTranslations("characterSheet.main.attributes");
  const skillsTexts = useTranslations("characterSheet.main.skills");

  return (
    <Box
      className={`mt-3 text-sm`}
      style={{ borderColor: CONTENT_COLOR, borderWidth: BORDER_WIDTH, borderRadius: 20 }}
    >
      <Grid2
        container
        className={`m-2 bg-white bg-opacity-10`}
        style={{ borderRadius: 12 }}
      >
        <Grid2 size={attributes?.skills ? 4.5 : 12}>
          <Grid2 container direction="column" alignItems="center" className="pl-2">
            <Typography className="font-alegreya text-6xl">
              {attributes?.value ?? PLACEHOLDER_MISSING_INFO}
            </Typography>
            <Typography className="font-alegreya pb-3 text-sm">
              {attributeText(label)}
            </Typography>
          </Grid2>
        </Grid2>
        {attributes?.skills && (
          <Grid2 size={7.5} className="p-2">
            {getObjectEntries(attributes.skills).map(([key, { value, proficiency }]) => (
              <Grid2
                key={key}
                container
                justifyContent="space-between"
                className="w-full my-1"
              >
                <Grid2 size={10} className="flex">
                  <Radio
                    size="small"
                    checked={proficiency}
                    color={CONTENT_COLOR as ComponentProps<typeof Radio>["color"]}
                    className="p-0 mr-1"
                  />
                  <Typography className="font-alegreya mt-[-1px] text-sm tracking-tight">
                    {skillsTexts(key)}
                  </Typography>
                </Grid2>
                <Grid2
                  size={2}
                  justifyContent="center"
                  alignItems="center"
                  className={`w-5 h-5 mt-[2px] flex rounded-full outline outline-2 outline-cyan-50`}
                >
                  <Typography className="font-alegreya mt-[-1px]">{value}</Typography>
                </Grid2>
              </Grid2>
            ))}
          </Grid2>
        )}
      </Grid2>
    </Box>
  );
}
