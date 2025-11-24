-- Script de inicialización de la base de datos
-- Corporate Pitch Application

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    google_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    picture VARCHAR(500),
    provider VARCHAR(50) DEFAULT 'google',
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de pitches
CREATE TABLE IF NOT EXISTS pitches (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content JSONB,
    status VARCHAR(50) DEFAULT 'draft',
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de presentaciones (slides)
CREATE TABLE IF NOT EXISTS slides (
    id SERIAL PRIMARY KEY,
    pitch_id INTEGER NOT NULL REFERENCES pitches(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL,
    title VARCHAR(255),
    content JSONB,
    layout VARCHAR(50) DEFAULT 'standard',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de archivos/recursos
CREATE TABLE IF NOT EXISTS resources (
    id SERIAL PRIMARY KEY,
    pitch_id INTEGER NOT NULL REFERENCES pitches(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    url VARCHAR(500),
    size BIGINT,
    cloud_provider VARCHAR(50),
    cloud_key VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_pitches_user_id ON pitches(user_id);
CREATE INDEX IF NOT EXISTS idx_pitches_created_at ON pitches(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_slides_pitch_id ON slides(pitch_id);
CREATE INDEX IF NOT EXISTS idx_resources_pitch_id ON resources(pitch_id);

-- Función para actualizar timestamp automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_pitches_updated_at ON pitches;
CREATE TRIGGER update_pitches_updated_at
    BEFORE UPDATE ON pitches
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_slides_updated_at ON slides;
CREATE TRIGGER update_slides_updated_at
    BEFORE UPDATE ON slides
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Datos de ejemplo (opcional - comentar en producción)
-- INSERT INTO users (google_id, email, name, picture, provider)
-- VALUES ('demo123', 'demo@example.com', 'Demo User', 'https://via.placeholder.com/150', 'google')
-- ON CONFLICT (google_id) DO NOTHING;

COMMENT ON TABLE users IS 'Tabla de usuarios autenticados con Google OAuth';
COMMENT ON TABLE pitches IS 'Tabla principal de pitches/presentaciones corporativas';
COMMENT ON TABLE slides IS 'Tabla de diapositivas individuales de cada pitch';
COMMENT ON TABLE resources IS 'Tabla de recursos y archivos asociados a los pitches';

