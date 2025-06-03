import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import express from "express";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

import { AppModule } from "./nest/app.module";

admin.initializeApp();

export const helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase Functions!");
});

// --- NestJS API setup ---

const server = express();

const nestAppPromise = NestFactory.create(AppModule, new ExpressAdapter(server)).then(
  (app) => app.init()
);

export const api = functions.https.onRequest(async (request, response) => {
  await nestAppPromise;
  server(request, response);
});
