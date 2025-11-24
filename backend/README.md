# 🔧 Backend - Corporate Pitch API

API REST construida con Node.js, Express y TypeScript para el aplicativo Corporate Pitch.

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── config/              # Configuración
│   │   ├── database.ts      # Pool de PostgreSQL
│   │   └── passport.ts      # Estrategia OAuth Google
│   ├── middleware/          # Middlewares
│   │   ├── auth.middleware.ts      # Autenticación
│   │   └── error.middleware.ts     # Manejo de errores
│   ├── routes/              # Rutas de la API
│   │   ├── auth.routes.ts   # Autenticación Google OAuth
│   │   └── pitch.routes.ts  # CRUD de pitches
│   ├── database/            # Migraciones
│   │   └── migrations/
│   └── server.ts            # Servidor Express
├── database/
│   └── init.sql             # Schema PostgreSQL
├── package.json
└── tsconfig.json
```

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Configurar .env
cp ../.env.example ../.env
# Edita las variables necesarias

# Iniciar base de datos
cd .. && npm run docker:up

# Ejecutar migraciones
npm run migrate

# Iniciar servidor desarrollo
npm run dev
```

## 📡 Endpoints de la API

### Autenticación

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `GET` | `/api/auth/google` | Iniciar OAuth con Google | No |
| `GET` | `/api/auth/google/callback` | Callback de Google | No |
| `GET` | `/api/auth/me` | Obtener usuario actual | Sí |
| `POST` | `/api/auth/logout` | Cerrar sesión | Sí |
| `GET` | `/api/auth/status` | Verificar estado de auth | No |

### Pitches

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `GET` | `/api/pitches` | Listar pitches del usuario | Sí |
| `POST` | `/api/pitches` | Crear nuevo pitch | Sí |
| `GET` | `/api/pitches/:id` | Obtener pitch por ID | Sí |
| `PUT` | `/api/pitches/:id` | Actualizar pitch | Sí |
| `DELETE` | `/api/pitches/:id` | Eliminar pitch | Sí |

### Health Check

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `GET` | `/health` | Estado del servidor | No |

## 🔐 Autenticación

La API usa **Google OAuth 2.0** con Passport.js:

1. Usuario inicia OAuth: `GET /api/auth/google`
2. Google redirige a: `GET /api/auth/google/callback`
3. Backend crea sesión con cookies
4. Frontend verifica con: `GET /api/auth/status`

### Proteger Rutas

```typescript
import { isAuthenticated } from '../middleware/auth.middleware';

router.get('/protected', isAuthenticated, (req, res) => {
  res.json({ user: req.user });
});
```

## 🗄️ Base de Datos

### Schema Principal

**users**
- `id` - Serial Primary Key
- `google_id` - VARCHAR(255) Unique
- `email` - VARCHAR(255) Unique
- `name` - VARCHAR(255)
- `picture` - VARCHAR(500)
- `provider` - VARCHAR(50)
- `role` - VARCHAR(50)
- `created_at` - Timestamp
- `last_login` - Timestamp

**pitches**
- `id` - Serial Primary Key
- `user_id` - Integer (FK → users)
- `title` - VARCHAR(255)
- `description` - Text
- `content` - JSONB
- `status` - VARCHAR(50)
- `views` - Integer
- `created_at` - Timestamp
- `updated_at` - Timestamp

**slides**
- `id` - Serial Primary Key
- `pitch_id` - Integer (FK → pitches)
- `order_index` - Integer
- `title` - VARCHAR(255)
- `content` - JSONB
- `layout` - VARCHAR(50)
- `created_at` - Timestamp
- `updated_at` - Timestamp

**resources**
- `id` - Serial Primary Key
- `pitch_id` - Integer (FK → pitches)
- `name` - VARCHAR(255)
- `type` - VARCHAR(100)
- `url` - VARCHAR(500)
- `size` - BIGINT
- `cloud_provider` - VARCHAR(50)
- `cloud_key` - VARCHAR(500)
- `created_at` - Timestamp

### Conectar a PostgreSQL

```bash
# Via Docker
docker exec -it corporate-pitch-db psql -U pitchapp -d corporate_pitch

# Comandos útiles
\dt                    # Listar tablas
\d users              # Ver estructura de tabla
SELECT * FROM users;  # Query de ejemplo
```

## 🧪 Testing

```bash
# Ejecutar tests (cuando estén configurados)
npm test

# Test de endpoints con curl
curl http://localhost:3001/health
curl http://localhost:3001/api/auth/status
```

## 📦 Scripts Disponibles

```bash
npm run dev        # Desarrollo con hot-reload
npm run build      # Compilar TypeScript
npm run start      # Producción (requiere build)
npm run migrate    # Ejecutar migraciones
npm run lint       # Ejecutar ESLint
```

## 🔧 Configuración

### Variables de Entorno

Crea `.env` en la raíz del proyecto:

```env
NODE_ENV=development
PORT=3001

DB_HOST=localhost
DB_PORT=5432
DB_NAME=corporate_pitch
DB_USER=pitchapp
DB_PASSWORD=pitchapp2024

JWT_SECRET=tu_clave_secreta
JWT_EXPIRES_IN=7d

GOOGLE_CLIENT_ID=tu_client_id
GOOGLE_CLIENT_SECRET=tu_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback

FRONTEND_URL=http://localhost:5173
SESSION_SECRET=tu_session_secret
```

## 🚀 Producción

### Build

```bash
npm run build
# Genera archivos en dist/
```

### Iniciar con PM2

```bash
pm2 start dist/server.js --name corporate-pitch-api
pm2 startup
pm2 save
```

### Variables de Entorno de Producción

- `NODE_ENV=production`
- `DB_HOST` → URL de tu base de datos cloud
- `GOOGLE_CALLBACK_URL` → URL de producción
- `FRONTEND_URL` → URL de frontend en producción
- `JWT_SECRET` → Clave segura generada
- `SESSION_SECRET` → Clave segura generada

## 📚 Dependencias Principales

- **express** - Framework web
- **typescript** - Tipado estático
- **pg** - Cliente PostgreSQL
- **passport** - Autenticación
- **passport-google-oauth20** - Estrategia Google
- **express-session** - Gestión de sesiones
- **jsonwebtoken** - JWT para tokens
- **helmet** - Seguridad HTTP
- **cors** - Cross-Origin Resource Sharing
- **morgan** - HTTP logger

## 🐛 Debug

```bash
# Ver logs en desarrollo
npm run dev

# Ver logs con PM2
pm2 logs corporate-pitch-api

# Activar debug mode
DEBUG=express:* npm run dev
```

## 🔒 Seguridad

- ✅ Helmet para headers HTTP seguros
- ✅ CORS configurado para frontend específico
- ✅ Sesiones con cookies httpOnly
- ✅ SQL injection prevención con queries parametrizadas
- ✅ Rate limiting (recomendado para producción)
- ✅ Variables sensibles en .env (nunca en código)

## 📄 Licencia

ISC

