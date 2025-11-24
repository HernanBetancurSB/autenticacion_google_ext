# 📊 Queries Útiles - Corporate Pitch Database

## 🔌 Datos de Conexión

```
Host:       localhost
Puerto:     5432
Database:   corporate_pitch
Usuario:    pitchapp
Contraseña: pitchapp2024
```

## 📝 Comandos PowerShell para Ejecutar Queries

### Estructura Básica:
```powershell
docker exec corporate-pitch-db psql -U pitchapp -d corporate_pitch -c "TU_QUERY_AQUI;"
```

---

## 👥 Queries para USERS

### Ver todos los usuarios
```powershell
docker exec corporate-pitch-db psql -U pitchapp -d corporate_pitch -c "SELECT id, email, name, created_at FROM users;"
```

### Ver un usuario específico por email
```powershell
docker exec corporate-pitch-db psql -U pitchapp -d corporate_pitch -c "SELECT * FROM users WHERE email = 'tu-email@gmail.com';"
```

### Contar usuarios
```powershell
docker exec corporate-pitch-db psql -U pitchapp -d corporate_pitch -c "SELECT COUNT(*) as total_usuarios FROM users;"
```

### Usuarios registrados hoy
```powershell
docker exec corporate-pitch-db psql -U pitchapp -d corporate_pitch -c "SELECT * FROM users WHERE DATE(created_at) = CURRENT_DATE;"
```

---

## 🎯 Queries para PITCHES

### Ver todos los pitches
```powershell
docker exec corporate-pitch-db psql -U pitchapp -d corporate_pitch -c "SELECT id, title, status, created_at FROM pitches;"
```

### Ver pitches con información del usuario
```powershell
docker exec corporate-pitch-db psql -U pitchapp -d corporate_pitch -c "SELECT p.id, p.title, p.status, u.name as autor, p.created_at FROM pitches p JOIN users u ON p.user_id = u.id;"
```

### Ver pitches de un usuario específico
```powershell
docker exec corporate-pitch-db psql -U pitchapp -d corporate_pitch -c "SELECT * FROM pitches WHERE user_id = 1;"
```

### Contar pitches por estado
```powershell
docker exec corporate-pitch-db psql -U pitchapp -d corporate_pitch -c "SELECT status, COUNT(*) as cantidad FROM pitches GROUP BY status;"
```

### Pitches más vistos
```powershell
docker exec corporate-pitch-db psql -U pitchapp -d corporate_pitch -c "SELECT title, views FROM pitches ORDER BY views DESC LIMIT 5;"
```

---

## 🖼️ Queries para SLIDES

### Ver todas las slides
```powershell
docker exec corporate-pitch-db psql -U pitchapp -d corporate_pitch -c "SELECT * FROM slides;"
```

### Ver slides de un pitch específico
```powershell
docker exec corporate-pitch-db psql -U pitchapp -d corporate_pitch -c "SELECT * FROM slides WHERE pitch_id = 1 ORDER BY order_index;"
```

### Contar slides por pitch
```powershell
docker exec corporate-pitch-db psql -U pitchapp -d corporate_pitch -c "SELECT pitch_id, COUNT(*) as total_slides FROM slides GROUP BY pitch_id;"
```

---

## 📎 Queries para RESOURCES

### Ver todos los recursos
```powershell
docker exec corporate-pitch-db psql -U pitchapp -d corporate_pitch -c "SELECT * FROM resources;"
```

### Ver recursos de un pitch
```powershell
docker exec corporate-pitch-db psql -U pitchapp -d corporate_pitch -c "SELECT name, type, size FROM resources WHERE pitch_id = 1;"
```

---

## 🔍 Queries de Análisis

### Dashboard completo de un usuario
```powershell
docker exec corporate-pitch-db psql -U pitchapp -d corporate_pitch -c "
SELECT 
    u.name,
    COUNT(DISTINCT p.id) as total_pitches,
    COUNT(DISTINCT s.id) as total_slides,
    COUNT(DISTINCT r.id) as total_recursos
FROM users u
LEFT JOIN pitches p ON u.id = p.user_id
LEFT JOIN slides s ON p.id = s.pitch_id
LEFT JOIN resources r ON p.id = r.pitch_id
WHERE u.id = 1
GROUP BY u.name;
"
```

