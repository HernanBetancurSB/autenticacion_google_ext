# ⚛️ Frontend - Corporate Pitch

Aplicación web construida con React, TypeScript y Vite para el aplicativo Corporate Pitch.

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/         # Componentes reutilizables (futuro)
│   ├── context/            # Context API
│   │   └── AuthContext.tsx # Contexto de autenticación
│   ├── hooks/              # Custom hooks
│   │   └── useAuth.ts      # Hook de autenticación
│   ├── pages/              # Páginas principales
│   │   ├── Home.tsx        # Landing page
│   │   ├── Login.tsx       # Página de login
│   │   └── Dashboard.tsx   # Dashboard principal
│   ├── App.tsx             # Componente raíz
│   ├── App.css             # Estilos globales
│   ├── main.tsx            # Entry point
│   └── index.css           # Estilos base
├── public/                 # Assets estáticos
├── index.html              # HTML base
├── package.json
├── tsconfig.json
└── vite.config.ts          # Configuración Vite
```

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Configurar .env
cp .env.example .env
# Edita VITE_API_URL si es necesario

# Iniciar servidor de desarrollo
npm run dev
```

## 🎨 Páginas

### Home (`/`)
- Landing page con información del producto
- Navbar con navegación
- Hero section
- Sección de características
- Call-to-action
- Footer

### Login (`/login`)
- Pantalla de inicio de sesión
- Botón de autenticación con Google
- Redirección automática si ya está autenticado

### Dashboard (`/dashboard`)
- **Protegida**: Requiere autenticación
- Sidebar con navegación
- Estadísticas de pitches
- Listado de presentaciones
- Modal para crear nuevos pitches
- Perfil de usuario

## 🔐 Autenticación

### Context API

El estado de autenticación se maneja globalmente con Context API:

```typescript
// Uso en cualquier componente
import { useAuth } from '../hooks/useAuth';

const MiComponente = () => {
  const { user, loading, logout, checkAuth } = useAuth();
  
  if (loading) return <div>Cargando...</div>;
  
  return <div>Hola, {user?.name}</div>;
};
```

### Rutas Protegidas

```typescript
// ProtectedRoute verifica autenticación antes de renderizar
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

### Flujo de Autenticación

1. Usuario hace clic en "Iniciar sesión con Google"
2. Redirige a: `${API_URL}/api/auth/google`
3. Backend maneja OAuth y redirige a `/dashboard`
4. Frontend verifica estado con `GET /api/auth/status`
5. Context actualiza con datos del usuario

## 🎨 Estilos

### CSS Variables

Definidas en `index.css`:

```css
:root {
  --primary-color: #4285f4;
  --primary-hover: #357ae8;
  --secondary-color: #34a853;
  --danger-color: #ea4335;
  --warning-color: #fbbc04;
  --bg-color: #ffffff;
  --text-color: #202124;
  --text-secondary: #5f6368;
  --border-color: #dadce0;
  --shadow: 0 1px 3px rgba(0,0,0,0.12);
}
```

### Clases Utilitarias

```css
.container       /* Max-width contenedor */
.card           /* Tarjeta con shadow */
.btn            /* Botón base */
.btn-primary    /* Botón primario */
.btn-secondary  /* Botón secundario */
.btn-outline    /* Botón outline */
```

## 🛠️ Tecnologías

- **React 18** - Librería UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **React Router 6** - Navegación
- **Axios** - Cliente HTTP
- **Lucide React** - Iconos modernos
- **CSS3** - Estilos (sin frameworks CSS)

## 📦 Scripts Disponibles

```bash
npm run dev      # Servidor desarrollo (puerto 5173)
npm run build    # Build de producción
npm run preview  # Preview del build
npm run lint     # ESLint
```

## 🔧 Configuración

### Variables de Entorno

Crea `.env` en la carpeta frontend:

```env
VITE_API_URL=http://localhost:3001
```

**Importante**: Variables deben empezar con `VITE_` para ser accesibles en el código.

### Uso en el código

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
```

### Configuración de Axios

En `AuthContext.tsx`:

```typescript
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
```

## 🚀 Producción

### Build

```bash
npm run build
# Genera archivos en dist/
```

### Despliegue

Los archivos en `dist/` son estáticos y pueden desplegarse en:

- **Vercel**: `vercel deploy`
- **Netlify**: `netlify deploy --prod`
- **AWS S3**: Subir carpeta `dist/`
- **Azure Static Web Apps**: Via GitHub Actions
- **GCP Cloud Storage**: `gsutil rsync -r dist/ gs://bucket-name`

### Variables de Entorno en Producción

Crea `.env.production`:

```env
VITE_API_URL=https://api.tudominio.com
```

## 📱 Responsive

Todas las páginas son responsive:

- **Desktop**: Grid de 3 columnas
- **Tablet** (≤968px): Grid de 2 columnas
- **Mobile** (≤640px): 1 columna, menú adaptativo

## 🎯 Componentes Principales

### AuthContext

Gestiona estado global de autenticación:

```typescript
interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}
```

### ProtectedRoute

HOC que protege rutas:

```typescript
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  return user ? children : <Navigate to="/login" />;
};
```

## 🎨 Diseño UI/UX

- **Color principal**: Azul Google (#4285f4)
- **Tipografía**: Inter (fallback: system fonts)
- **Espaciado**: Sistema de 8px
- **Sombras**: Material Design inspired
- **Animaciones**: Transiciones suaves (0.3s ease)
- **Iconos**: Lucide React (consistentes y modernos)

## 🐛 Debug

```bash
# Dev tools
# React DevTools (extensión navegador)
# Redux DevTools (si usas Redux)

# Console logs
console.log('Estado actual:', user);

# Axios interceptors
axios.interceptors.response.use(
  response => {
    console.log('Response:', response);
    return response;
  },
  error => {
    console.error('Error:', error);
    return Promise.reject(error);
  }
);
```

## 📚 Agregar Nuevas Páginas

1. Crea componente en `src/pages/`:

```typescript
// src/pages/NuevaPagina.tsx
import './NuevaPagina.css';

const NuevaPagina = () => {
  return <div>Nueva Página</div>;
};

export default NuevaPagina;
```

2. Agrega ruta en `App.tsx`:

```typescript
import NuevaPagina from './pages/NuevaPagina';

<Route path="/nueva" element={<NuevaPagina />} />
```

3. Agrega estilos en `src/pages/NuevaPagina.css`

## 🧪 Testing (Futuro)

```bash
# Instalar Vitest y React Testing Library
npm install -D vitest @testing-library/react

# Ejecutar tests
npm run test
```

## 🔒 Seguridad

- ✅ Cookies con `httpOnly` (backend)
- ✅ CORS configurado
- ✅ XSS prevención con React (escaping automático)
- ✅ Rutas protegidas con autenticación
- ✅ Variables sensibles en .env (no en código)
- ✅ HTTPS en producción

## 📄 Licencia

ISC

