# 🚀 Despliegue en Azure (Microsoft Azure)

Guía completa para desplegar Corporate Pitch en Microsoft Azure de manera escalable y segura.

## 📋 Arquitectura Sugerida

```
├── App Service (Backend Node.js)
├── Static Web Apps (Frontend React)
├── Azure Database for PostgreSQL (Base de datos)
├── Azure CDN
├── Application Gateway
└── Azure DNS
```

## 🔧 Prerrequisitos

- Cuenta de Azure activa
- Azure CLI instalado
- Suscripción de Azure
- Dominio personalizado (opcional)

## 1️⃣ Configurar Azure Database for PostgreSQL

### Crear Servidor PostgreSQL

```bash
# Login a Azure
az login

# Crear grupo de recursos
az group create \
  --name corporate-pitch-rg \
  --location eastus

# Crear servidor PostgreSQL
az postgres flexible-server create \
  --name corporate-pitch-db \
  --resource-group corporate-pitch-rg \
  --location eastus \
  --admin-user pitchapp \
  --admin-password Tu_Password_Muy_Seguro123! \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --version 15 \
  --storage-size 32

# Crear base de datos
az postgres flexible-server db create \
  --resource-group corporate-pitch-rg \
  --server-name corporate-pitch-db \
  --database-name corporate_pitch
```

### Configurar Firewall

```bash
# Permitir servicios de Azure
az postgres flexible-server firewall-rule create \
  --resource-group corporate-pitch-rg \
  --name corporate-pitch-db \
  --rule-name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0

# Permitir tu IP (para desarrollo)
az postgres flexible-server firewall-rule create \
  --resource-group corporate-pitch-rg \
  --name corporate-pitch-db \
  --rule-name AllowMyIP \
  --start-ip-address [TU_IP] \
  --end-ip-address [TU_IP]
```

## 2️⃣ Desplegar Backend en App Service

### Preparar Aplicación

```bash
# En tu proyecto local
cd backend

# Crear archivo de configuración para Azure
cat > web.config << 'EOF'
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <handlers>
      <add name="iisnode" path="dist/server.js" verb="*" modules="iisnode"/>
    </handlers>
    <rewrite>
      <rules>
        <rule name="NodeInspector" patternSyntax="ECMAScript" stopProcessing="true">
          <match url="^dist/server.js\/debug[\/]?" />
        </rule>
        <rule name="StaticContent">
          <action type="Rewrite" url="public{REQUEST_URI}"/>
        </rule>
        <rule name="DynamicContent">
          <conditions>
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="True"/>
          </conditions>
          <action type="Rewrite" url="dist/server.js"/>
        </rule>
      </rules>
    </rewrite>
    <security>
      <requestFiltering>
        <hiddenSegments>
          <remove segment="bin"/>
        </hiddenSegments>
      </requestFiltering>
    </security>
    <httpErrors existingResponse="PassThrough" />
  </system.webServer>
</configuration>
EOF
```

### Crear App Service

```bash
# Crear App Service Plan
az appservice plan create \
  --name corporate-pitch-plan \
  --resource-group corporate-pitch-rg \
  --location eastus \
  --sku B1 \
  --is-linux

# Crear Web App
az webapp create \
  --name corporate-pitch-api \
  --resource-group corporate-pitch-rg \
  --plan corporate-pitch-plan \
  --runtime "NODE|18-lts"

# Configurar variables de entorno
az webapp config appsettings set \
  --name corporate-pitch-api \
  --resource-group corporate-pitch-rg \
  --settings \
    NODE_ENV=production \
    PORT=8080 \
    DB_HOST=corporate-pitch-db.postgres.database.azure.com \
    DB_PORT=5432 \
    DB_NAME=corporate_pitch \
    DB_USER=pitchapp \
    DB_PASSWORD=Tu_Password_Muy_Seguro123! \
    JWT_SECRET=generar_clave_segura_produccion \
    JWT_EXPIRES_IN=7d \
    GOOGLE_CLIENT_ID=tu_google_client_id \
    GOOGLE_CLIENT_SECRET=tu_google_client_secret \
    GOOGLE_CALLBACK_URL=https://corporate-pitch-api.azurewebsites.net/api/auth/google/callback \
    FRONTEND_URL=https://corporate-pitch-frontend.azurestaticapps.net \
    SESSION_SECRET=generar_session_secret_produccion \
    WEBSITES_PORT=3001
```

