import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from "react";

import {
  FirestoreAbility,
  FirestoreCharacter,
  FirestoreOrganization,
} from "@/features/firebase/firestore";

type CharacterSheetContextType = {
  characterData: FirestoreCharacter | null;
  setCharacterData: Dispatch<SetStateAction<FirestoreCharacter | null>>;
  characterAbilities: FirestoreAbility[] | null;
  setCharacterAbilities: Dispatch<SetStateAction<FirestoreAbility[] | null>>;
  characterOrganization: FirestoreOrganization | null;
  setCharacterOrganization: Dispatch<SetStateAction<FirestoreOrganization | null>>;
};

const defaultValues = {
  characterData: null,
  setCharacterData: () => {},
  characterAbilities: null,
  setCharacterAbilities: () => {},
  characterOrganization: null,
  setCharacterOrganization: () => {},
};

const CharacterSheetContext = createContext<CharacterSheetContextType>(defaultValues);

export const CharacterSheetProvider = ({ children }: PropsWithChildren) => {
  const [characterData, setCharacterData] =
    useState<CharacterSheetContextType["characterData"]>(null);
  const [characterAbilities, setCharacterAbilities] =
    useState<CharacterSheetContextType["characterAbilities"]>(null);
  const [characterOrganization, setCharacterOrganization] =
    useState<CharacterSheetContextType["characterOrganization"]>(null);

  return (
    <CharacterSheetContext.Provider
      value={{
        characterData,
        setCharacterData,
        characterAbilities,
        setCharacterAbilities,
        characterOrganization,
        setCharacterOrganization,
      }}
    >
      {children}
    </CharacterSheetContext.Provider>
  );
};

export const useCharacterSheetContext = () => {
  return useContext(CharacterSheetContext);
};
