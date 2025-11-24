import { pool } from '../../config/database';
import fs from 'fs';
import path from 'path';

const runMigrations = async () => {
  try {
    console.log('🚀 Ejecutando migraciones...');

    const initSqlPath = path.join(__dirname, '../../../database/init.sql');
    const initSql = fs.readFileSync(initSqlPath, 'utf-8');

    await pool.query(initSql);

    console.log('✅ Migraciones ejecutadas exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al ejecutar migraciones:', error);
    process.exit(1);
  }
};

runMigrations();

