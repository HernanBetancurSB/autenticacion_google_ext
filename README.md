# 🚀 Corporate Pitch - Plataforma de Presentaciones Corporativas

Aplicativo profesional full-stack para crear, gestionar y presentar pitches corporativos de alto impacto. Construido con React, Node.js, PostgreSQL y autenticación OAuth 2.0 de Google.

## 📋 Características Principales

- ✅ **Autenticación Segura**: OAuth 2.0 con Google
- ✅ **Frontend Moderno**: React 18 + TypeScript + Vite
- ✅ **Backend Robusto**: Node.js + Express + TypeScript
- ✅ **Base de Datos**: PostgreSQL con migraciones automatizadas
- ✅ **Cloud Agnostic**: Desplegable en AWS, GCP o Azure
- ✅ **Docker Ready**: Contenedorización completa
- ✅ **TypeScript**: Tipado fuerte en frontend y backend
- ✅ **Arquitectura Escalable**: Monorepo con workspaces

## 🏗️ Estructura del Proyecto

```
corporate-pitch-app/
├── backend/                 # API Node.js + Express
│   ├── src/
│   │   ├── config/         # Configuración (DB, Passport)
│   │   ├── middleware/     # Middlewares (auth, error)
│   │   ├── routes/         # Rutas de la API
│   │   ├── database/       # Migraciones y scripts
│   │   └── server.ts       # Punto de entrada
│   ├── database/
│   │   └── init.sql        # Schema inicial de PostgreSQL
│   └── package.json
│
├── frontend/               # App React + TypeScript
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── context/        # Context API (Auth)
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Páginas principales
│   │   ├── App.tsx         # Componente principal
│   │   └── main.tsx        # Punto de entrada
│   ├── public/
│   └── package.json
│
├── docker-compose.yml      # PostgreSQL containerizado
├── package.json            # Root package (monorepo)
└── README.md
```

## 🚀 Inicio Rápido

### Prerrequisitos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Docker** y **Docker Compose**
- Cuenta de **Google Cloud** (para OAuth credentials)

### 1️⃣ Clonar y Configurar

```bash
# Clonar el repositorio
cd corporate-pitch-app

# Instalar todas las dependencias
npm run install:all
```

### 2️⃣ Configurar Variables de Entorno

#### Backend (.env en raíz)

Copia `env.example` y renómbralo a `.env`, luego configura:

```env
# Backend
NODE_ENV=development
PORT=3001

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=corporate_pitch
DB_USER=pitchapp
DB_PASSWORD=pitchapp2024

# JWT
JWT_SECRET=tu_clave_secreta_muy_segura
JWT_EXPIRES_IN=7d

# Google OAuth 2.0 (configurar en Google Cloud Console)
GOOGLE_CLIENT_ID=tu_google_client_id_aqui
GOOGLE_CLIENT_SECRET=tu_google_client_secret_aqui
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Session
SESSION_SECRET=tu_session_secret_muy_seguro
```

#### Frontend (frontend/env.example → frontend/.env)

```env
VITE_API_URL=http://localhost:3001
```

### 3️⃣ Configurar Google OAuth 2.0

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita **Google+ API**
4. Ve a **Credenciales** → **Crear credenciales** → **ID de cliente de OAuth 2.0**
5. Configura:
   - **Tipo de aplicación**: Aplicación web
   - **Orígenes autorizados**: `http://localhost:5173`
   - **URI de redireccionamiento**: `http://localhost:3001/api/auth/google/callback`
6. Copia el **Client ID** y **Client Secret** a tu archivo `.env`

### 4️⃣ Iniciar Base de Datos

```bash
# Iniciar PostgreSQL con Docker
npm run docker:up

# Verificar que está corriendo
docker ps
```

### 5️⃣ Ejecutar Migraciones

```bash
# Ejecutar migraciones de base de datos
npm run db:migrate
```

### 6️⃣ Iniciar Aplicación

```bash
# Desarrollo (backend + frontend simultáneamente)
npm run dev

# O iniciar individualmente:
npm run dev:backend   # Backend en http://localhost:3001
npm run dev:frontend  # Frontend en http://localhost:5173
```

