# 🏗️ Arquitectura del Sistema - Corporate Pitch

Documentación técnica de la arquitectura del aplicativo Corporate Pitch.

## 📊 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                        │
│  ┌────────────┐  ┌────────────┐  ┌──────────────────────────┐ │
│  │   Home     │  │   Login    │  │   Dashboard (Protected)  │ │
│  │  Landing   │  │   OAuth    │  │   CRUD Pitches           │ │
│  └────────────┘  └────────────┘  └──────────────────────────┘ │
│         │              │                     │                  │
│         └──────────────┴─────────────────────┘                  │
│                        │                                        │
│                   AuthContext                                   │
│                   (State Management)                            │
└─────────────────────────┬───────────────────────────────────────┘
                          │ HTTP/HTTPS
                          │ (Axios with credentials)
┌─────────────────────────▼───────────────────────────────────────┐
│                    BACKEND API (Node.js)                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Express Server                         │  │
│  │  ┌────────────┐  ┌──────────────┐  ┌──────────────────┐ │  │
│  │  │   Routes   │  │  Middleware  │  │    Passport      │ │  │
│  │  │  /auth     │  │  - Auth      │  │  Google OAuth    │ │  │
│  │  │  /pitches  │  │  - Error     │  │                  │ │  │
│  │  │  /health   │  │  - CORS      │  │                  │ │  │
│  │  └────────────┘  └──────────────┘  └──────────────────┘ │  │
│  └──────────────────────────┬───────────────────────────────┘  │
│                             │                                   │
│                             │ pg (Node-Postgres)                │
└─────────────────────────────┼───────────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│                   PostgreSQL Database                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │  users   │  │ pitches  │  │  slides  │  │  resources   │   │
│  │          │  │          │  │          │  │              │   │
│  │ - id     │  │ - id     │  │ - id     │  │ - id         │   │
│  │ - email  │  │ - user_id│  │ - pitch_id│  │ - pitch_id   │   │
│  │ - name   │  │ - title  │  │ - content│  │ - url        │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Flujo de Autenticación OAuth 2.0

```
┌──────────┐                                          ┌──────────┐
│  User    │                                          │  Google  │
│ (Browser)│                                          │  OAuth   │
└────┬─────┘                                          └────┬─────┘
     │                                                      │
     │  1. Click "Login with Google"                       │
     │ ─────────────────────────────────────────►          │
     │                                    Frontend         │
     │                                                      │
     │  2. Redirect to /api/auth/google                    │
     │ ────────────────────────────────────────────►       │
     │                                    Backend          │
     │                                                      │
     │  3. Redirect to Google OAuth                        │
     │ ─────────────────────────────────────────────────►  │
     │                                                      │
     │  4. User authorizes                                 │
     │ ◄─────────────────────────────────────────────────  │
     │                                                      │
     │  5. Callback with auth code                         │
     │ ────────────────────────────────────────────►       │
     │                    /api/auth/google/callback        │
     │                                                      │
     │  6. Exchange code for tokens                        │
     │                                    Backend ──────────►
     │                                                      │
     │  7. Get user profile                                │
     │                                    Backend ◄─────────
     │                                                      │
     │  8. Create/Update user in DB                        │
     │                                    Backend          │
     │                                       ▼             │
     │                                   PostgreSQL        │
     │                                                      │
     │  9. Create session + cookie                         │
     │ ◄────────────────────────────────────────────       │
     │                                    Backend          │
     │                                                      │
     │  10. Redirect to /dashboard                         │
     │ ◄────────────────────────────────────────────       │
     │                                    Backend          │
     │                                                      │
     │  11. Render Dashboard                               │
     │      (session authenticated)                        │
     │                                                      │
```

## 🗂️ Estructura de Carpetas Completa

```
corporate-pitch-app/
│
├── backend/                          # Backend API
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts          # Pool PostgreSQL + test connection
│   │   │   └── passport.ts          # Passport Google Strategy
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts   # isAuthenticated, checkUserRole
│   │   │   └── error.middleware.ts  # errorHandler, notFound
│   │   ├── routes/
│   │   │   ├── auth.routes.ts       # OAuth endpoints
│   │   │   └── pitch.routes.ts      # CRUD pitches
│   │   ├── database/
│   │   │   └── migrations/
│   │   │       └── run-migrations.ts
│   │   └── server.ts                # Express app + startup
│   ├── database/
│   │   └── init.sql                 # Schema + triggers + indexes
│   ├── package.json
│   ├── tsconfig.json
│   ├── .eslintrc.json
│   └── README.md
│
├── frontend/                         # Frontend React
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.tsx      # Global auth state
│   │   ├── hooks/
│   │   │   └── useAuth.ts           # Custom hook para auth
│   │   ├── pages/
│   │   │   ├── Home.tsx             # Landing page
│   │   │   ├── Home.css
│   │   │   ├── Login.tsx            # Login con Google
│   │   │   ├── Login.css
│   │   │   ├── Dashboard.tsx        # Dashboard protegido
│   │   │   └── Dashboard.css
│   │   ├── App.tsx                  # Router + ProtectedRoute
│   │   ├── App.css
│   │   ├── main.tsx                 # Entry point
│   │   └── index.css                # Global styles + variables
│   ├── public/
│   │   └── vite.svg
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   ├── .eslintrc.cjs
│   └── README.md
│
├── docs/                             # Documentación de despliegue
│   ├── deploy-aws.md                # Guía AWS (EC2, RDS, S3, CloudFront)
│   ├── deploy-gcp.md                # Guía GCP (Compute Engine, Cloud SQL)
│   └── deploy-azure.md              # Guía Azure (App Service, Static Web Apps)
│
├── docker-compose.yml                # PostgreSQL containerizado
├── package.json                      # Root package (monorepo)
├── .gitignore
├── .gitattributes
├── .nvmrc                           # Node version
├── env.example                      # Template de variables de entorno
├── README.md                        # Documentación principal
├── QUICKSTART.md                    # Guía de inicio rápido
└── ARCHITECTURE.md                  # Este archivo
```

