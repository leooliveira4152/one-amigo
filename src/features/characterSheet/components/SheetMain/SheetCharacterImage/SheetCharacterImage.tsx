/* eslint-disable @next/next/no-img-element */
import { Box, Skeleton, Typography } from "@mui/material";

import {
  BORDER_WIDTH,
  CHARACTER_IMAGE_LEFT_MARGIN,
  CHARACTER_IMAGE_SIZE,
  CONTENT_COLOR,
} from "@/features/characterSheet/common";
import { useCharacterSheetContext } from "@/features/context/CharacterSheetContext";
import { useGetCharacterImage } from "@/features/firebase/storage/useGetCharacterImage";
import { PLACEHOLDER_MISSING_INFO } from "@/utils";

export function SheetCharacterImageContent() {
  const { characterData } = useCharacterSheetContext();
  const characterId = characterData?.id;

  const { imageUrl, status } = useGetCharacterImage(characterId);

  if (imageUrl && status === "loaded")
    return (
      <img
        alt="character-image"
        src={imageUrl}
        width={CHARACTER_IMAGE_SIZE}
        className="rounded-full"
      />
    );

  if (status === "loading")
    return (
      <Skeleton
        width={CHARACTER_IMAGE_SIZE}
        height={CHARACTER_IMAGE_SIZE}
        className="rounded-full"
        style={{ transform: "scale(1)" }}
      />
    );

  return (
    <Typography className="font-alegreya text-8xl h-full flex justify-center items-center">
      {PLACEHOLDER_MISSING_INFO}
    </Typography>
  );
}

export function SheetCharacterImage() {
  return (
    <Box className="overflow-hidden">
      <Box
        className="rounded-full border-2"
        width={CHARACTER_IMAGE_SIZE}
        height={CHARACTER_IMAGE_SIZE}
        style={{
          maxWidth: "none",
          marginLeft: CHARACTER_IMAGE_LEFT_MARGIN,
          borderColor: CONTENT_COLOR,
          borderWidth: BORDER_WIDTH,
          borderStyle: "solid",
        }}
      >
        <SheetCharacterImageContent />
      </Box>
    </Box>
  );
}
