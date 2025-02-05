import { DiceTypes } from "@/types";

import { D10 } from "./D10";
import { D20 } from "./D20";
import { D4 } from "./D4";
import { D6 } from "./D6";
import { D8 } from "./D8";

const DiceTypeIcons = {
  [DiceTypes.D4]: D4,
  [DiceTypes.D6]: D6,
  [DiceTypes.D8]: D8,
  [DiceTypes.D10]: D10,
  [DiceTypes.D20]: D20,
};

export default DiceTypeIcons;
