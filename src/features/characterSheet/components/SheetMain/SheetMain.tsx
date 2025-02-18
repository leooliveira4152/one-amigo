import { Box, Grid2, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import { useCharacterSheetContext } from "@/features/context/CharacterSheetContext";
import { CharacterAttributes, CharacterCombatStats } from "@/features/firebase/firestore";

import { SheetAttribute } from "./SheetAttribute";
import { SheetCharacterImage } from "./SheetCharacterImage";
import { SheetCombatStats } from "./SheetCombatStats";
import { SheetDeathSave } from "./SheetDeathSave";

export function SheetMain() {
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
          <SheetDeathSave />
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
