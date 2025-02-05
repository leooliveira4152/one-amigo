import { faker } from "@faker-js/faker";
import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { useCharacterSheetContext } from "@/features/context/CharacterSheetContext";
import { FirestoreCharacterInventory } from "@/features/firebase/firestore";
import { randomNumber } from "@/utils";

export function Inventory() {
  const t = useTranslations("characterSheet.bottom.inventory.columns");
  const { characterData } = useCharacterSheetContext();
  const rows = useMemo(mockInventory, []);

  if (!characterData) return null;
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>{t("equipped")}</TableCell>
          <TableCell>{t("name")}</TableCell>
          <TableCell>{t("quantity")}</TableCell>
          <TableCell>{t("notes")}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, index) => (
          <TableRow key={`${row.name}${index}`}>
            <TableCell>
              <Checkbox checked={row.equipped} />
            </TableCell>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.quantity}</TableCell>
            <TableCell>{row.notes?.join("; ")}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function mockInventory() {
  const inventory: FirestoreCharacterInventory[] = [];
  for (let i = 0; i <= randomNumber(10) + 5; i++) {
    inventory.push({
      equipped: randomNumber(3) > 2 ? true : false,
      name: faker.lorem.words(randomNumber(2) + 1),
      quantity: randomNumber(10),
      notes: Array(randomNumber(3)).fill(null).map(faker.lorem.word),
      description: faker.lorem.paragraph(),
    });
  }
  return inventory;
}
