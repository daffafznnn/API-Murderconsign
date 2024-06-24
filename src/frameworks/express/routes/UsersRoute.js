import express from "express";
import UsersController from "../controllers/UsersController.js";
import { adminOnly, verifyUser } from "../middlewares/AuthUser.js";

const router = express.Router();

router.get("/", UsersController.getAllUser);
router.get("/:userId", UsersController.getUserById);
router.post("/create", UsersController.createUser);
router.put("/update", UsersController.updateUser);
router.delete("/delete", UsersController.deleteUser);
router.put("/change-status", UsersController.changeStatus);

export default router;
