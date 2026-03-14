import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";

import {
  createGroup,
  getUserGroups,
  getGroupMessages,
    sendGroupMessage,
  addMembersToGroup,
} from "../controllers/group.controller.js";

const router = express.Router();

router.post("/create", protectRoute, createGroup);
router.get("/", protectRoute, getUserGroups);
router.get("/messages/:groupId", protectRoute, getGroupMessages);
router.post("/send/:groupId", protectRoute, sendGroupMessage);
router.post("/add-members", addMembersToGroup);

export default router;