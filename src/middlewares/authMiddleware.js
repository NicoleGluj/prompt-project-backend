import jwt from "jsonwebtoken"
import { config } from "dotenv"
config()

const JWT_SECRET = process.env.JWT_SECRET

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const token = authHeader?.replace("Bearer ", "").trim();

    if (!token || token === "undefined") {
      return res.status(401).json({ message: "Acceso denegado. No se proporcionó token." });
    }

    const decode = jwt.verify(token, JWT_SECRET)
    req.user = decode;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expirado. Iniciá sesión nuevamente." });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Token inválido." });
    }

    console.error(`[AuthMiddleware] Error: ${error.message}`);
    res.status(500).json({ message: "Error interno al verificar token." });
  }
};

export default authMiddleware