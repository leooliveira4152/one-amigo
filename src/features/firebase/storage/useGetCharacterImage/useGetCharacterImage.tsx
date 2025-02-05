import { StorageDirectoriesEnum } from "../types";
import { useGetStorageImage } from "../useGetStorageImage";

// TODO - use this for all images
export function useGetCharacterImage(characterId?: string, version?: string) {
  return useGetStorageImage(
    `${StorageDirectoriesEnum.CHARACTERS}/${characterId}/${version ?? "default"}.jpg`
  );
}
