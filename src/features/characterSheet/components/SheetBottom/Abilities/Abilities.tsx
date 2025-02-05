import { Box, Tab, Tabs } from "@mui/material";
import { useTranslations } from "next-intl";
import { SyntheticEvent, useMemo, useState } from "react";

import { useCharacterSheetContext } from "@/features/context/CharacterSheetContext";
import { mockAttacks } from "@/test/mocks";
import { randomNumber } from "@/utils";

import { AttackTable } from "../AttackTable";
import { SheetBottomLayout } from "../SheetBottomLayout";

type AbilitiesTabs = number | "all";

export function Abilities() {
  const abilitiesTexts = useTranslations("characterSheet.bottom.abilities");

  const { characterData } = useCharacterSheetContext();
  const [currentTab, setCurrentTab] = useState<AbilitiesTabs>("all");

  const attacks = useMemo(
    () =>
      Array.from({ length: randomNumber(4) + 2 }).map((_, index) =>
        mockAttacks(randomNumber(5 - index) + 1)
      ),
    []
  );

  if (!characterData) return null;
  return (
    <Box>
      <Tabs value={currentTab} onChange={handleTabChange} className="pb-2">
        <Tab label={abilitiesTexts("tabs.all")} value="all" />
        {attacks.map((_, index) => (
          <Tab
            key={index}
            label={
              index === 0
                ? abilitiesTexts("tabs.cantrip")
                : abilitiesTexts("tabs.abilityLevel", { level: index })
            }
            value={index}
          />
        ))}
      </Tabs>

      {attacks.map((currentLevelAttacks, index) => (
        <SheetBottomLayout
          key={index}
          visible={["all", index].includes(currentTab)}
          title={
            index === 0
              ? abilitiesTexts("tabs.cantrip")
              : abilitiesTexts("tabs.abilityLevel", { level: index })
          }
        >
          <AttackTable rows={currentLevelAttacks} />
        </SheetBottomLayout>
      ))}
    </Box>
  );

  function handleTabChange(_event: SyntheticEvent, updatedTab: AbilitiesTabs) {
    setCurrentTab(updatedTab);
  }
}
