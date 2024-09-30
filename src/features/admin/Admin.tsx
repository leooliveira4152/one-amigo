"use client";

import { Grid2 } from "@mui/material";

import NotFound from "@/app/not-found";

import { CreateCharacter, CreateOrganization, CreateAbility } from "./components";
import { useUserStore } from "../store/user";

function AdminContent() {
  return (
    <Grid2 container className="w-full justify-around">
      {[
        <CreateCharacter key={1} />,
        <CreateAbility key={2} />,
        <CreateOrganization key={3} />,
      ].map((element, index) => (
        <Grid2 key={index} size={3.5} className="p-4 outline-2 outline-white outline">
          {element}
        </Grid2>
      ))}
    </Grid2>
  );
}

export function Admin() {
  const { currentUser } = useUserStore();

  if (!currentUser) return null;
  if (!currentUser?.admin) return <NotFound />;
  return <AdminContent />;
}
