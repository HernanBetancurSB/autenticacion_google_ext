import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import path from 'path';
import { pool } from './database';

// Cargar variables de entorno desde la raíz del proyecto
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// Serialización de usuario para la sesión
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialización de usuario desde la sesión
passport.deserializeUser(async (id: number, done) => {
  try {
    const result = await pool.query(
      'SELECT id, email, name, picture, provider FROM users WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return done(new Error('Usuario no encontrado'), null);
    }
    
    done(null, result.rows[0]);
  } catch (error) {
    done(error, null);
  }
});

// Estrategia de autenticación con Google OAuth 2.0
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/api/auth/google/callback',
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        // Buscar usuario existente
        const existingUser = await pool.query(
          'SELECT * FROM users WHERE google_id = $1',
          [profile.id]
        );

        if (existingUser.rows.length > 0) {
          // Usuario ya existe, actualizamos última conexión
          await pool.query(
            'UPDATE users SET last_login = NOW() WHERE id = $1',
            [existingUser.rows[0].id]
          );
          return done(null, existingUser.rows[0]);
        }

        // Crear nuevo usuario
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : '';
        const picture = profile.photos && profile.photos[0] ? profile.photos[0].value : '';
        
        const newUser = await pool.query(
          `INSERT INTO users (google_id, email, name, picture, provider, created_at, last_login)
           VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
           RETURNING *`,
          [profile.id, email, profile.displayName, picture, 'google']
        );

        return done(null, newUser.rows[0]);
      } catch (error) {
        console.error('Error en la autenticación de Google:', error);
        return done(error as Error, undefined);
      }
    }
  )
);

export default passport;

