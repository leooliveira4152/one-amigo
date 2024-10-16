import { Box, Button, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { FormCheckbox, FormText } from "@/components/Form";
import { useSnackbarContext } from "@/features/context/SnackbarContext";
import { FirestoreAbility, useAbilityDoc } from "@/features/firebase/firestore";

const DEFAULT_FORM_VALUES: FirestoreAbility = {
  name: "",
  id: "",
  description: "",
  isMagic: false,
};

export function CreateAbility() {
  const t = useTranslations("admin.createAbility");
  const { openSnackbar } = useSnackbarContext();
  const { control, handleSubmit, reset } = useForm({
    defaultValues: DEFAULT_FORM_VALUES,
  });
  const { createAbility } = useAbilityDoc();

  const [loading, setLoading] = useState(false);

  return (
    <Box component="form">
      <Typography textAlign="center" className="mb-4">
        {t("title")}
      </Typography>
      <Box display="flex" flexDirection="column" gap={1.5}>
        <FormText control={control} required name="name" label={t("name")} />
        <FormText control={control} required name="id" label={t("id")} />
        <FormText
          control={control}
          name="description"
          label={t("description")}
          multiline
        />
        <FormCheckbox control={control} name="isMagic" label={t("magicSource")} />
        <Button variant="contained" disabled={loading} onClick={handleSubmit(onSubmit)}>
          {t("submit")}
        </Button>
      </Box>
    </Box>
  );

  async function onSubmit(abilityData: FirestoreAbility) {
    try {
      setLoading(true);
      await createAbility(abilityData);
      openSnackbar({ content: t("success"), severity: "success" });
      reset();
    } catch (err) {
      openSnackbar({ content: `${err}`, severity: "error" });
    }
    setLoading(false);
  }
}
