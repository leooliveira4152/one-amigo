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
    // 72rem equals 6xl - TODO - mobile support
    <Box
      className={`w-[76rem] border-[${CONTENT_COLOR}] border-2 uppercase`}
      sx={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/character-sheet-bg.png')`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
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
