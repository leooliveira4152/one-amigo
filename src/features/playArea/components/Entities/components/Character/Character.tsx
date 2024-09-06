import { ComponentProps, useEffect, useState } from "react";
import { Circle } from "react-konva";

import { useDialogContext } from "@/features/context/DialogContext";
import { CharacterDatabaseType } from "@/features/firebase/database";
import {
  StorageDirectoriesEnum,
  useGetStorageImage,
} from "@/features/firebase/storage";
import { Coordinates } from "@/features/playArea";
import {
  DEFAULT_PERSON_HEIGHT_METERS,
  METER_SIZE,
} from "@/features/playArea/common";
import { useUserStore } from "@/features/store/user";

import { CharacterDrawer } from "./CharacterDrawer";
import { useDragHandler } from "./useDragHandler";

const CHARACTER_SIZE_NORMALIZER = 0.8; // Otherwise character height discrepancy would result in HUGE character icons for really tall characters
export const CIRCUMFERENCE_NORMALIZER = 0.8; // Otherwise characters icon would be too large,
const BASE_TOP_SHADOW_SIZE = 5;
const BASE_BOTTOM_SHADOW_SIZE = 10;

type CharacterProps = ComponentProps<typeof Circle> & CharacterDatabaseType;
export function Character({
  characterId,
  playAreaKey,
  height,
  ...props
}: CharacterProps) {
  const heightProportionToDefaultHeight =
    ((height ?? DEFAULT_PERSON_HEIGHT_METERS) / DEFAULT_PERSON_HEIGHT_METERS) **
    CHARACTER_SIZE_NORMALIZER;
  const radius =
    heightProportionToDefaultHeight * METER_SIZE * CIRCUMFERENCE_NORMALIZER;

  const { currentUser } = useUserStore();
  const { openDialog } = useDialogContext();

  const { imageElement: portraitElement, dimensions: portraitDimensions } =
    useGetStorageImage(
      `${StorageDirectoriesEnum.CHARACTERS}/${characterId}/default_portrait.jpg`
    );

  const [loading, setLoading] = useState(true);
  const [coordinates, setCoordinates] = useState<Coordinates>({ x: 0, y: 0 });

  const dragProperties = useDragHandler({
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

  if (loading) return null;

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
        radius={
          radius +
          (BASE_TOP_SHADOW_SIZE + BASE_BOTTOM_SHADOW_SIZE) *
            heightProportionToDefaultHeight
        }
        fill="black"
        opacity={0.7}
        x={coordinates.x}
        y={
          coordinates.y +
          BASE_BOTTOM_SHADOW_SIZE * heightProportionToDefaultHeight
        }
      />
      <Circle
        radius={radius}
        {...props}
        {...coordinates}
        {...fillPatternProps}
      />
      <Circle
        radius={radius}
        draggable={currentUser?.admin}
        onClick={openCharacterDrawer}
        onTap={openCharacterDrawer}
        {...props}
        {...coordinates}
        {...dragProperties}
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
