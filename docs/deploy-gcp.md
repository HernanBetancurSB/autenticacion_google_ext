# 🚀 Despliegue en GCP (Google Cloud Platform)

Guía completa para desplegar Corporate Pitch en Google Cloud Platform de manera escalable y segura.

## 📋 Arquitectura Sugerida

```
├── Compute Engine (Backend Node.js)
├── Cloud Storage (Frontend estático)
├── Cloud SQL PostgreSQL (Base de datos)
├── Cloud Load Balancing
├── Cloud CDN
└── Cloud DNS
```

## 🔧 Prerrequisitos

- Cuenta de GCP activa con billing habilitado
- Google Cloud SDK (gcloud) instalado
- Proyecto de GCP creado
- Dominio personalizado (opcional)

## 1️⃣ Configurar Cloud SQL PostgreSQL

### Crear Instancia

```bash
# Configurar proyecto
gcloud config set project tu-proyecto-id

# Crear instancia Cloud SQL
gcloud sql instances create corporate-pitch-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --root-password=tu_password_muy_seguro \
  --storage-type=SSD \
  --storage-size=10GB \
  --backup-start-time=03:00

# Crear base de datos
gcloud sql databases create corporate_pitch \
  --instance=corporate-pitch-db

# Crear usuario
gcloud sql users create pitchapp \
  --instance=corporate-pitch-db \
  --password=tu_password_seguro
```

### Configurar Conexión

```bash
# Obtener connection name
gcloud sql instances describe corporate-pitch-db --format="value(connectionName)"

# Resultado: tu-proyecto-id:us-central1:corporate-pitch-db
```

## 2️⃣ Desplegar Backend en Compute Engine

### Crear Instancia VM

```bash
# Crear instancia
gcloud compute instances create corporate-pitch-backend \
  --machine-type=e2-micro \
  --zone=us-central1-a \
  --image-family=debian-11 \
  --image-project=debian-cloud \
  --boot-disk-size=10GB \
  --tags=http-server,https-server \
  --scopes=sql-admin,storage-rw,logging-write,monitoring-write

# Configurar firewall
gcloud compute firewall-rules create allow-http \
  --allow tcp:80 \
  --target-tags http-server

gcloud compute firewall-rules create allow-https \
  --allow tcp:443 \
  --target-tags https-server
```

### Conectar y Configurar VM

```bash
# Conectar vía SSH
gcloud compute ssh corporate-pitch-backend --zone=us-central1-a

# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar Git
sudo apt install -y git

# Clonar repositorio
git clone https://github.com/tu-usuario/corporate-pitch-app.git
cd corporate-pitch-app

# Instalar dependencias
npm install
cd backend && npm install
```

### Configurar Cloud SQL Proxy

```bash
# Descargar Cloud SQL Proxy
wget https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64 -O cloud_sql_proxy
chmod +x cloud_sql_proxy

# Crear directorio
sudo mkdir /cloudsql
sudo chmod 777 /cloudsql

# Iniciar Cloud SQL Proxy en background
./cloud_sql_proxy -dir=/cloudsql -instances=tu-proyecto-id:us-central1:corporate-pitch-db &
```

### Configurar Variables de Entorno

```bash
# Crear archivo .env
nano ~/corporate-pitch-app/.env
```

```env
NODE_ENV=production
PORT=3001

# Cloud SQL (via Unix socket)
DB_HOST=/cloudsql/tu-proyecto-id:us-central1:corporate-pitch-db
DB_PORT=5432
DB_NAME=corporate_pitch
DB_USER=pitchapp
DB_PASSWORD=tu_password_seguro

# JWT
JWT_SECRET=generar_clave_segura_produccion
JWT_EXPIRES_IN=7d

# Google OAuth (ya tienes las credenciales de GCP)
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
GOOGLE_CALLBACK_URL=https://api.tudominio.com/api/auth/google/callback

# Frontend
FRONTEND_URL=https://tudominio.com

SESSION_SECRET=generar_session_secret_produccion
```

### Instalar PM2 e Iniciar

