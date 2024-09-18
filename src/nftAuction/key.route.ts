import { Router } from "express";
import { onManageKey } from "./key.controller";

export const manageKey = Router()

manageKey.post("/", onManageKey.doSaveKey);

manageKey.get("/", onManageKey.doGetKey);

manageKey.post("/update-owner", onManageKey.doChangeKeyOwner);