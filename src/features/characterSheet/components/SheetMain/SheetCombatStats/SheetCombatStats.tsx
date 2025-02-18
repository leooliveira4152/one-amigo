import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";

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

const INCREMENT_RADIUS = Math.PI / 600;
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

  const positionDegree = DEFAULT_SPACING * index - DEFAULT_OFFSET;

  return (
    <Box
      position="absolute"
      top={Math.floor((CHARACTER_IMAGE_SIZE / 2) * (1 + Math.sin(positionDegree)))}
      left={Math.floor(
        (CHARACTER_IMAGE_SIZE / 2) * (1 + Math.cos(positionDegree)) +
          CHARACTER_IMAGE_LEFT_MARGIN
      )}
      style={{ transform: "translateX(-50%) translateY(-50%)" }}
    >
      <OrbitAnimation />
      <Box
        className="flex absolute justify-center items-center rounded-full size-[64px] top-1/2 left-1/2"
        style={{
          backgroundColor: CONTENT_COLOR,
          transform: "translateX(-50%) translateY(-50%)",
        }}
      >
        <StatValue statValue={statValue} maxHp={maxHp} />
      </Box>
      <Typography className="absolute w-full font-alegreya text-center">
        {t(stat)}
      </Typography>
    </Box>
  );
}

type StatValueProps = {
  statValue: number | typeof PLACEHOLDER_MISSING_INFO;
  maxHp?: number;
};

function StatValue({ statValue, maxHp }: StatValueProps) {
  const hasValue = statValue !== PLACEHOLDER_MISSING_INFO;

  // Arbitrary margin values to match Alegreya's font issue with centralized number display
  let style: CSSProperties = { fontSize: 50, lineHeight: 1 };
  if (hasValue) {
    if (maxHp) style = { ...style, fontSize: 24, marginTop: -4 };
    else if (statValue < 100) style = { ...style, marginTop: -11, marginLeft: 2 };
    else style = { ...style, fontSize: 40, marginTop: -7, marginLeft: 3 };
  } else style = { ...style, fontSize: 40 };

  return (
    <Typography
      className={`font-alegreya font-medium text-primary-600 text-center`}
      style={style}
    >
      {maxHp ? `${statValue}/ ${maxHp}` : statValue}
    </Typography>
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
