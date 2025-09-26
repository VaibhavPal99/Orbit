import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT.js";
import { getConversations, getMessages } from "../controller/message.controller.js";

const router = Router();


router.get("/conversations", verifyJWT, getConversations);
router.get("/:secondId", verifyJWT, getMessages);


export default router;