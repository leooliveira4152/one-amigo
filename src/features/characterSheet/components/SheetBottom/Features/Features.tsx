import { faker } from "@faker-js/faker";
import { Box, Tab, Tabs } from "@mui/material";
import { useTranslations } from "next-intl";
import { SyntheticEvent, useState } from "react";

import { useCharacterSheetContext } from "@/features/context/CharacterSheetContext";
import { randomNumber } from "@/utils";

import { LabelValue } from "../../LabelValue";
import { SheetBottomLayout } from "../SheetBottomLayout";

enum FeaturesTabs {
  ALL = "all",
  CHARACTER = "character",
}

export function Features() {
  const tabsTexts = useTranslations("characterSheet.bottom.features.tabs");
  const contentTexts = useTranslations("characterSheet.bottom.features");

  const { characterData, characterAbilities } = useCharacterSheetContext();
  const [currentTab, setCurrentTab] = useState<FeaturesTabs | string>(FeaturesTabs.ALL);

  if (!characterData) return null;
  return (
    <Box>
      <Tabs value={currentTab} onChange={handleTabChange} className="pb-2">
        <Tab label={tabsTexts(FeaturesTabs.ALL)} value={FeaturesTabs.ALL} />
        <Tab label={tabsTexts(FeaturesTabs.CHARACTER)} value={FeaturesTabs.CHARACTER} />
        {characterAbilities?.map(({ name }) => (
          <Tab key={name} label={name} value={name} />
        ))}
      </Tabs>

      {[{ name: tabsTexts(FeaturesTabs.CHARACTER) }, ...(characterAbilities ?? [])].map(
        ({ name }) => (
          <SheetBottomLayout
            key={name}
            title={contentTexts("subtitle", { feature: name })}
            visible={[FeaturesTabs.ALL, name].includes(currentTab)}
          >
            {Array.from({ length: randomNumber(4) + 2 }).map((_, index) => (
              <LabelValue
                key={index}
                label={faker.lorem.words(randomNumber(2) + 2)}
                value={faker.lorem.paragraph()}
              />
            ))}
          </SheetBottomLayout>
        )
      )}
    </Box>
  );

  function handleTabChange(_event: SyntheticEvent, updatedTab: FeaturesTabs | string) {
    setCurrentTab(updatedTab);
  }
}
