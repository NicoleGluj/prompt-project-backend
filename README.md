# 🧠 Backend - VoiceTasks

Este repositorio contiene el código del **backend de VoiceTasks**, una aplicación web que permite registrar y gestionar tareas mediante texto o reconocimiento de voz.  
El backend está desarrollado con **Node.js**, **Express**, y **MongoDB Atlas**, y expone una API REST segura con autenticación JWT.

---

## 🚀 Tecnologías utilizadas

- **Node.js** – entorno de ejecución.
- **Express** – framework para la creación de la API.
- **MongoDB Atlas** – base de datos NoSQL alojada en la nube.
- **Mongoose** – modelado de datos para MongoDB.
- **jsonwebtoken (JWT)** – autenticación basada en tokens.
- **bcryptjs** – encriptación de contraseñas.
- **morgan** – logger de peticiones HTTP.
- **cors** – middleware para habilitar solicitudes entre dominios.
- **dotenv** – manejo de variables de entorno.

---

## 📂 Estructura del proyecto

```
backend/
│
├── src/
│   ├── config/
│   │   └── mongodb.js          # Configuración y conexión con MongoDB Atlas
│   ├── controllers/
│   │   ├── authControllers.js  # Registro y login de usuarios
│   │   └── tasksControllers.js # CRUD de tareas del usuario
│   ├── middlewares/
│   │   └── authMiddleware.js   # Verificación de token JWT
│   ├── models/
│   │   ├── UsersModel.js       # Esquema de usuario
│   │   └── TasksModel.js       # Esquema de tarea
│   └── routes/
│       ├── authRoutes.js       # Rutas de autenticación
│       └── tasksRoutes.js      # Rutas protegidas de tareas
│
├── index.js                    # Punto de entrada principal
├── .env                        # Variables de entorno (no versionadas)
└── package.json
```
---

## 🔐 Autenticación

La API usa **JWT (JSON Web Token)**.  
El flujo de autenticación es el siguiente:

1. El usuario se registra o inicia sesión.  
2. El backend genera un token JWT firmado con `JWT_SECRET`.  
3. El frontend almacena el token en `localStorage`.  
4. Para acceder a rutas protegidas, el token debe enviarse en el header:

```
Authorization: Bearer <token>
```

---

## 🧱 Endpoints principales

### 🔑 Autenticación (`/auth`)

| Método | Ruta | Descripción |
|--------|------|--------------|
| `POST` | `/auth/register` | Registra un nuevo usuario |
| `POST` | `/auth/login` | Inicia sesión y devuelve token JWT |

**Ejemplo de respuesta (login exitoso):**
```json
{
  "message": "Login exitoso",
  "token": "<JWT_TOKEN>",
  "name": "Niki",
  "email": "niki@gmail.com"
}
```

---

### 📝 Tareas (`/tasks`)

> Todas las rutas de `/tasks` están protegidas por el middleware `authMiddleware`.

| Método | Ruta | Descripción |
|--------|------|--------------|
| `GET` | `/tasks` | Obtiene todas las tareas del usuario autenticado |
| `POST` | `/tasks` | Crea una nueva tarea |
| `PUT` | `/tasks/:id` | Alterna el estado de completado de una tarea |
| `DELETE` | `/tasks/:id` | Elimina una tarea específica |

**Ejemplo de creación de tarea:**
```json
{
  "text": "Comprar comida para el gato"
}
```

**Respuesta:**
```json
{
  "_id": "675d9c9f89b2301b8f123456",
  "text": "Comprar comida para el gato",
  "completed": false,
  "userId": "671b9b42f991ce10b2f8e123",
  "createdAt": "2025-11-06T21:00:00.000Z"
}
```

---

## 🧩 Middlewares

### 🔒 `authMiddleware.js`
Verifica el token JWT en el header y, si es válido, agrega `req.user` con la información del usuario autenticado.  
En caso contrario, devuelve `401 Unauthorized` o `403 Forbidden`.

---

## 🧠 Seguridad y buenas prácticas

- Las contraseñas se encriptan con **bcryptjs** antes de guardarse.  
- Los tokens JWT expiran automáticamente (configurable en `.env`).  
- Las rutas de `/tasks` requieren autenticación obligatoria.  
- Se evita revelar información específica en errores de login (por seguridad).  
- Los IDs se validan para evitar ataques por inyección o errores de formato.  

---

## 🧰 Logs

El servidor usa **morgan** para registrar peticiones HTTP en archivos dentro de la carpeta `/logs`.  
Cada día se genera un archivo distinto con formato:

```
logs/access-YYYY-MM-DD.log
```

---

## 🧪 Pruebas de salud del servidor

El backend incluye una ruta `/status` para verificar el estado del servidor y la conexión con la base de datos:

**GET /status**
```json
{
  "status": "OK",
  "message": "Sistema operativo y base de datos funcionando correctamente",
  "dbStatus": 1,
  "uptime": 215.3,
  "timestamp": "2025-11-06T21:15:00.000Z"
}
```
---

## 🚀 Cómo ejecutar este proyecto desde GitHub

Sigue estos pasos para clonar y ejecutar el backend de **VoiceTasks** en tu entorno local:

### 1️⃣ Clonar el repositorio
Primero, cloná el proyecto desde GitHub y accedé al directorio:

```bash
git clone https://github.com/tuusuario/prompt-project.git
cd prompt-project/backend
```

> 🔁 Si ya clonaste todo el proyecto, simplemente ubicáte dentro de la carpeta `backend`.

---

### 2️⃣ Instalar dependencias
Instalá las dependencias necesarias ejecutando:

```bash
npm install
```

---

### 3️⃣ Configurar las variables de entorno
Crea un archivo llamado `.env` en la raíz del backend con el siguiente contenido:

```env
PORT=3000
MONGO_URI=mongodb+srv://<usuario>:<contraseña>@cluster.mongodb.net/tareasdb
JWT_SECRET=supersecreto
NODE_ENV=development
```

> ⚙️ Si tu base de datos está en **MongoDB Atlas**, asegurate de usar la cadena de conexión correcta.

---

### 4️⃣ Iniciar el servidor
Ejecutá el siguiente comando para iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

O en producción:

```bash
npm start
```

El servidor se iniciará por defecto en:

```
http://localhost:3000
```

---

### 5️⃣ Verificar que funcione
Probá que la API esté corriendo correctamente accediendo a la ruta:

```
GET http://localhost:3000/status
```

Deberías recibir una respuesta como esta:

```json
{
  "status": "OK",
  "message": "Sistema operativo y base de datos funcionando correctamente",
  "dbStatus": 1,
  "uptime": 215.3,
  "timestamp": "2025-11-06T21:15:00.000Z"
}
```

---

### 6️⃣ Conectar con el frontend
Si también estás ejecutando el **frontend**, asegurate de configurar su archivo `.env` para que apunte al backend (local o desplegado):

```env
VITE_API_AUTH=http://localhost:3000/auth
VITE_API_TASKS=http://localhost:3000/tasks
```

Luego, desde la carpeta `frontend`, ejecutá:

```bash
npm run dev
```

y abrí la app en tu navegador:

```
http://localhost:5173
```

---

✅ ¡Listo!  
Tu aplicación completa (frontend + backend) estará corriendo localmente y lista para usarse o desarrollar nuevas funciones.

---

