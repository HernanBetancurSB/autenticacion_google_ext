import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno desde la raíz del proyecto
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'corporate_pitch',
  user: process.env.DB_USER || 'pitchapp',
  password: process.env.DB_PASSWORD || 'pitchapp2024',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test de conexión
pool.on('connect', () => {
  console.log('✅ Conectado a PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Error inesperado en la base de datos:', err);
  process.exit(-1);
});

export const testConnection = async (): Promise<boolean> => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('🔍 Test de conexión exitoso:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
    return false;
  }
};