### Pitches más recientes con autor
```powershell
docker exec corporate-pitch-db psql -U pitchapp -d corporate_pitch -c "
SELECT 
    p.title,
    u.name as autor,
    p.status,
    p.created_at
FROM pitches p
JOIN users u ON p.user_id = u.id
ORDER BY p.created_at DESC
LIMIT 10;
"
```

### Estadísticas generales
```powershell
docker exec corporate-pitch-db psql -U pitchapp -d corporate_pitch -c "
SELECT 
    (SELECT COUNT(*) FROM users) as total_usuarios,
    (SELECT COUNT(*) FROM pitches) as total_pitches,
    (SELECT COUNT(*) FROM slides) as total_slides,
    (SELECT COUNT(*) FROM resources) as total_recursos;
"
```

---

## 🛠️ Comandos de Administración

### Ver todas las tablas
```powershell
docker exec corporate-pitch-db psql -U pitchapp -d corporate_pitch -c "\dt"
```

### Ver estructura de una tabla
```powershell
docker exec corporate-pitch-db psql -U pitchapp -d corporate_pitch -c "\d users"
docker exec corporate-pitch-db psql -U pitchapp -d corporate_pitch -c "\d pitches"
docker exec corporate-pitch-db psql -U pitchapp -d corporate_pitch -c "\d slides"
docker exec corporate-pitch-db psql -U pitchapp -d corporate_pitch -c "\d resources"
```

### Ver índices de una tabla
```powershell
docker exec corporate-pitch-db psql -U pitchapp -d corporate_pitch -c "\di"
```

### Ver tamaño de las tablas
```powershell
docker exec corporate-pitch-db psql -U pitchapp -d corporate_pitch -c "
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
"
```

---

## 🧪 Insertar Datos de Prueba

### Insertar usuario de prueba
```powershell
docker exec corporate-pitch-db psql -U pitchapp -d corporate_pitch -c "
INSERT INTO users (google_id, email, name, picture, provider)
VALUES ('test123', 'test@example.com', 'Usuario de Prueba', 'https://via.placeholder.com/150', 'google')
ON CONFLICT (google_id) DO NOTHING;
"
```

### Insertar pitch de prueba
```powershell
docker exec corporate-pitch-db psql -U pitchapp -d corporate_pitch -c "
INSERT INTO pitches (user_id, title, description, status)
VALUES (1, 'Mi Primer Pitch', 'Este es un pitch de prueba', 'draft');
"
```

---

## 🗑️ Limpiar Datos (¡CUIDADO!)

### Eliminar todos los pitches (conserva usuarios)
```powershell
docker exec corporate-pitch-db psql -U pitchapp -d corporate_pitch -c "DELETE FROM pitches;"
```

### Eliminar todo (reset completo)
```powershell
docker exec corporate-pitch-db psql -U pitchapp -d corporate_pitch -c "
TRUNCATE users, pitches, slides, resources RESTART IDENTITY CASCADE;
"
```

---

## 💡 Tips

1. **Para queries largos**, mejor usa DBeaver o pgAdmin
2. **Para desarrollo rápido**, ejecuta desde PowerShell
3. **Para inspección visual**, usa VS Code con extensión PostgreSQL
4. **Siempre haz backup** antes de DELETE o TRUNCATE

---

## 🔐 Backup y Restore

### Hacer backup de la BD
```powershell
docker exec corporate-pitch-db pg_dump -U pitchapp corporate_pitch > backup.sql
```

### Restaurar backup
```powershell
Get-Content backup.sql | docker exec -i corporate-pitch-db psql -U pitchapp -d corporate_pitch
```

---

**¡Guarda este archivo para consultas rápidas!** 📌

