/* eslint-disable @next/next/no-img-element */
import { Box, Skeleton, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import { FirestoreCharacter, useCharacterDoc } from "@/features/firebase/firestore";
import { StorageDirectoriesEnum, useGetStorageImage } from "@/features/firebase/storage";
import { PLACEHOLDER_MISSING_INFO } from "@/utils";

export enum CharacterDrawerTestIds {
  ROOT = "character-drawer-root",
  ROOT_SKELETON = "character-drawer-root-skeleton",
  IMAGE = "character-drawer-image",
  IMAGE_SKELETON = "character-drawer-image-skeleton",
}

type CharacterDrawerProps = { characterId: string };
export function CharacterDrawer({ characterId }: CharacterDrawerProps) {
  const [loading, setLoading] = useState(true);
  const [characterData, setCharacterData] = useState<FirestoreCharacter>();
  const { readCharacterDoc } = useCharacterDoc();

  const { imageUrl, dimensions } = useGetStorageImage(
    `${StorageDirectoriesEnum.CHARACTERS}/${characterId}/default.jpg`
  );

  useEffect(() => {
    const getCharacterData = async () => {
      const result = await readCharacterDoc(characterId);
      setLoading(false);
      if (result) setCharacterData(result);
    };
    getCharacterData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characterId]);

  const characterName = characterData?.name ?? PLACEHOLDER_MISSING_INFO;

  return (
    <Box data-testid={CharacterDrawerTestIds.ROOT} className="flex flex-col items-center">
      {loading ? (
        <Skeleton
          data-testid={CharacterDrawerTestIds.ROOT_SKELETON}
          variant="rectangular"
          height={300}
          width={300}
        />
      ) : (
        <>
          <CharacterImage />
          <Typography className="mt-5">{characterName}</Typography>
        </>
      )}
    </Box>
  );

  function CharacterImage() {
    if (!imageUrl || !dimensions)
      return (
        <Skeleton
          data-testid={CharacterDrawerTestIds.IMAGE_SKELETON}
          variant="rectangular"
          height={300}
          width={300}
        />
      );

    return (
      <img
        data-testid={CharacterDrawerTestIds.IMAGE}
        alt={characterName}
        src={imageUrl}
        className="h-full w-full min-h-68 min-w-68 max-w-lg max-h-lg outline-2 outline-white outline"
        {...dimensions}
      />
    );
  }
}
