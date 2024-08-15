import { getAuth } from "firebase/auth";
import { app } from "../client";

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
app;

export const auth = getAuth();
