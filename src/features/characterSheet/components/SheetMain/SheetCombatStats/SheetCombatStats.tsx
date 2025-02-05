import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  CHARACTER_IMAGE_LEFT_MARGIN,
  CHARACTER_IMAGE_SIZE,
  CONTENT_COLOR,
} from "@/features/characterSheet/common";
import {
  CharacterCombatStats,
  FirestoreCharacterCombatStats,
} from "@/features/firebase/firestore";
import { PLACEHOLDER_MISSING_INFO } from "@/utils";

const ORBIT_CENTER = 105 / 2;
const OUTER_CIRCLE_RADIUS = 46;
const INNER_CIRCLE_RADIUS = OUTER_CIRCLE_RADIUS - 8;
const INNER_CIRCLE_PLANET_OFFSET = Math.PI / 20;
const BIG_PLANET_RADIUS = 5;
const MEDIUM_PLANET_RADIUS = 4;
const SMALL_PLANET_RADIUS = 3;
const GAP = 10;

const DEFAULT_OFFSET = Math.PI / 3.5;
const DEFAULT_SPACING = Math.PI / 6;

const INCREMENT_RADIUS = Math.PI / 800;
const INTERVAL_MS = 1000 / 15;

type SheetCombatStatsProps<T extends CharacterCombatStats> = {
  index: number;
  value: FirestoreCharacterCombatStats[T];
  stat: T;
};
export function SheetCombatStats<T extends CharacterCombatStats>({
  index,
  value,
  stat,
}: SheetCombatStatsProps<T>) {
  const t = useTranslations("characterSheet.main.combatStats");
  const statValue = value?.current ?? PLACEHOLDER_MISSING_INFO;
  const maxHp = (value as FirestoreCharacterCombatStats["hp"])?.max;

  return (
    <Box
      position="absolute"
      top={
        (CHARACTER_IMAGE_SIZE / 2) *
        (1 + Math.sin(DEFAULT_SPACING * index - DEFAULT_OFFSET))
      }
      left={
        (CHARACTER_IMAGE_SIZE / 2) *
          (1 + Math.cos(DEFAULT_SPACING * index - DEFAULT_OFFSET)) +
        CHARACTER_IMAGE_LEFT_MARGIN
      }
      style={{ transform: "translateX(-50%) translateY(-50%)" }}
    >
      <OrbitAnimation />
      <Box
        className="flex absolute justify-center items-center rounded-full bg-white bg-opacity-10 w-[66px] h-[66px]"
        style={{
          top: "50%",
          left: "50%",
          transform: "translateX(-50%) translateY(-50%)",
        }}
      >
        <Typography
          className={`font-alegreya text-center ${
            maxHp ? "text-2xl" : "text-5xl mt-[-9px]"
          } border-0`}
        >
          {maxHp ? `${statValue} /${maxHp}` : statValue}
        </Typography>
      </Box>
      <Typography className="absolute w-full font-alegreya text-center">
        {t(stat)}
      </Typography>
    </Box>
  );
}

export function OrbitAnimation() {
  const [displayValue, setDisplayValue] = useState(0);
  const currentValueRef = useRef(0);
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number>(performance.now());

  const randomPosition = useMemo(
    () => [Math.random() * Math.PI * 2, Math.random() * Math.PI * 2],
    []
  );

  useEffect(() => {
    const animate = (time: number) => {
      const elapsed = time - previousTimeRef.current;
      if (elapsed >= INTERVAL_MS) {
        currentValueRef.current += INCREMENT_RADIUS;
        setDisplayValue(currentValueRef.current);
        previousTimeRef.current = time;
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <svg width={ORBIT_CENTER * 2} height={ORBIT_CENTER * 2}>
      <g id="outer-circle">
        <circle
          cx={ORBIT_CENTER}
          cy={ORBIT_CENTER}
          r={OUTER_CIRCLE_RADIUS}
          fill="none"
          strokeWidth="2"
          stroke={CONTENT_COLOR}
        />
        <circle
          r={MEDIUM_PLANET_RADIUS}
          fill={CONTENT_COLOR}
          {...getCircleCoordinates(
            -displayValue * 0.3 + randomPosition[0],
            OUTER_CIRCLE_RADIUS
          )}
        />
      </g>
      <g id="inner-circle">
        <circle
          cx={ORBIT_CENTER}
          cy={ORBIT_CENTER}
          r={INNER_CIRCLE_RADIUS}
          fill="none"
          strokeWidth="1"
          stroke={CONTENT_COLOR}
          strokeDasharray={`${GAP} ${GAP} ${INNER_CIRCLE_RADIUS * 10}`}
          transform={`rotate(-${
            112 +
            (displayValue + INNER_CIRCLE_PLANET_OFFSET + randomPosition[1]) *
              (180 / Math.PI)
          } ${ORBIT_CENTER} ${ORBIT_CENTER})`}
        />
        <circle
          r={BIG_PLANET_RADIUS}
          stroke={CONTENT_COLOR}
          fill="transparent"
          {...getCircleCoordinates(
            Math.PI + INNER_CIRCLE_PLANET_OFFSET + randomPosition[1],
            INNER_CIRCLE_RADIUS
          )}
        />
        <circle
          r={SMALL_PLANET_RADIUS}
          fill={CONTENT_COLOR}
          {...getCircleCoordinates(
            Math.PI - INNER_CIRCLE_PLANET_OFFSET + randomPosition[1],
            INNER_CIRCLE_RADIUS
          )}
        />
      </g>
    </svg>
  );

  function getCircleCoordinates(phaseModifier: number, orbitRadius: number) {
    return {
      cx: ORBIT_CENTER + Math.sin(displayValue + phaseModifier) * orbitRadius,
      cy: ORBIT_CENTER + Math.cos(displayValue + phaseModifier) * orbitRadius,
    };
  }
}
