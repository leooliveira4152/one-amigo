import { Box, Button, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { FormSelect, FormText } from "@/components/Form";
import { useSnackbarContext } from "@/features/context/SnackbarContext";
import {
  createCharacter,
  FirestoreAbility,
  FirestoreCharacter,
  FirestoreOrganization,
  listAbilities,
} from "@/features/firebase/firestore";
import { listOrganizations } from "@/features/firebase/firestore/manageOrganizationDoc/manageOrganizationDoc";

// TODO - Add common roles enum

const DEFAULT_FORM_VALUES: FirestoreCharacter = {
  name: "",
  nickname: "",
  ability: "",
  affiliation: { organization: "", roles: [] },
};

export function CreateCharacter() {
  const { openSnackbar } = useSnackbarContext();
  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: DEFAULT_FORM_VALUES,
  });

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
      <Typography textAlign="center" className="mb-4">
        {"Criar personagem"}
      </Typography>
      <Box display="flex" flexDirection="column" gap={1.5}>
        <FormText control={control} required name="name" label="Nome" />
        <FormText control={control} required name="nickname" label="Apelido" />
        <FormSelect
          control={control}
          name="ability"
          label="Habilidade"
          onOpen={loadAbilities}
          options={abilitiesData.map(({ id, name }) => ({ label: name, value: id }))}
        />
        <Box display="flex" flexDirection="column" className="mt-4" gap={1.5}>
          <FormSelect
            control={control}
            required
            name="affiliation.organization"
            label="Organização"
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
              label="Funções"
              options={availableRoles.map((name) => ({ label: name, value: name }))}
            />
          )}
        </Box>
        <Button
          variant="contained"
          disabled={loading.formSubmit}
          onClick={handleSubmit(onSubmit)}
        >
          {"Criar"}
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

  async function onSubmit(characterData: FirestoreCharacter) {
    try {
      setLoading((prev) => ({ ...prev, formSubmit: true }));
      await createCharacter(characterData);
      openSnackbar({ content: "Personagem criada com sucesso", severity: "success" });
      reset();
    } catch (err) {
      openSnackbar({ content: `${err}`, severity: "error" });
    }
    setLoading((prev) => ({ ...prev, formSubmit: false }));
  }
}
