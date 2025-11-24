# 📦 Instrucciones para Actualizar Node.js a v18

## ✅ Pasos Completados:

1. Ve a: https://nodejs.org/
2. Descarga Node.js 18 LTS
3. Instala el archivo descargado
4. Reinicia VS Code

## 🔄 Después de Actualizar, ejecuta estos comandos:

```bash
# 1. Verifica la versión (debe ser 18.x.x)
node --version

# 2. Reinstala las dependencias del proyecto
cd C:\Fuentes\autenticador-google-ext
npm install

# 3. Reinstala dependencias del backend
cd backend
npm install

# 4. Reinstala dependencias del frontend
cd ..\frontend
npm install

# 5. Vuelve a la raíz
cd ..

# 6. Inicia la aplicación
npm run dev
```

## 📱 Luego abre tu navegador:

http://localhost:5173

## ✨ ¡Y listo! Tu aplicación debería funcionar correctamente.



