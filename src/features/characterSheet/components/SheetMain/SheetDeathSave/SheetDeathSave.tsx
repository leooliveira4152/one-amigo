import { Box, Grid2 } from "@mui/material";
import { useTranslations } from "next-intl";

import { BORDER_WIDTH, CONTENT_COLOR } from "@/features/characterSheet/common";
import { useCharacterSheetContext } from "@/features/context/CharacterSheetContext";

import { SheetTypography } from "../../SheetTypography";

export function SheetDeathSave() {
  const deathSaveMessages = useTranslations("characterSheet.main.deathSave");
  const { characterData } = useCharacterSheetContext();

  return (
    <>
      <Box
        style={{
          borderColor: CONTENT_COLOR,
          borderWidth: BORDER_WIDTH,
          borderRadius: 20,
        }}
      >
        <Grid2
          container
          className={`m-1 pb-1 w-40`}
          style={{ backgroundColor: CONTENT_COLOR, borderRadius: 12 }}
        >
          <Grid2 size={6} className="text-center">
            <SheetTypography className="text-4xl" variant="secondary">
              {characterData?.deathSave.failed}
            </SheetTypography>
            <SheetTypography className="my-1 text-sm" variant="secondary">
              {deathSaveMessages("fail")}
            </SheetTypography>
          </Grid2>
          <Grid2 size={6} className="text-center">
            <SheetTypography className="text-4xl" variant="secondary">
              {characterData?.deathSave.failed}
            </SheetTypography>
            <SheetTypography className="my-1 text-sm" variant="secondary">
              {deathSaveMessages("success")}
            </SheetTypography>
          </Grid2>
        </Grid2>
      </Box>
      <SheetTypography className="mt-1 text-center">
        {deathSaveMessages("title")}
      </SheetTypography>
    </>
  );
}
