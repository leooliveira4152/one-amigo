import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { useTranslations } from "next-intl";

import AttackTypeIcons from "@/components/Icons/AttackTypeIcons";
import { FirestoreAbilityAction } from "@/features/firebase/firestore";

import { ModifiedNumberDisplay } from "../../ModifiedNumberDisplay";

export function AttackTable({ rows }: { rows: FirestoreAbilityAction[] }) {
  const t = useTranslations("characterSheet.bottom.table");

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell />
          <TableCell>{t("name")}</TableCell>
          <TableCell>{t("range")}</TableCell>
          <TableCell className="max-w-40">
            {t("hitModifier")} / {t("savingThrow")}
          </TableCell>
          <TableCell className="max-w-20">{`${t("damage")} / ${t("effect")}`}</TableCell>
          <TableCell>{t("notes")}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id}>
            <TableCell>{AttackTypeIcons[row.attackType]({ width: 25 })}</TableCell>
            <TableCell>{row.name}</TableCell>
            <TableCell>
              <ModifiedNumberDisplay
                {...row.range}
                suffix={t("rangeUnit")}
                signed={false}
              />
            </TableCell>
            <TableCell>
              {row.savingThrow?.value ? (
                <ModifiedNumberDisplay
                  {...row.savingThrow!}
                  suffix={" " + t(`attributes.${row.savingThrow.attribute}Abv`)}
                  signed={false}
                />
              ) : (
                <ModifiedNumberDisplay {...row.hitModifier!} />
              )}
            </TableCell>
            <TableCell>
              {row.damage ? (
                <ModifiedNumberDisplay {...row.damage} signed={false} />
              ) : (
                t(`effectTypes.${row.effect}`)
              )}
            </TableCell>
            <TableCell>{row.notes?.join("; ")}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
