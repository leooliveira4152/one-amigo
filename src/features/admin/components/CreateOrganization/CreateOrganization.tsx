import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { FormCheckbox, FormText } from "@/components/Form";
import { useSnackbarContext } from "@/features/context/SnackbarContext";
import { createOrganization, FirestoreOrganization } from "@/features/firebase/firestore";

const DEFAULT_FORM_VALUES: FirestoreOrganization = {
  name: "",
  id: "",
  members: [],
  roles: [],
  pirateCrew: false,
};

enum PIRATE_CREW_ROLES {
  CAPTAIN = "Capitão",
  VICE_CAPTAIN = "Vice-capitão",
  THIRD_IN_COMMAND = "Terceiro comandante",
  FOURTH_IN_COMMAND = "Quarto comandante",
  FIFTH_IN_COMMAND = "Quinto comandante",
  MEMBER = "Tripulante",
}

export function CreateOrganization() {
  const { openSnackbar } = useSnackbarContext();
  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const [loading, setLoading] = useState(false);
  const isPirateCrew = watch("pirateCrew");

  return (
    <Box component="form">
      <Typography textAlign="center" className="mb-4">
        {"Criar organização"}
      </Typography>
      <Box display="flex" flexDirection="column" gap={1.5}>
        <FormText control={control} required name="name" label="Nome" />
        <FormText control={control} required name="id" label="Id" />
        <FormCheckbox control={control} name="pirateCrew" label="Tripulação pirata" />
        <FormText
          control={control}
          multiInput
          name="roles"
          label="Funções"
          disabled={isPirateCrew}
          required={!isPirateCrew}
        />
        <Button variant="contained" disabled={loading} onClick={handleSubmit(onSubmit)}>
          {"Criar"}
        </Button>
      </Box>
    </Box>
  );

  async function onSubmit(organizationData: typeof DEFAULT_FORM_VALUES) {
    if (organizationData.pirateCrew)
      organizationData.roles = Object.values(PIRATE_CREW_ROLES);

    try {
      setLoading(true);
      await createOrganization(organizationData);
      openSnackbar({ content: "Organização criada com sucesso", severity: "success" });
      reset();
    } catch (err) {
      openSnackbar({ content: `${err}`, severity: "error" });
    }
    setLoading(false);
  }
}
