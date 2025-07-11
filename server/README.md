# Serenella Coaching - Backend API

Backend desarrollado en Node.js y Express para el sitio web de Serenella Coaching.

## 🚀 Características

- **Autenticación JWT** - Sistema de login y registro
- **Base de datos MongoDB** - Almacenamiento de datos con Mongoose
- **Gestión de citas** - CRUD completo para reservas
- **Sistema de contacto** - Manejo de mensajes del formulario de contacto
- **API de cursos** - Información de cursos disponibles
- **API de testimonios** - Gestión de testimonios de clientes
- **Middleware de seguridad** - Helmet, CORS, Rate limiting
- **Validación de datos** - Express Validator

## 📋 Requisitos previos

- Node.js (v14 o superior)
- MongoDB (local o MongoDB Atlas)
- npm o yarn

## 🛠 Instalación

1. **Navegar al directorio del servidor:**
   ```bash
   cd server
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   - Renombrar `.env.example` a `.env`
   - Configurar las variables necesarias:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/serenella-coaching
   JWT_SECRET=tu_jwt_secret_muy_seguro_aqui
   ```

4. **Iniciar el servidor:**
   ```bash
   # Desarrollo (con nodemon)
   npm run dev
   
   # Producción
   npm start
   ```

## 📚 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual

### Citas
- `POST /api/appointments` - Crear nueva cita
- `GET /api/appointments` - Obtener todas las citas (admin)
- `GET /api/appointments/:id` - Obtener cita específica (admin)
- `PUT /api/appointments/:id` - Actualizar cita (admin)
- `DELETE /api/appointments/:id` - Eliminar cita (admin)

### Contacto
- `POST /api/contact` - Enviar mensaje de contacto
- `GET /api/contact` - Obtener mensajes (admin)
- `GET /api/contact/:id` - Obtener mensaje específico (admin)
- `PUT /api/contact/:id` - Actualizar estado del mensaje (admin)
- `DELETE /api/contact/:id` - Eliminar mensaje (admin)

### Cursos
- `GET /api/courses` - Obtener todos los cursos
- `GET /api/courses/:id` - Obtener curso específico

### Testimonios
- `GET /api/testimonials` - Obtener todos los testimonios
- `GET /api/testimonials/:id` - Obtener testimonio específico
- `GET /api/testimonials/service/:service` - Obtener testimonios por servicio

### Salud del servidor
- `GET /api/health` - Verificar estado del servidor

## 🔒 Autenticación

La API utiliza JWT (JSON Web Tokens) para autenticación. Para acceder a rutas protegidas, incluir el token en el header:

```javascript
headers: {
  'Authorization': 'Bearer tu_jwt_token'
  // o
  'x-auth-token': 'tu_jwt_token'
}
```

## 📊 Modelos de datos

### Usuario
```javascript
{
  name: String,
  email: String,
  password: String,
  role: String, // 'client' | 'admin'
  phone: String,
  isActive: Boolean
}
```

### Cita
```javascript
{
  clientName: String,
  clientEmail: String,
  clientPhone: String,
  serviceType: String,
  preferredDate: Date,
  preferredTime: String,
  message: String,
  status: String, // 'pending' | 'confirmed' | 'cancelled' | 'completed'
  confirmedDate: Date,
  confirmedTime: String,
  notes: String
}
```

### Contacto
```javascript
{
  name: String,
  email: String,
  phone: String,
  subject: String,
  message: String,
  status: String, // 'new' | 'read' | 'replied' | 'archived'
  source: String
}
```

## 🚀 Despliegue

### Variables de entorno para producción:
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/serenella-coaching
JWT_SECRET=jwt_secret_super_seguro_para_produccion
```

### Comandos útiles:
```bash
# Instalar dependencias de producción únicamente
npm ci --production

# Verificar salud del servidor
curl http://localhost:5000/api/health
```

## 🔧 Desarrollo

### Estructura del proyecto:
```
server/
├── models/          # Modelos de Mongoose
├── routes/          # Rutas de la API
├── middleware/      # Middleware personalizado
├── .env            # Variables de entorno
├── server.js       # Archivo principal del servidor
└── package.json    # Dependencias y scripts
```

### Scripts disponibles:
- `npm start` - Iniciar servidor en producción
- `npm run dev` - Iniciar servidor en desarrollo con nodemon

## 📝 Notas

- Todos los endpoints están protegidos con validación de datos
- Las rutas administrativas requieren autenticación y rol de admin
- Los passwords se encriptan con bcryptjs
- La API incluye rate limiting para prevenir abuso
- CORS configurado para desarrollo y producción
