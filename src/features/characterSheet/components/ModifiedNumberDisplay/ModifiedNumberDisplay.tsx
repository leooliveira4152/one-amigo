import { Button, Tooltip, Typography } from "@mui/material";
import { useFormatter, useTranslations } from "next-intl";
import { ComponentProps, useEffect, useState } from "react";

import DiceTypeIcons from "@/components/Icons/DiceIcons";
import { useCharacterSheetContext } from "@/features/context/CharacterSheetContext";
import { DamageTypes, ValueWithModifier } from "@/features/firebase/firestore";
import { DiceTypes } from "@/types";
import { getObjectEntries, PLACEHOLDER_MISSING_INFO } from "@/utils";

type ModifiedNumberDisplayProps = ValueWithModifier & {
  type?: DamageTypes;
  dice?: DiceTypes;
  suffix?: string;
  signed?: boolean;
};

export function ModifiedNumberDisplay({
  value,
  modifier,
  type,
  dice,
  suffix,
  signed = true,
}: ModifiedNumberDisplayProps) {
  const t = useTranslations("characterSheet.bottom.actions.valueDisplay");
  const { number } = useFormatter();
  const { characterData } = useCharacterSheetContext();

  const [finalValue, setFinalValue] = useState<string>();
  const [tooltipModifiersText, setTooltipModifiersText] = useState<string[]>([]);

  console.log("modifier", modifier, value);

  useEffect(() => {
    const tooltipModifiersText: string[] = [];
    let updatedValue = value;

    if (characterData?.attributes && modifier)
      getObjectEntries(modifier).forEach((entries) => {
        const [attribute, modifier] = entries ?? [];
        if (!attribute || !modifier) return;
        const currentModifierResult = Math.floor(
          characterData.attributes![attribute].value * modifier
        );

        updatedValue += currentModifierResult;
        tooltipModifiersText.push(
          t("modifier", {
            value: currentModifierResult,
            modifier: modifier * 100,
            attribute: t(`attributes.${attribute}Abv`),
          })
        );
      });

    setFinalValue(
      signed ? `${updatedValue >= 0 ? "+" : ""}${updatedValue}` : `${updatedValue}`
    );
    setTooltipModifiersText(tooltipModifiersText);
  }, [characterData?.attributes, modifier, number, signed, t, value]);

  const tooltipBase = `${t("base", { value })}`;
  const tooltipContent = `${[tooltipBase, ...tooltipModifiersText].join(
    " + "
  )} = ${finalValue}`;

  return (
    <Tooltip
      title={<Typography className="max-w-48 text-xs">{tooltipContent}</Typography>}
      placement="right"
    >
      <Button
        color={"white" as ComponentProps<typeof Button>["color"]}
        variant="outlined"
        sx={{ textTransform: "none", "&:hover": { background: "rgba(255,255,255,0.2)" } }}
      >
        {finalValue ? (
          <>
            {finalValue}
            {suffix} {type ? t(`damageTypes.${type}`) : ""}
            <>{dice && DiceTypeIcons[dice]({ width: 25 })}</>
          </>
        ) : (
          PLACEHOLDER_MISSING_INFO
        )}
      </Button>
    </Tooltip>
  );
}
