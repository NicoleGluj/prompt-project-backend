import mongoose from "mongoose";

const connectDb = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("❌ Error: No se encontró MONGO_URI en las variables de entorno");
    process.exit(1);
  }

  try {
    console.log("🧩 Intentando conectar con MongoDB...");
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // 10 segundos
    });
    console.log("✅ Conectado a MongoDB Atlas correctamente");
  } catch (error) {
    console.error("❌ Error al conectarse a la base de datos:");
    console.error(error.message);
    process.exit(1);
  }
};

export default connectDb;
