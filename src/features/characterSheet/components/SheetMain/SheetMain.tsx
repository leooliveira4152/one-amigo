import { Box, Grid2, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import { useCharacterSheetContext } from "@/features/context/CharacterSheetContext";
import { CharacterAttributes, CharacterCombatStats } from "@/features/firebase/firestore";

import { SheetAttribute } from "./SheetAttribute";
import { SheetCharacterImage } from "./SheetCharacterImage";
import { SheetCombatStats } from "./SheetCombatStats";
import { BORDER_WIDTH, CONTENT_COLOR } from "../../common";

export function SheetMain() {
  const deathSaveMessages = useTranslations("characterSheet.main.deathSave");
  const { characterData } = useCharacterSheetContext();

  const { armor, dodge, speed, hp, initiative } = characterData?.combatStats ?? {};
  const {
    charisma,
    constitution,
    determination,
    dexterity,
    intelligence,
    strength,
    wisdom,
  } = characterData?.attributes ?? {};

  return (
    <Grid2
      container
      justifyContent="space-between"
      className="!font-alegreya mt-12 mb-20"
    >
      <Grid2 size={5} position="relative">
        <SheetCharacterImage />
        <SheetCombatStats index={0} stat={CharacterCombatStats.ARMOR} value={armor} />
        <SheetCombatStats index={1} stat={CharacterCombatStats.DODGE} value={dodge} />
        <SheetCombatStats index={2} stat={CharacterCombatStats.HP} value={hp} />
        <SheetCombatStats
          index={3}
          stat={CharacterCombatStats.INITIATIVE}
          value={initiative}
        />
        <SheetCombatStats index={4} stat={CharacterCombatStats.SPEED} value={speed} />
        <Box className="absolute" left={15} top="90%">
          <Box
            style={{
              borderColor: CONTENT_COLOR,
              borderWidth: BORDER_WIDTH,
              borderRadius: 20,
            }}
          >
            <Grid2
              container
              className={`m-1 pb-1 w-40 bg-white bg-opacity-10`}
              style={{ borderRadius: 12 }}
            >
              <Grid2 size={6} className="text-center">
                <Typography className="font-alegreya text-4xl">
                  {characterData?.deathSave.failed}
                </Typography>
                <Typography className="my-1 font-alegreya text-sm">
                  {deathSaveMessages("fail")}
                </Typography>
              </Grid2>
              <Grid2 size={6} className="text-center">
                <Typography className="font-alegreya text-4xl">
                  {characterData?.deathSave.failed}
                </Typography>
                <Typography className="my-1 font-alegreya text-sm">
                  {deathSaveMessages("success")}
                </Typography>
              </Grid2>
            </Grid2>
          </Box>
          <Typography className="mt-1 font-alegreya text-center">
            {deathSaveMessages("title")}
          </Typography>
        </Box>
      </Grid2>
      {characterData?.attributes && (
        <>
          <Grid2 size={3.25}>
            <SheetAttribute label={CharacterAttributes.STRENGTH} attributes={strength} />
            <SheetAttribute
              label={CharacterAttributes.DEXTERITY}
              attributes={dexterity}
            />
            <>
              <Grid2 container justifyContent="space-between" className="w-full">
                <Grid2 size={5.75}>
                  <SheetAttribute
                    label={CharacterAttributes.CONSTITUTION}
                    attributes={constitution}
                  />
                </Grid2>
                <Grid2 size={5.75}>
                  <SheetAttribute
                    label={CharacterAttributes.DETERMINATION}
                    attributes={determination}
                  />
                </Grid2>
              </Grid2>
            </>
          </Grid2>
          <Grid2 size={3.25} className="mr-2">
            <SheetAttribute
              label={CharacterAttributes.INTELLIGENCE}
              attributes={intelligence}
            />
            <SheetAttribute label={CharacterAttributes.CHARISMA} attributes={charisma} />
            <SheetAttribute label={CharacterAttributes.WISDOM} attributes={wisdom} />
          </Grid2>
        </>
      )}
    </Grid2>
  );
}
