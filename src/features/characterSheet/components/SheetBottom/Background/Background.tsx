import { faker } from "@faker-js/faker";
import { Typography } from "@mui/material";

import { useCharacterSheetContext } from "@/features/context/CharacterSheetContext";
import { randomNumber } from "@/utils";

export function Background() {
  const { characterData } = useCharacterSheetContext();

  if (!characterData) return null;
  return (
    <>
      {Array.from({ length: randomNumber(4) + 2 }).map((_, index) => (
        <Typography key={index} className="mt-2">
          {faker.lorem.paragraph()}
        </Typography>
      ))}
    </>
  );
}
