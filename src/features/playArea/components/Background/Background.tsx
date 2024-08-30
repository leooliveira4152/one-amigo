import { Layer, Rect } from "react-konva";
import useImage from "use-image";

import { usePlayAreaStore } from "@/features/store/playArea";

export const backgroundImageScale = 0.58;

export function Background() {
  const { stageDimensions: dimensions } = usePlayAreaStore();
  const [backgroundImage] = useImage("logo-bg.png");

  return (
    <Layer>
      <Rect
        alt="background"
        fillPatternImage={backgroundImage}
        fillPatternScale={{ x: backgroundImageScale, y: backgroundImageScale }}
        fillPatternRepeat="repeat"
        {...dimensions}
      />
    </Layer>
  );
}
