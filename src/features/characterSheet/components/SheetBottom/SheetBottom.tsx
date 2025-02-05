import { Box, Tab, Tabs } from "@mui/material";
import { useTranslations } from "next-intl";
import { SyntheticEvent, useState } from "react";

import { Abilities } from "./Abilities";
import { Actions } from "./Actions";
import { Background } from "./Background";
import { Features } from "./Features";
import { Inventory } from "./Inventory";

enum SheetBottomTabs {
  ACTIONS = "actions",
  SPELLS = "spells",
  INVENTORY = "inventory",
  FEATURES = "features",
  BACKGROUND = "background",
}

export function SheetBottom() {
  const t = useTranslations("characterSheet.bottom.tabs.titles");
  const [currentTab, setCurrentTab] = useState(SheetBottomTabs.ACTIONS);

  return (
    <Box className="mx-10 p-2 bg-primary-dark">
      <Tabs value={currentTab} onChange={handleTabChange}>
        <Tab label={t(SheetBottomTabs.ACTIONS)} value={SheetBottomTabs.ACTIONS} />
        <Tab label={t(SheetBottomTabs.SPELLS)} value={SheetBottomTabs.SPELLS} />
        <Tab label={t(SheetBottomTabs.INVENTORY)} value={SheetBottomTabs.INVENTORY} />
        <Tab label={t(SheetBottomTabs.FEATURES)} value={SheetBottomTabs.FEATURES} />
        <Tab label={t(SheetBottomTabs.BACKGROUND)} value={SheetBottomTabs.BACKGROUND} />
      </Tabs>
      <Box>{currentTab === SheetBottomTabs.ACTIONS && <Actions />}</Box>
      <Box>{currentTab === SheetBottomTabs.SPELLS && <Abilities />}</Box>
      <Box>{currentTab === SheetBottomTabs.INVENTORY && <Inventory />}</Box>
      <Box>{currentTab === SheetBottomTabs.FEATURES && <Features />}</Box>
      <Box>{currentTab === SheetBottomTabs.BACKGROUND && <Background />}</Box>
    </Box>
  );

  function handleTabChange(_event: SyntheticEvent, updatedTab: SheetBottomTabs) {
    setCurrentTab(updatedTab);
  }
}
