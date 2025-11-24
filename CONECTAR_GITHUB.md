# 🔗 Conectar Proyecto a GitHub

## ✅ Ya realizado:
- ✅ Git inicializado
- ✅ Primer commit hecho
- ✅ 50 archivos listos para subir

---

## 📋 Pasos para crear el repositorio en GitHub:

### Paso 1: Crear Repositorio en GitHub

1. **Ve a GitHub:** https://github.com/new

2. **Configura el repositorio:**
   ```
   Repository name: corporate-pitch-app
   Description: Aplicativo corporativo para presentaciones de pitch con React, Node.js, PostgreSQL y Google OAuth
   ```

3. **Opciones:**
   - ✅ **Público** o **Privado** (tú eliges)
   - ❌ **NO** marques "Add a README file"
   - ❌ **NO** marques "Add .gitignore"
   - ❌ **NO** marques "Choose a license"
   
   (Ya tenemos estos archivos localmente)

4. **Haz clic en:** "Create repository"

---

### Paso 2: Conectar tu repositorio local

Una vez creado el repositorio en GitHub, verás una página con instrucciones. 

**COPIA la URL de tu repositorio** (será algo como):
```
https://github.com/TU-USUARIO/corporate-pitch-app.git
```

Luego ejecuta estos comandos en tu terminal de VS Code:

```powershell
# 1. Agregar el remote de GitHub (reemplaza TU-USUARIO con tu usuario de GitHub)
git remote add origin https://github.com/TU-USUARIO/corporate-pitch-app.git

# 2. Cambiar la rama principal a 'main' (GitHub usa 'main' por defecto)
git branch -M main

# 3. Subir el código a GitHub
git push -u origin main
```

---

### Paso 3: Verificar

Una vez que hayas hecho el push, actualiza la página de GitHub y deberías ver:

- ✅ 50 archivos
- ✅ README.md con toda la documentación
- ✅ Backend y Frontend organizados
- ✅ Documentación de despliegue
- ✅ Docker compose configurado

---

## 🔐 Si tienes autenticación de 2 factores en GitHub:

Necesitarás usar un **Personal Access Token** en lugar de tu contraseña:

1. Ve a: https://github.com/settings/tokens
2. Click en "Generate new token" → "Generate new token (classic)"
3. Dale un nombre: "Corporate Pitch Development"
4. Selecciona scope: `repo` (todos los checkboxes de repo)
5. Click en "Generate token"
6. **COPIA EL TOKEN** (no podrás verlo después)
7. Usa este token en lugar de tu contraseña cuando te lo pida Git

---

## 📝 Comandos rápidos para futuros cambios:

```powershell
# Ver estado de cambios
git status

# Agregar todos los cambios
git add .

# Hacer commit
git commit -m "Descripción de tus cambios"

# Subir a GitHub
git push

# Ver el historial
git log --oneline

# Crear una nueva rama
git checkout -b nombre-de-rama
```

---

## 🚨 IMPORTANTE: Archivos NO subidos a GitHub

Por seguridad, estos archivos NO se subirán (están en .gitignore):

- ❌ `.env` (tus credenciales de Google OAuth)
- ❌ `node_modules/` (dependencias)
- ❌ `dist/` y `build/` (archivos compilados)
- ❌ Archivos de logs

✅ **Esto es correcto y seguro**

---

## 📤 ¿Listo para subir?

Ejecuta los comandos del **Paso 2** después de crear el repositorio en GitHub.

Si tienes algún problema, avísame! 😊

