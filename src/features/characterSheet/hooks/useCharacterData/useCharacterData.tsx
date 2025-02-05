import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { useCharacterSheetContext } from "@/features/context/CharacterSheetContext";
import {
  FirestoreAbility,
  FirestoreOrganization,
  useAbilityDoc,
  useCharacterDoc,
  useOrganizationDoc,
} from "@/features/firebase/firestore";
import { PLACEHOLDER_MISSING_INFO } from "@/utils";

const PLACEHOLDER_ABILITY = {
  name: PLACEHOLDER_MISSING_INFO,
  id: PLACEHOLDER_MISSING_INFO,
  isMagic: false,
} as FirestoreAbility;

export function useCharacterData() {
  const searchParams = useSearchParams();
  const characterId = searchParams.get("id");

  const { readCharacterDoc } = useCharacterDoc();
  const { readAbilityDoc } = useAbilityDoc();
  const { readOrganizationDoc } = useOrganizationDoc();

  const {
    characterData,
    setCharacterData,
    setCharacterAbilities,
    setCharacterOrganization,
  } = useCharacterSheetContext();

  useEffect(() => {
    // TODO - filter sensitive data to player
    // TODO - if no characterId was provided, then redirect to default user character
    if (!characterId) {
      setCharacterData(null);
      return;
    }

    const _readCharacterDoc = async () => {
      const characterData = await readCharacterDoc(characterId);
      setCharacterData(characterData);

      console.log("<><>", characterData?.abilities);

      const abilitiesData =
        characterData?.abilities && characterData.abilities.length
          ? characterData?.abilities
              .filter((ability) => !!ability) // Remove any possible nullish value
              .map((abilityId) => readAbilityDoc(abilityId))
          : [PLACEHOLDER_ABILITY];

      const organizationData = characterData?.affiliation
        ? readOrganizationDoc(characterData?.affiliation.organization)
        : ({
            name: PLACEHOLDER_MISSING_INFO,
            id: PLACEHOLDER_MISSING_INFO,
            members: [],
            roles: [],
          } as FirestoreOrganization);

      setCharacterAbilities(
        (await Promise.all(abilitiesData)).filter(
          (ability) => !!ability
        ) as FirestoreAbility[] // TODO - is it safe?
      );
      setCharacterOrganization(await organizationData);
    };
    _readCharacterDoc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characterId]);

  return characterData;
}
