import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUsersForSidebar, getMessages, sendMessage } from "../controllers/message.controller.js";

const router = express.Router()

router.get("/user", protectRoute, getUsersForSidebar) //protect route to ensure that only authenticated users can access the list of users for the sidebar, and the getUsersForSidebar controller will handle the logic for retrieving the relevant user information to be displayed in the sidebar of the chat application.

router.get("/:id", protectRoute, getMessages)//protect route to ensure that only authenticated users can access the messages, and the getMessages controller will handle the logic for retrieving the messages between the authenticated user and the user identified by the id parameter in the URL.

router.post("/send/:id", protectRoute, sendMessage) //protect route to ensure that only authenticated users can send messages, and the sendMessage controller will handle the logic for sending a message to a specific user identified by the id parameter in the URL.

export default router; 