### Desplegar con Git

```bash
# Configurar Git deployment
az webapp deployment source config-local-git \
  --name corporate-pitch-api \
  --resource-group corporate-pitch-rg

# Obtener URL de Git
az webapp deployment list-publishing-credentials \
  --name corporate-pitch-api \
  --resource-group corporate-pitch-rg

# Agregar remote y push
cd backend
git init
git add .
git commit -m "Initial deployment"
git remote add azure https://corporate-pitch-api.scm.azurewebsites.net:443/corporate-pitch-api.git
git push azure main
```

### Alternativa: Desplegar con ZIP

```bash
# Build local
npm run build

# Crear ZIP
cd ..
zip -r backend.zip backend/

# Desplegar
az webapp deployment source config-zip \
  --resource-group corporate-pitch-rg \
  --name corporate-pitch-api \
  --src backend.zip
```

## 3️⃣ Desplegar Frontend en Static Web Apps

### Preparar Frontend

```bash
cd frontend

# Actualizar .env.production
cat > .env.production << EOF
VITE_API_URL=https://corporate-pitch-api.azurewebsites.net
EOF
```

### Crear Static Web App

```bash
# Via Azure CLI
az staticwebapp create \
  --name corporate-pitch-frontend \
  --resource-group corporate-pitch-rg \
  --location eastus2 \
  --sku Free

# Obtener deployment token
az staticwebapp secrets list \
  --name corporate-pitch-frontend \
  --resource-group corporate-pitch-rg \
  --query "properties.apiKey" -o tsv
```

### Desplegar con GitHub Actions

```yaml
# .github/workflows/azure-static-web-apps.yml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true
      
      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/frontend"
          api_location: ""
          output_location: "dist"
          app_build_command: "npm run build"

  close_pull_request_job:
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    name: Close Pull Request Job
    steps:
      - name: Close Pull Request
        id: closepullrequest
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          action: "close"
```

### Deploy Manual

```bash
# Instalar SWA CLI
npm install -g @azure/static-web-apps-cli

# Build
npm run build

# Deploy
swa deploy \
  --app-location ./dist \
  --deployment-token [TU_DEPLOYMENT_TOKEN]
```

## 4️⃣ Configurar SSL y Dominio Personalizado

### App Service (Backend)

```bash
# Agregar dominio personalizado
az webapp config hostname add \
  --webapp-name corporate-pitch-api \
  --resource-group corporate-pitch-rg \
  --hostname api.tudominio.com

# Crear certificado SSL administrado
az webapp config ssl create \
  --resource-group corporate-pitch-rg \
  --name corporate-pitch-api \
  --hostname api.tudominio.com

# Vincular certificado
az webapp config ssl bind \
  --resource-group corporate-pitch-rg \
  --name corporate-pitch-api \
  --certificate-thumbprint [THUMBPRINT] \
  --ssl-type SNI
```

### Static Web App (Frontend)

```bash
# Agregar dominio personalizado
az staticwebapp hostname set \
  --name corporate-pitch-frontend \
  --resource-group corporate-pitch-rg \
  --hostname tudominio.com

# SSL se configura automáticamente
```

## 5️⃣ Configurar Azure CDN

```bash
# Crear perfil CDN
az cdn profile create \
  --resource-group corporate-pitch-rg \
  --name corporate-pitch-cdn \
  --sku Standard_Microsoft

# Crear endpoint
az cdn endpoint create \
  --resource-group corporate-pitch-rg \
  --profile-name corporate-pitch-cdn \
  --name corporate-pitch \
  --origin corporate-pitch-frontend.azurestaticapps.net \
  --origin-host-header corporate-pitch-frontend.azurestaticapps.net \
  --enable-compression
```

## 6️⃣ Migrar Base de Datos

