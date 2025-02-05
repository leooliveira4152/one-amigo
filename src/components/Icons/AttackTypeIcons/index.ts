import { AttackTypes } from "@/features/firebase/firestore";

import { MagicIcon } from "./MagicIcon";
import { MeleeWeaponIcon } from "./MeleeWeaponIcon";
import { RangedWeaponIcon } from "./RangedWeaponIcon";
import { UnarmedStrikeIcon } from "./UnarmedStrikeIcon";

const AttackTypeIcons = {
  [AttackTypes.MAGIC]: MagicIcon,
  [AttackTypes.MELEE_WEAPON]: MeleeWeaponIcon,
  [AttackTypes.RANGED_WEAPON]: RangedWeaponIcon,
  [AttackTypes.UNARMED_STRIKE]: UnarmedStrikeIcon,
};

export default AttackTypeIcons;
