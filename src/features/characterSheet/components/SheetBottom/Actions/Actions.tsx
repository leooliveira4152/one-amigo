import { faker } from "@faker-js/faker";
import { Box, Tab, Tabs } from "@mui/material";
import { useTranslations } from "next-intl";
import { SyntheticEvent, useMemo, useState } from "react";

import { useCharacterSheetContext } from "@/features/context/CharacterSheetContext";
import { mockAttacks } from "@/test/mocks";
import { randomNumber } from "@/utils";

import { LabelValue } from "../../LabelValue";
import { AttackTable } from "../AttackTable";
import { SheetBottomLayout } from "../SheetBottomLayout";

enum ActionTabs {
  ALL = "all",
  ACTIONS = "actions",
  BONUS_ACTIONS = "bonusActions",
  REACTION = "reaction",
  OTHERS = "others",
}

export function Actions() {
  const tabsTexts = useTranslations("characterSheet.bottom.actions.tabs");
  const actionsTexts = useTranslations("characterSheet.bottom.actions");

  const { characterData } = useCharacterSheetContext();
  const [currentTab, setCurrentTab] = useState<ActionTabs>(ActionTabs.ALL);

  const attacks = useMemo(() => mockAttacks(10), []);

  if (!characterData) return null;
  return (
    <Box>
      <Tabs value={currentTab} onChange={handleTabChange} className="pb-2">
        <Tab label={tabsTexts(ActionTabs.ALL)} value={ActionTabs.ALL} />
        <Tab label={tabsTexts(ActionTabs.ACTIONS)} value={ActionTabs.ACTIONS} />
        <Tab
          label={tabsTexts(ActionTabs.BONUS_ACTIONS)}
          value={ActionTabs.BONUS_ACTIONS}
        />
        <Tab label={tabsTexts(ActionTabs.REACTION)} value={ActionTabs.REACTION} />
        <Tab label={tabsTexts(ActionTabs.OTHERS)} value={ActionTabs.OTHERS} />
      </Tabs>

      <SheetBottomLayout
        title={tabsTexts(ActionTabs.ACTIONS)}
        subtitle={actionsTexts("attack.subtitle", { attacksPerAction: 2 })}
        visible={[ActionTabs.ALL, ActionTabs.ACTIONS].includes(currentTab)}
      >
        <AttackTable rows={attacks} />
        {Array.from({ length: randomNumber(3) + 2 }).map((_, index) => (
          <LabelValue
            key={index}
            label={faker.lorem.words(randomNumber(2) + 2)}
            value={faker.lorem.paragraph()}
          />
        ))}
      </SheetBottomLayout>

      <SheetBottomLayout
        title={tabsTexts(ActionTabs.BONUS_ACTIONS)}
        visible={[ActionTabs.ALL, ActionTabs.BONUS_ACTIONS].includes(currentTab)}
      >
        <AttackTable rows={attacks.slice(0, randomNumber(2) + 1)} />
        {Array.from({ length: randomNumber(3) + 2 }).map((_, index) => (
          <LabelValue
            key={index}
            label={faker.lorem.words(randomNumber(2) + 2)}
            value={faker.lorem.paragraph()}
          />
        ))}
      </SheetBottomLayout>

      <SheetBottomLayout
        title={tabsTexts(ActionTabs.REACTION)}
        visible={[ActionTabs.ALL, ActionTabs.REACTION].includes(currentTab)}
      >
        {Array.from({ length: randomNumber(3) + 2 }).map((_, index) => (
          <LabelValue
            key={index}
            label={faker.lorem.words(randomNumber(2) + 2)}
            value={faker.lorem.paragraph()}
          />
        ))}
      </SheetBottomLayout>

      <SheetBottomLayout
        title={tabsTexts(ActionTabs.OTHERS)}
        visible={[ActionTabs.ALL, ActionTabs.OTHERS].includes(currentTab)}
      >
        {Array.from({ length: randomNumber(3) + 2 }).map((_, index) => (
          <LabelValue
            key={index}
            label={faker.lorem.words(randomNumber(2) + 2)}
            value={faker.lorem.paragraph()}
          />
        ))}
      </SheetBottomLayout>
    </Box>
  );

  function handleTabChange(_event: SyntheticEvent, updatedTab: ActionTabs) {
    setCurrentTab(updatedTab);
  }
}
