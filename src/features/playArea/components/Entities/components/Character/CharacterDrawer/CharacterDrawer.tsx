import { Box, Skeleton } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";

import {
  FirestoreCharacter,
  readCharacterDoc,
} from "@/features/firebase/firestore";
import {
  StorageDirectoriesEnum,
  useGetStorageImage,
} from "@/features/firebase/storage";

export enum CharacterDrawerTestIds {
  ROOT = "character-drawer-root",
  ROOT_SKELETON = "character-drawer-root-skeleton",
  IMAGE = "character-drawer-image",
  IMAGE_SKELETON = "character-drawer-image-skeleton",
}

export const PLACEHOLDER_CHARACTER_NAME = "???";

type CharacterDrawerProps = { characterId: string };
export function CharacterDrawer({ characterId }: CharacterDrawerProps) {
  const [loading, setLoading] = useState(true);
  const [characterData, setCharacterData] = useState<FirestoreCharacter>();

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
  }, [characterId]);

  const characterName = characterData?.name ?? PLACEHOLDER_CHARACTER_NAME;

  return (
    <Box
      data-testid={CharacterDrawerTestIds.ROOT}
      className="flex flex-col items-center">
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
          <h2 className="mt-5">{`${characterName}`}</h2>
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
      <Image
        data-testid={CharacterDrawerTestIds.IMAGE}
        alt={characterName}
        src={imageUrl}
        className="h-full w-full min-h-68 min-w-68 max-w-lg max-h-lg outline-2 outline-white outline"
        {...dimensions}
      />
    );
  }
}