```bash
# Instalar PM2
sudo npm install -g pm2

# Build backend
cd ~/corporate-pitch-app/backend
npm run build

# Iniciar con PM2
pm2 start dist/server.js --name corporate-pitch-api

# Configurar inicio automático
pm2 startup systemd
pm2 save

# Ver logs
pm2 logs corporate-pitch-api
```

### Configurar Nginx

```bash
# Instalar Nginx
sudo apt install -y nginx

# Configurar
sudo nano /etc/nginx/sites-available/corporate-pitch
```

```nginx
server {
    listen 80;
    server_name api.tudominio.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Habilitar configuración
sudo ln -s /etc/nginx/sites-available/corporate-pitch /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 3️⃣ Desplegar Frontend en Cloud Storage + Cloud CDN

### Crear Bucket

```bash
# Crear bucket
gsutil mb -l us-central1 gs://corporate-pitch-frontend

# Configurar como sitio web
gsutil web set -m index.html -e index.html gs://corporate-pitch-frontend

# Hacer público
gsutil iam ch allUsers:objectViewer gs://corporate-pitch-frontend
```

### Build y Subir Frontend

```bash
# Local - Build
cd frontend
npm run build

# Subir a Cloud Storage
gsutil -m rsync -r -d dist/ gs://corporate-pitch-frontend
```

### Configurar Cloud CDN

```bash
# Crear backend bucket
gcloud compute backend-buckets create corporate-pitch-backend-bucket \
  --gcs-bucket-name=corporate-pitch-frontend \
  --enable-cdn

# Crear URL map
gcloud compute url-maps create corporate-pitch-url-map \
  --default-backend-bucket=corporate-pitch-backend-bucket

# Crear certificado SSL
gcloud compute ssl-certificates create corporate-pitch-cert \
  --domains=tudominio.com,www.tudominio.com

# Crear HTTPS proxy
gcloud compute target-https-proxies create corporate-pitch-https-proxy \
  --url-map=corporate-pitch-url-map \
  --ssl-certificates=corporate-pitch-cert

# Crear forwarding rule
gcloud compute forwarding-rules create corporate-pitch-https-rule \
  --global \
  --target-https-proxy=corporate-pitch-https-proxy \
  --ports=443
```

## 4️⃣ Configurar Load Balancer

```bash
# Crear grupo de instancias
gcloud compute instance-groups unmanaged create corporate-pitch-ig \
  --zone=us-central1-a

gcloud compute instance-groups unmanaged add-instances corporate-pitch-ig \
  --instances=corporate-pitch-backend \
  --zone=us-central1-a

# Crear health check
gcloud compute health-checks create http corporate-pitch-health-check \
  --port=3001 \
  --request-path=/health

# Crear backend service
gcloud compute backend-services create corporate-pitch-backend-service \
  --protocol=HTTP \
  --health-checks=corporate-pitch-health-check \
  --global

gcloud compute backend-services add-backend corporate-pitch-backend-service \
  --instance-group=corporate-pitch-ig \
  --instance-group-zone=us-central1-a \
  --global
```

## 5️⃣ Configurar Cloud DNS

```bash
# Crear zona DNS
gcloud dns managed-zones create corporate-pitch-zone \
  --dns-name=tudominio.com. \
  --description="Corporate Pitch DNS Zone"

# Obtener IP del Load Balancer
gcloud compute forwarding-rules describe corporate-pitch-https-rule --global --format="value(IPAddress)"

# Crear registros DNS
gcloud dns record-sets transaction start --zone=corporate-pitch-zone

# A record para dominio principal
gcloud dns record-sets transaction add [IP_LOAD_BALANCER] \
  --name=tudominio.com. \
  --ttl=300 \
  --type=A \
  --zone=corporate-pitch-zone

# A record para www
gcloud dns record-sets transaction add [IP_LOAD_BALANCER] \
  --name=www.tudominio.com. \
  --ttl=300 \
  --type=A \
  --zone=corporate-pitch-zone

# Ejecutar transacción
gcloud dns record-sets transaction execute --zone=corporate-pitch-zone

