import jwt from "jsonwebtoken"
import User from "../models/UsersModel.js";
import bcrypt from "bcryptjs"
import dotenv from "dotenv";

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET

export const UserRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      return res.status(400).json({ message: "El email no es válido" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({ message: "Este correo ya está registrado. Iniciá sesión para continuar." });
    }

    const hash = await bcrypt.hash(password, 10);
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hash,
    });

    await newUser.save();

    res.status(201).json({ message: "¡Tu cuenta fue creada con éxito! Ya podés iniciar sesión." });
  } catch (error) {
    console.error(`[AuthError - register] ${error.message}`);

    if (error.code === 11000) {
      return res.status(400).json({ message: "Este email ya está registrado. Iniciá sesión para continuar." });
    }

    res.status(500).json({ message: "Ocurrió un error inesperado. Por favor, intentá nuevamente más tarde." });
  }
};


export const UserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      return res.status(400).json({ message: "El email no es válido" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) return res.status(401).json({ message: "Credenciales inválidas" });

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) return res.status(401).json({ message: "Credenciales inválidas" })

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h", issuer: "voicetasks-api" }
    );
    res.status(200).json({
      message: "Login exitoso",
      token,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error(`[AuthError - login] ${error.message}`);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
}

