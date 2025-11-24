import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import passport from './config/passport';
import { testConnection } from './config/database';
import { errorHandler, notFound } from './middleware/error.middleware';

// Importar rutas
import authRoutes from './routes/auth.routes';
import pitchRoutes from './routes/pitch.routes';

// Cargar variables de entorno desde la raíz del proyecto
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middlewares de seguridad y logging
app.use(helmet());
app.use(morgan('dev'));

// CORS configurado para permitir credenciales
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Parseo de body y cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Configuración de sesiones
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'tu_session_secret_muy_seguro',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    },
  })
);

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// Ruta de health check
app.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/pitches', pitchRoutes);

// Manejo de errores
app.use(notFound);
app.use(errorHandler);

// Iniciar servidor
const startServer = async () => {
  try {
    // Verificar conexión a la base de datos
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('❌ No se pudo conectar a la base de datos');
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════╗
║   🚀 Servidor iniciado correctamente       ║
║                                            ║
║   📍 Puerto: ${PORT}                       ║
║   🌍 Entorno: ${process.env.NODE_ENV || 'development'}              ║
║   🔗 URL: http://localhost:${PORT}         ║
║                                            ║
║   ✅ Base de datos conectada               ║
║   🔐 Autenticación Google configurada      ║
╚════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();

export default app;

