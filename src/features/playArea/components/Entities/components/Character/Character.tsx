import { ComponentProps, useEffect, useState } from "react";
import { Circle } from "react-konva";

import { useDialogContext } from "@/features/context/DialogContext";
import { CharacterDatabaseType } from "@/features/firebase/database";
import {
  StorageDirectoriesEnum,
  useGetStorageImage,
} from "@/features/firebase/storage";
import { Coordinates } from "@/features/playArea";
import { useUserStore } from "@/features/store/user";

import { CharacterDrawer } from "./CharacterDrawer";
import { useDragHandler } from "./useDragHandler";

type CharacterProps = ComponentProps<typeof Circle> & CharacterDatabaseType;
export function Character({
  characterId,
  playAreaKey,
  radius,
  ...props
}: CharacterProps) {
  const { currentUser } = useUserStore();
  const { openDialog } = useDialogContext();

  const { imageElement: portraitElement, dimensions: portraitDimensions } =
    useGetStorageImage(
      `${StorageDirectoriesEnum.CHARACTERS}/${characterId}/default_portrait.jpg`
    );

  const [loading, setLoading] = useState(true);
  const [coordinates, setCoordinates] = useState<Coordinates>({ x: 0, y: 0 });

  const { onDragStart, onDragEnd } = useDragHandler({
    x: props.x,
    y: props.y,
    playAreaKey,
    setCoordinates,
  });

  useEffect(() => {
    setCoordinates({ x: props.x, y: props.y });
    if (loading) setLoading(false);
    // No need to use loading as a dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.x, props.y]);

  if (loading || !radius) return null;

  const fillPatternProps: ComponentProps<typeof Circle> =
    portraitDimensions?.width && portraitDimensions.height
      ? {
          fillPatternImage: portraitElement,
          fillPatternScale: {
            x: (radius * 2) / portraitDimensions.width,
            y: (radius * 2) / portraitDimensions.height,
          },
          fillPatternX: radius,
          fillPatternY: radius,
        }
      : {};

  return (
    <>
      <Circle
        radius={radius}
        stroke={"white"}
        strokeWidth={5}
        draggable={currentUser?.admin}
        onClick={openCharacterDrawer}
        onTap={openCharacterDrawer}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        {...props}
        {...coordinates}
        {...fillPatternProps}
      />
    </>
  );

  function openCharacterDrawer() {
    openDialog({
      content: <CharacterDrawer characterId={characterId} />,
      fullWidth: true,
      maxWidth: "sm",
    });
  }
}
