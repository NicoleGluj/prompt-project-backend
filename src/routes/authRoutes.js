import { Router } from "express"
import { UserLogin, UserRegister } from "../controllers/authControllers.js";

const authRouter = Router()

authRouter.post("/register", UserRegister);
authRouter.post("/login", UserLogin);

export default authRouter