## 🔐 Stack de Seguridad

### Backend
- **Helmet**: Headers HTTP seguros
- **CORS**: Configurado para origen específico (frontend)
- **express-session**: Sesiones seguras con cookies httpOnly
- **Passport.js**: Autenticación robusta
- **PostgreSQL**: Queries parametrizadas (prevención SQL injection)
- **Environment Variables**: Secretos nunca en código

### Frontend
- **React**: XSS prevention automático (escaping)
- **HTTPS**: Obligatorio en producción
- **Protected Routes**: Verificación de autenticación
- **Axios withCredentials**: Manejo seguro de cookies

## 📡 Comunicación Backend-Frontend

### HTTP Client (Frontend)

```typescript
// Configuración de Axios
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:3001';

// Todas las peticiones incluyen cookies automáticamente
const response = await axios.get('/api/auth/status');
```

### CORS (Backend)

```typescript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

## 🗃️ Modelo de Datos

### Relaciones

```
users (1) ──────► (N) pitches
                     │
                     ├─► (N) slides
                     └─► (N) resources
```

### users
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    google_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    picture VARCHAR(500),
    provider VARCHAR(50) DEFAULT 'google',
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### pitches
```sql
CREATE TABLE pitches (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content JSONB,
    status VARCHAR(50) DEFAULT 'draft',
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🚀 Despliegue Cloud-Agnostic

### Opciones de Despliegue

| Componente | AWS | GCP | Azure |
|------------|-----|-----|-------|
| **Backend** | EC2 + Elastic Beanstalk | Compute Engine + App Engine | App Service |
| **Frontend** | S3 + CloudFront | Cloud Storage + Cloud CDN | Static Web Apps |
| **Database** | RDS PostgreSQL | Cloud SQL | Azure Database for PostgreSQL |
| **DNS** | Route 53 | Cloud DNS | Azure DNS |
| **SSL** | ACM | Cloud Load Balancing | App Service SSL |
| **CDN** | CloudFront | Cloud CDN | Azure CDN |

### Estrategia de Migración

1. **Abstracción de Base de Datos**: Pool de PostgreSQL estándar (pg)
2. **Variables de Entorno**: Configuración agnóstica
3. **Storage**: Abstracción para archivos (AWS S3 / GCP Cloud Storage / Azure Blob)
4. **Logging**: Winston/Morgan (compatible con CloudWatch, Stackdriver, Application Insights)

## 📊 Métricas y Monitoreo

### Health Checks

```typescript
// Backend: GET /health
{
  success: true,
  message: 'API funcionando correctamente',
  timestamp: '2024-01-15T10:30:00.000Z',
  environment: 'production'
}
```

### Monitoreo Recomendado

- **Backend**: PM2 monitoring, logs con Morgan
- **Database**: Conexiones activas, query performance
- **Frontend**: Error boundary, analytics
- **Infraestructura**: CPU, RAM, disk, network

## 🔄 CI/CD Pipeline

### GitHub Actions (Ejemplo)

```yaml
Deploy:
  1. Checkout code
  2. Install dependencies
  3. Run tests
  4. Build backend (TypeScript → JavaScript)
  5. Build frontend (React → Static files)
  6. Deploy backend (EC2/Compute/App Service)
  7. Deploy frontend (S3/Cloud Storage/Static Web Apps)
  8. Run migrations
  9. Invalidate CDN cache
```

## 🎯 Mejoras Futuras

### Backend
- [ ] Rate limiting con express-rate-limit
- [ ] Redis para sesiones (escalabilidad)
- [ ] WebSockets para colaboración en tiempo real
- [ ] GraphQL API
- [ ] Tests unitarios y de integración (Jest)
- [ ] Swagger/OpenAPI documentation
- [ ] Microservicios (separar autenticación, pitches)

### Frontend
- [ ] PWA (Progressive Web App)
- [ ] Offline support
- [ ] Tests (Vitest + React Testing Library)
- [ ] State management (Redux Toolkit / Zustand)
- [ ] Internacionalización (i18n)
- [ ] Temas (dark mode)
- [ ] Accessibility (WCAG AA)

### Infraestructura
- [ ] Kubernetes para orquestación
- [ ] Terraform para IaC
- [ ] Prometheus + Grafana para métricas
- [ ] ELK Stack para logs centralizados
- [ ] Auto-scaling
- [ ] Multi-region deployment

## 📚 Referencias

- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [React Documentation](https://react.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Arquitectura diseñada para escalabilidad, seguridad y portabilidad cloud** ☁️