```bash
# Conectar a PostgreSQL
psql "host=corporate-pitch-db.postgres.database.azure.com port=5432 dbname=corporate_pitch user=pitchapp password=Tu_Password_Muy_Seguro123! sslmode=require"

# O ejecutar migraciones desde backend desplegado
az webapp ssh --name corporate-pitch-api --resource-group corporate-pitch-rg
cd ~/site/wwwroot
npm run migrate
```

## 7️⃣ Configurar Monitoreo y Logs

### Application Insights

```bash
# Crear Application Insights
az monitor app-insights component create \
  --app corporate-pitch-insights \
  --location eastus \
  --resource-group corporate-pitch-rg

# Obtener instrumentation key
az monitor app-insights component show \
  --app corporate-pitch-insights \
  --resource-group corporate-pitch-rg \
  --query instrumentationKey -o tsv

# Configurar en App Service
az webapp config appsettings set \
  --name corporate-pitch-api \
  --resource-group corporate-pitch-rg \
  --settings APPLICATIONINSIGHTS_CONNECTION_STRING=[CONNECTION_STRING]
```

### Ver Logs

```bash
# Logs en tiempo real
az webapp log tail \
  --name corporate-pitch-api \
  --resource-group corporate-pitch-rg

# Ver logs históricos
az webapp log download \
  --name corporate-pitch-api \
  --resource-group corporate-pitch-rg \
  --log-file logs.zip
```

## 8️⃣ Configurar Backups Automáticos

```bash
# Crear Storage Account para backups
az storage account create \
  --name corporatepitchbackup \
  --resource-group corporate-pitch-rg \
  --location eastus \
  --sku Standard_LRS

# Configurar backup de App Service
az webapp config backup create \
  --resource-group corporate-pitch-rg \
  --webapp-name corporate-pitch-api \
  --backup-name initial-backup \
  --container-url [SAS_URL]

# Backup automático de PostgreSQL (ya incluido)
```

## 💰 Estimación de Costos (East US)

- App Service B1: ~$13/mes
- PostgreSQL Burstable B1ms: ~$12/mes
- Static Web Apps (Free): $0/mes
- Application Insights: ~$2/mes (primeros 5GB gratis)
- Storage Account: ~$1/mes
- **Total estimado**: ~$28/mes

## 🚀 CI/CD Completo con Azure DevOps

```yaml
# azure-pipelines.yml
trigger:
  branches:
    include:
      - main

pool:
  vmImage: 'ubuntu-latest'

stages:
  - stage: Build
    jobs:
      - job: BuildBackend
        steps:
          - task: NodeTool@0
            inputs:
              versionSpec: '18.x'
          
          - script: |
              cd backend
              npm install
              npm run build
            displayName: 'Build Backend'
          
          - task: ArchiveFiles@2
            inputs:
              rootFolderOrFile: 'backend'
              archiveFile: '$(Build.ArtifactStagingDirectory)/backend.zip'
          
          - task: PublishBuildArtifacts@1
      
      - job: BuildFrontend
        steps:
          - task: NodeTool@0
            inputs:
              versionSpec: '18.x'
          
          - script: |
              cd frontend
              npm install
              npm run build
            displayName: 'Build Frontend'
          
          - task: PublishBuildArtifacts@1

  - stage: Deploy
    jobs:
      - job: DeployBackend
        steps:
          - task: AzureWebApp@1
            inputs:
              azureSubscription: 'Azure Subscription'
              appName: 'corporate-pitch-api'
              package: '$(Build.ArtifactStagingDirectory)/backend.zip'
      
      - job: DeployFrontend
        steps:
          - task: AzureStaticWebApp@0
            inputs:
              app_location: 'frontend'
              output_location: 'dist'
```

## ✅ Checklist de Despliegue

- [ ] Azure Database for PostgreSQL configurado
- [ ] App Service creado y configurado
- [ ] Backend desplegado
- [ ] Static Web App creada
- [ ] Frontend desplegado
- [ ] SSL configurado en ambos
- [ ] Dominios personalizados configurados
- [ ] Variables de entorno configuradas
- [ ] Migraciones ejecutadas
- [ ] Google OAuth actualizado
- [ ] Application Insights configurado
- [ ] Logs habilitados
- [ ] Backups configurados
- [ ] CI/CD configurado

---

**¡Tu aplicación está lista en Azure! 🎉**