# Ver name servers
gcloud dns managed-zones describe corporate-pitch-zone --format="value(nameServers)"
```

## 6️⃣ Migrar Base de Datos

```bash
# Desde VM, ejecutar migraciones
cd ~/corporate-pitch-app/backend
npm run migrate
```

## 7️⃣ Configurar Logs y Monitoreo

### Cloud Logging

```bash
# Instalar agente de logging
curl -sSO https://dl.google.com/cloudagents/add-logging-agent-repo.sh
sudo bash add-logging-agent-repo.sh --also-install

# Configurar PM2 logs
pm2 install pm2-logrotate
```

### Cloud Monitoring

```bash
# Crear alerta para CPU
gcloud alpha monitoring policies create \
  --notification-channels=[CHANNEL_ID] \
  --display-name="High CPU Usage" \
  --condition-display-name="CPU > 80%" \
  --condition-threshold-value=0.8 \
  --condition-threshold-duration=60s
```

## 8️⃣ SSL/TLS con Cloud Load Balancing

GCP gestiona automáticamente los certificados SSL cuando usas Cloud Load Balancing con dominios verificados.

```bash
# El certificado se renovará automáticamente
# Verificar estado
gcloud compute ssl-certificates describe corporate-pitch-cert
```

## 💰 Estimación de Costos (us-central1)

- Compute Engine e2-micro: ~$7/mes
- Cloud SQL db-f1-micro: ~$10/mes
- Cloud Storage: ~$0.50/mes (1GB)
- Cloud CDN: ~$1/mes (10GB)
- Load Balancing: ~$18/mes
- **Total estimado**: ~$37/mes

## 🚀 CI/CD con Cloud Build

```yaml
# cloudbuild.yaml
steps:
  # Build backend
  - name: 'node:18'
    dir: 'backend'
    entrypoint: npm
    args: ['install']
  
  - name: 'node:18'
    dir: 'backend'
    entrypoint: npm
    args: ['run', 'build']
  
  # Deploy backend
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - compute
      - ssh
      - corporate-pitch-backend
      - --zone=us-central1-a
      - --command
      - 'cd ~/corporate-pitch-app && git pull && cd backend && npm install && npm run build && pm2 restart corporate-pitch-api'
  
  # Build y deploy frontend
  - name: 'node:18'
    dir: 'frontend'
    entrypoint: npm
    args: ['install']
  
  - name: 'node:18'
    dir: 'frontend'
    entrypoint: npm
    args: ['run', 'build']
  
  - name: 'gcr.io/cloud-builders/gsutil'
    args: ['-m', 'rsync', '-r', '-d', 'frontend/dist/', 'gs://corporate-pitch-frontend']

timeout: 1200s
```

```bash
# Configurar trigger
gcloud builds triggers create github \
  --repo-name=corporate-pitch-app \
  --repo-owner=tu-usuario \
  --branch-pattern=^main$ \
  --build-config=cloudbuild.yaml
```

## 🔒 Mejores Prácticas de Seguridad

```bash
# 1. Usar Secret Manager para credenciales
gcloud secrets create google-client-secret --data-file=-

# 2. Configurar firewall restrictivo
gcloud compute firewall-rules update allow-http \
  --source-ranges=0.0.0.0/0

# 3. Habilitar Cloud Armor (DDoS protection)
gcloud compute security-policies create corporate-pitch-policy

# 4. Backups automáticos de Cloud SQL
gcloud sql instances patch corporate-pitch-db \
  --backup-start-time=03:00 \
  --enable-bin-log
```

## ✅ Checklist de Despliegue

- [ ] Cloud SQL configurado
- [ ] Compute Engine corriendo
- [ ] Cloud SQL Proxy configurado
- [ ] Backend desplegado con PM2
- [ ] Nginx configurado
- [ ] Frontend en Cloud Storage
- [ ] Cloud CDN habilitado
- [ ] Load Balancer configurado
- [ ] SSL configurado
- [ ] Cloud DNS configurado
- [ ] Variables de entorno configuradas
- [ ] Migraciones ejecutadas
- [ ] Google OAuth actualizado
- [ ] Logging y monitoreo configurados
- [ ] Backups automatizados

---

**¡Tu aplicación está lista en GCP! 🎉**

