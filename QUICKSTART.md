# ⚡ Guía de Inicio Rápido - Corporate Pitch

Configuración rápida en **5 minutos** para desarrollo local.

## 📋 Prerequisitos

- Node.js 18+
- Docker Desktop
- Cuenta Google Cloud (para OAuth)

## 🚀 Pasos de Instalación

### 1. Configurar Google OAuth

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto nuevo
3. Habilita **Google+ API**
4. **Credenciales** → **Crear credenciales** → **ID de cliente de OAuth 2.0**
5. Configura:
   - Tipo: Aplicación web
   - URI autorizado: `http://localhost:5173`
   - URI de redireccionamiento: `http://localhost:3001/api/auth/google/callback`
6. Guarda el **Client ID** y **Client Secret**

### 2. Instalar Dependencias

```bash
# Instalar todas las dependencias
npm run install:all
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Backend
NODE_ENV=development
PORT=3001

# Database (usa estos valores por defecto)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=corporate_pitch
DB_USER=pitchapp
DB_PASSWORD=pitchapp2024

# JWT (genera uno seguro para producción)
JWT_SECRET=mi_clave_super_secreta_local_dev
JWT_EXPIRES_IN=7d

# Google OAuth (REEMPLAZAR con tus credenciales)
GOOGLE_CLIENT_ID=TU_GOOGLE_CLIENT_ID_AQUI
GOOGLE_CLIENT_SECRET=TU_GOOGLE_CLIENT_SECRET_AQUI
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback

# Frontend
FRONTEND_URL=http://localhost:5173

# Session
SESSION_SECRET=mi_session_secret_local
```

Crea `frontend/.env`:

```env
VITE_API_URL=http://localhost:3001
```

### 4. Iniciar PostgreSQL

```bash
# Iniciar Docker con PostgreSQL
npm run docker:up

# Espera 10 segundos para que PostgreSQL inicie completamente
```

### 5. Ejecutar Migraciones

```bash
# Crear tablas en la base de datos
npm run db:migrate
```

### 6. Iniciar Aplicación

```bash
# Iniciar backend y frontend simultáneamente
npm run dev
```

## ✅ Verificar Instalación

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

Deberías ver:
- ✅ Página de inicio del aplicativo
- ✅ Botón "Iniciar Sesión con Google"
- ✅ Backend logs mostrando conexión exitosa

## 🎯 Primer Uso

1. Abre http://localhost:5173
2. Haz clic en "Iniciar Sesión con Google"
3. Autoriza con tu cuenta Google
4. Serás redirigido al Dashboard
5. Crea tu primera presentación de pitch

## 🐛 Solución de Problemas

### Error: "Cannot connect to database"

```bash
# Verificar que Docker esté corriendo
docker ps

# Si no hay contenedor, reinicia:
npm run docker:down
npm run docker:up
```

### Error: "GOOGLE_CLIENT_ID not configured"

Verifica que hayas:
1. Copiado correctamente las credenciales de Google Cloud Console
2. Guardado el archivo `.env` en la raíz del proyecto
3. Reiniciado el servidor backend

### Error: "Port 3001 already in use"

```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID [PID_NUMBER] /F

# Linux/Mac
lsof -ti:3001 | xargs kill -9
```

### Error: "Module not found"

```bash
# Reinstalar todas las dependencias
npm run install:all
```

## 📦 Comandos Útiles

```bash
# Ver logs del backend
cd backend && npm run dev

# Ver logs del frontend
cd frontend && npm run dev

# Ver logs de PostgreSQL
docker logs corporate-pitch-db

# Acceder a PostgreSQL directamente
docker exec -it corporate-pitch-db psql -U pitchapp -d corporate_pitch

# Detener base de datos
npm run docker:down

# Build de producción
npm run build
```

## 🎨 Próximos Pasos

Después de configurar el entorno local:

1. **Explora la UI**: Navega por las páginas Home, Login y Dashboard
2. **Crea tu primer pitch**: Usa el botón "Nueva Presentación"
3. **Revisa el código**:
   - Backend: `backend/src/`
   - Frontend: `frontend/src/`
4. **Personaliza**: Modifica estilos, agrega funcionalidades
5. **Despliega**: Sigue las guías en `docs/` para AWS, GCP o Azure

## 📚 Documentación Adicional

- [README.md](README.md) - Documentación completa
- [docs/deploy-aws.md](docs/deploy-aws.md) - Desplegar en AWS
- [docs/deploy-gcp.md](docs/deploy-gcp.md) - Desplegar en GCP
- [docs/deploy-azure.md](docs/deploy-azure.md) - Desplegar en Azure

## 💡 Tips

- Usa **Thunder Client** o **Postman** para probar la API directamente
- Revisa los logs con `pm2 logs` en producción
- Activa Hot Reload en desarrollo (ya configurado)
- Usa **React DevTools** para debuggear el frontend

---

**¿Listo para crear presentaciones increíbles? ¡Comienza ahora! 🚀**

