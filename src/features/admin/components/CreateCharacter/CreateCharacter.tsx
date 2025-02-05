import { Box, Button, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { FormSelect, FormText } from "@/components/Form";
import { useSnackbarContext } from "@/features/context/SnackbarContext";
import {
  FirestoreAbility,
  FirestoreCharacter,
  FirestoreOrganization,
  useAbilityDoc,
  useCharacterDoc,
  useOrganizationDoc,
} from "@/features/firebase/firestore";

// TODO - Add common roles enum

const DEFAULT_FORM_VALUES: Omit<FirestoreCharacter, "id"> = {
  name: "",
  nickname: "",
  abilities: [],
  affiliation: { organization: "", roles: [] },
  deathSave: { failed: 0, success: 0 },
};

export function CreateCharacter() {
  const t = useTranslations("admin.createCharacter");
  const { openSnackbar } = useSnackbarContext();
  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: DEFAULT_FORM_VALUES,
  });
  const { listOrganizations } = useOrganizationDoc();
  const { createCharacter } = useCharacterDoc();
  const { listAbilities } = useAbilityDoc();

  const [loading, setLoading] = useState({
    formSubmit: false,
    organizations: true,
    abilities: true,
  });

  const [abilitiesData, setAbilitiesData] = useState<FirestoreAbility[]>([]);
  const [organizationsData, setOrganizationsData] = useState<FirestoreOrganization[]>([]);

  const selectedOrganization = watch("affiliation.organization");
  const availableRoles = useMemo(() => {
    const _selectedOrganization = organizationsData.find(
      ({ id }) => id === selectedOrganization
    );
    return _selectedOrganization?.roles;
  }, [organizationsData, selectedOrganization]);

  return (
    <Box component="form">
      <Typography className="mb-4 text-center">{t("title")}</Typography>
      <Box display="flex" flexDirection="column" gap={1.5}>
        <FormText control={control} required name="name" label={t("name")} />
        <FormText control={control} name="nickname" label={t("nickname")} />
        <FormSelect
          control={control}
          multiple
          required
          name="abilities"
          label={t("abilities")}
          onOpen={loadAbilities}
          options={abilitiesData.map(({ id, name }) => ({ label: name, value: id }))}
        />
        <Box display="flex" flexDirection="column" className="mt-4" gap={1.5}>
          <FormSelect
            control={control}
            required
            name="affiliation.organization"
            label={t("organization")}
            onOpen={loadOrganizations}
            options={organizationsData.map(({ id, name }) => ({
              label: name,
              value: id,
            }))}
          />
          {availableRoles?.length && (
            <FormSelect
              control={control}
              multiple
              required
              name="affiliation.roles"
              label={t("roles")}
              options={availableRoles.map((name) => ({ label: name, value: name }))}
            />
          )}
        </Box>
        <Button
          variant="contained"
          disabled={loading.formSubmit}
          onClick={handleSubmit(onSubmit)}
        >
          {t("submit")}
        </Button>
      </Box>
    </Box>
  );

  async function loadAbilities() {
    if (abilitiesData.length) return;
    if (!loading.abilities) setLoading((prev) => ({ ...prev, abilities: true }));
    setAbilitiesData(await listAbilities());
    setLoading((prev) => ({ ...prev, abilities: false }));
  }

  async function loadOrganizations() {
    if (organizationsData.length) return;
    if (!loading.organizations) setLoading((prev) => ({ ...prev, organizations: true }));
    setOrganizationsData(await listOrganizations());
    setLoading((prev) => ({ ...prev, organizations: false }));
  }

  async function onSubmit(characterData: typeof DEFAULT_FORM_VALUES) {
    try {
      setLoading((prev) => ({ ...prev, formSubmit: true }));
      await createCharacter(characterData);
      openSnackbar({ content: t("success"), severity: "success" });
      reset();
    } catch (err) {
      openSnackbar({ content: `${err}`, severity: "error" });
    }
    setLoading((prev) => ({ ...prev, formSubmit: false }));
  }
}
