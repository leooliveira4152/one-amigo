"use client";

import { Box } from "@mui/material";

import { CONTENT_COLOR } from "./common";
import { SheetHeader, SheetMain } from "./components";
import { useCharacterData } from "./hooks";
import { CharacterSheetProvider } from "../context/CharacterSheetContext";
import { SheetBottom } from "./components/SheetBottom";

// TODO - improve letterSpacing

export function CharacterSheetContent() {
  const characterData = useCharacterData();

  // TODO - not found page
  if (!characterData) return null;

  return (
    <Box
      className={`w-[76rem] border-[${CONTENT_COLOR}] border-2 uppercase`} // 72rem equals 6xl - TODO - mobile support
      sx={{
        backgroundColor: "#231243", // Arbitrary color to fit the image standard
        backgroundImage: `url('/character-sheet-bg.png')`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% auto", // Cover the x-axis, adjust height proportionally
      }}
    >
      <SheetHeader />
      <SheetMain />
      <SheetBottom />
    </Box>
  );
}

export function CharacterSheet() {
  return (
    <CharacterSheetProvider>
      <CharacterSheetContent />
    </CharacterSheetProvider>
  );
}
