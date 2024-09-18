import { Router } from "express";
import { onManagePost } from "../controllers/post.controller";

export const managePost = Router()

managePost.post("/", onManagePost.doSavePost);

managePost.post("/edit", onManagePost.doEditPost);

managePost.post("/reward", onManagePost.doReward);

managePost.post("/take-reward-back", onManagePost.doTakeRewardBack);

managePost.get("/", onManagePost.doGetPosts);

managePost.post("/comment", onManagePost.doSaveComment);

managePost.post("/comment/edit", onManagePost.doEditComment);

managePost.get("/comments", onManagePost.doGetCommentsinPosts);
