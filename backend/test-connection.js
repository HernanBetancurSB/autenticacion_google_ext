const dotenv = require('dotenv');
const path = require('path');
const { Pool } = require('pg');

// Cargar variables de entorno
dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('🔍 Verificando configuración...\n');

console.log('Variables de entorno:');
console.log('- DB_HOST:', process.env.DB_HOST);
console.log('- DB_PORT:', process.env.DB_PORT);
console.log('- DB_NAME:', process.env.DB_NAME);
console.log('- DB_USER:', process.env.DB_USER);
console.log('- GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✅ Configurado' : '❌ NO configurado');
console.log('- GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '✅ Configurado' : '❌ NO configurado');
console.log('\n📊 Probando conexión a PostgreSQL...\n');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'corporate_pitch',
  user: process.env.DB_USER || 'pitchapp',
  password: process.env.DB_PASSWORD || 'pitchapp2024',
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Error de conexión:', err.message);
    process.exit(1);
  }
  console.log('✅ Conexión exitosa a PostgreSQL');
  console.log('📅 Timestamp:', res.rows[0].now);
  pool.end();
  process.exit(0);
});