### 7️⃣ Acceder a la Aplicación

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 📦 Scripts Disponibles

### Root (Monorepo)

```bash
npm run install:all    # Instalar todas las dependencias
npm run dev            # Desarrollo (backend + frontend)
npm run build          # Build de producción
npm run docker:up      # Iniciar PostgreSQL
npm run docker:down    # Detener PostgreSQL
npm run db:migrate     # Ejecutar migraciones
```

### Backend

```bash
cd backend
npm run dev            # Servidor desarrollo con hot-reload
npm run build          # Compilar TypeScript
npm run start          # Iniciar servidor producción
npm run migrate        # Ejecutar migraciones
npm run lint           # Ejecutar ESLint
```

### Frontend

```bash
cd frontend
npm run dev            # Servidor desarrollo
npm run build          # Build de producción
npm run preview        # Preview del build
npm run lint           # Ejecutar ESLint
```

## 🗄️ Base de Datos

### Schema Principal

- **users**: Usuarios autenticados con Google
- **pitches**: Presentaciones creadas por usuarios
- **slides**: Diapositivas individuales de cada pitch
- **resources**: Archivos y recursos asociados

### Conexión Local

```bash
# Conectar a PostgreSQL
docker exec -it corporate-pitch-db psql -U pitchapp -d corporate_pitch
```

## 🔐 Autenticación

La aplicación utiliza **Google OAuth 2.0** con Passport.js:

1. Usuario hace clic en "Iniciar sesión con Google"
2. Redirección a Google para autenticación
3. Google valida y retorna al callback
4. Backend crea/actualiza usuario en DB
5. Sesión iniciada con cookies seguras
6. Frontend accede a datos de usuario

### Flujo de Autenticación

```
Frontend → /api/auth/google → Google OAuth → Callback → Session → Dashboard
```

## ☁️ Despliegue Cloud-Agnostic

### AWS

```bash
# Deploy a AWS (EC2 + RDS PostgreSQL)
# Ver: docs/deploy-aws.md
```

### GCP

```bash
# Deploy a GCP (Compute Engine + Cloud SQL)
# Ver: docs/deploy-gcp.md
```

### Azure

```bash
# Deploy a Azure (App Service + Azure Database)
# Ver: docs/deploy-azure.md
```

## 🏗️ Arquitectura

### Backend (Node.js + Express)

- **Configuración**: Database pool, Passport OAuth
- **Middlewares**: Autenticación, manejo de errores
- **Rutas**: Auth, Pitches, Users
- **Base de datos**: PostgreSQL con pg

### Frontend (React + TypeScript)

- **Context API**: Gestión de autenticación global
- **React Router**: Navegación y rutas protegidas
- **Axios**: Cliente HTTP con interceptors
- **CSS Modules**: Estilos componentizados

## 🔧 Tecnologías Utilizadas

### Backend
- Node.js 18+
- Express 4.18
- TypeScript 5.3
- PostgreSQL 15
- Passport.js (Google OAuth)
- JWT para tokens
- Docker

### Frontend
- React 18
- TypeScript 5.2
- Vite 5.0
- React Router 6
- Axios
- Lucide Icons
- CSS3

## 📝 API Endpoints

### Autenticación

```
GET  /api/auth/google          # Iniciar OAuth con Google
GET  /api/auth/google/callback # Callback de Google
GET  /api/auth/me              # Obtener usuario actual
POST /api/auth/logout          # Cerrar sesión
GET  /api/auth/status          # Verificar estado de auth
```

### Pitches

```
GET    /api/pitches            # Listar todos los pitches del usuario
POST   /api/pitches            # Crear nuevo pitch
GET    /api/pitches/:id        # Obtener pitch específico
PUT    /api/pitches/:id        # Actualizar pitch
DELETE /api/pitches/:id        # Eliminar pitch
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

## 👤 Autor

Desarrollado como solución empresarial para presentaciones corporativas profesionales.

## 📞 Soporte

Para soporte y consultas:
- 📧 Email: support@corporatepitch.com
- 🌐 Web: https://corporatepitch.com
- 📖 Docs: https://docs.corporatepitch.com

---

**¡Construido con ❤️ para empresas que quieren impactar!**

