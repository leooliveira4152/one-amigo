import { Box, Button, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { FormCheckbox, FormText } from "@/components/Form";
import { useSnackbarContext } from "@/features/context/SnackbarContext";
import { FirestoreOrganization, useOrganizationDoc } from "@/features/firebase/firestore";

const DEFAULT_FORM_VALUES: FirestoreOrganization = {
  name: "",
  id: "",
  members: [],
  roles: [],
  pirateCrew: false,
};

export function CreateOrganization() {
  const t = useTranslations("admin.createOrganization");
  const { openSnackbar } = useSnackbarContext();
  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: DEFAULT_FORM_VALUES,
  });
  const { createOrganization } = useOrganizationDoc();

  const [loading, setLoading] = useState(false);
  const isPirateCrew = watch("pirateCrew");

  return (
    <Box component="form">
      <Typography className="mb-4 text-center">{t("title")}</Typography>
      <Box display="flex" flexDirection="column" gap={1.5}>
        <FormText control={control} required name="name" label={t("name")} />
        <FormText control={control} required name="id" label={t("id")} />
        <FormCheckbox control={control} name="pirateCrew" label={t("pirateCrew")} />
        <FormText
          control={control}
          multiInput
          name="roles"
          label={t("roles")}
          disabled={isPirateCrew}
          required={!isPirateCrew}
        />
        <Button variant="contained" disabled={loading} onClick={handleSubmit(onSubmit)}>
          {t("submit")}
        </Button>
      </Box>
    </Box>
  );

  async function onSubmit(organizationData: typeof DEFAULT_FORM_VALUES) {
    // As of 15/10/2024, next-intl doesn't support array returns
    // https://next-intl-docs.vercel.app/docs/usage/messages#arrays-of-messages
    const pirateCrewRolesKeys = [
      "captain",
      "secondInCommand",
      "thirdInCommand",
      "fourthInCommand",
      "fifthInCommand",
      "member",
    ] as const;

    if (organizationData.pirateCrew)
      organizationData.roles = pirateCrewRolesKeys.map((key) =>
        t(`pirateCrewRoles.${key}`)
      );

    try {
      setLoading(true);
      await createOrganization(organizationData);
      openSnackbar({ content: t("success"), severity: "success" });
      reset();
    } catch (err) {
      openSnackbar({ content: `${err}`, severity: "error" });
    }
    setLoading(false);
  }
}
