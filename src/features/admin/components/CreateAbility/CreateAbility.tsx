import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { FormCheckbox, FormText } from "@/components/Form";
import { useSnackbarContext } from "@/features/context/SnackbarContext";
import { createAbility, FirestoreAbility } from "@/features/firebase/firestore";

const DEFAULT_FORM_VALUES: FirestoreAbility = {
  name: "",
  id: "",
  description: "",
  isMagic: false,
};

export function CreateAbility() {
  const { openSnackbar } = useSnackbarContext();
  const { control, handleSubmit, reset } = useForm({
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const [loading, setLoading] = useState(false);

  return (
    <Box component="form">
      <Typography textAlign="center" className="mb-4">
        {"Criar habilidade"}
      </Typography>
      <Box display="flex" flexDirection="column" gap={1.5}>
        <FormText control={control} required name="name" label="Nome" />
        <FormText control={control} required name="id" label="Id" />
        <FormText control={control} name="description" label="Descrição" multiline />
        <FormCheckbox control={control} name="isMagic" label="Akuma no Kukki" />
        <Button variant="contained" disabled={loading} onClick={handleSubmit(onSubmit)}>
          {"Criar"}
        </Button>
      </Box>
    </Box>
  );

  async function onSubmit(abilityData: FirestoreAbility) {
    try {
      setLoading(true);
      await createAbility(abilityData);
      openSnackbar({ content: "Habilidade criada com sucesso", severity: "success" });
      reset();
    } catch (err) {
      openSnackbar({ content: `${err}`, severity: "error" });
    }
    setLoading(false);
  }
}
