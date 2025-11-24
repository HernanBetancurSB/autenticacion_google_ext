# 🚀 Despliegue en AWS (Amazon Web Services)

Guía completa para desplegar Corporate Pitch en AWS de manera escalable y segura.

## 📋 Arquitectura Sugerida

```
├── VPC (Virtual Private Cloud)
│   ├── EC2 (Backend Node.js)
│   ├── S3 (Frontend estático + Assets)
│   ├── RDS PostgreSQL (Base de datos)
│   ├── CloudFront (CDN)
│   ├── Route 53 (DNS)
│   └── Application Load Balancer
```

## 🔧 Prerrequisitos

- Cuenta de AWS activa
- AWS CLI instalado y configurado
- Dominio personalizado (opcional)
- Certificado SSL de AWS Certificate Manager

## 1️⃣ Configurar RDS PostgreSQL

### Crear Base de Datos

```bash
# Vía AWS Console:
# 1. Ve a RDS → Create Database
# 2. Selecciona PostgreSQL 15
# 3. Template: Free tier o Production
# 4. Configuración:
#    - DB instance identifier: corporate-pitch-db
#    - Master username: pitchapp
#    - Master password: [tu_password_seguro]
#    - DB name: corporate_pitch
# 5. Conectividad:
#    - VPC: default o crear nuevo
#    - Public access: No (seguridad)
#    - VPC security group: Crear nuevo
# 6. Puerto: 5432
```

### Configurar Security Group

```bash
# Permitir conexiones desde EC2
# Regla de entrada:
Type: PostgreSQL
Protocol: TCP
Port: 5432
Source: [Security Group de EC2]
```

## 2️⃣ Desplegar Backend en EC2

### Crear Instancia EC2

```bash
# Via AWS CLI
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t2.micro \
  --key-name tu-key-pair \
  --security-group-ids sg-xxxxx \
  --subnet-id subnet-xxxxx \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=corporate-pitch-backend}]'
```

### Conectar y Configurar

```bash
# Conectar vía SSH
ssh -i "tu-key.pem" ec2-user@ec2-xx-xx-xx-xx.compute.amazonaws.com

# Actualizar sistema
sudo yum update -y

# Instalar Node.js 18
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Instalar Git
sudo yum install -y git

# Clonar repositorio
git clone https://github.com/tu-usuario/corporate-pitch-app.git
cd corporate-pitch-app

# Instalar dependencias
npm install
cd backend && npm install

# Configurar variables de entorno
sudo nano /home/ec2-user/.env
```

### Archivo .env para Producción

```env
NODE_ENV=production
PORT=3001

# RDS Database
DB_HOST=corporate-pitch-db.xxxxxxxxx.us-east-1.rds.amazonaws.com
DB_PORT=5432
DB_NAME=corporate_pitch
DB_USER=pitchapp
DB_PASSWORD=tu_password_seguro

# JWT
JWT_SECRET=generar_clave_segura_produccion
JWT_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
GOOGLE_CALLBACK_URL=https://api.tudominio.com/api/auth/google/callback

# Frontend
FRONTEND_URL=https://tudominio.com

SESSION_SECRET=generar_session_secret_produccion
```

### Instalar PM2 y Iniciar Aplicación

```bash
# Instalar PM2
sudo npm install -g pm2

# Build del backend
cd ~/corporate-pitch-app/backend
npm run build

# Iniciar con PM2
pm2 start dist/server.js --name corporate-pitch-api

# Configurar inicio automático
pm2 startup
pm2 save

# Ver logs
pm2 logs corporate-pitch-api
```

### Configurar Nginx como Reverse Proxy

```bash
# Instalar Nginx
sudo yum install -y nginx

# Configurar
sudo nano /etc/nginx/conf.d/corporate-pitch.conf
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
# Iniciar Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

## 3️⃣ Desplegar Frontend en S3 + CloudFront

### Build del Frontend

```bash
# Local
cd frontend
npm run build
```

### Crear Bucket S3

```bash
# Crear bucket
aws s3 mb s3://corporate-pitch-frontend

# Configurar como sitio web estático
aws s3 website s3://corporate-pitch-frontend \
  --index-document index.html \
  --error-document index.html

# Subir archivos
aws s3 sync dist/ s3://corporate-pitch-frontend --delete
```

### Configurar CloudFront

```bash
# Via AWS Console:
# 1. Ve a CloudFront → Create Distribution
# 2. Origin:
#    - Origin domain: corporate-pitch-frontend.s3.amazonaws.com
#    - Origin access: Origin access control
# 3. Default cache behavior:
#    - Viewer protocol policy: Redirect HTTP to HTTPS
#    - Allowed HTTP methods: GET, HEAD, OPTIONS
# 4. Settings:
#    - Price class: Use only North America and Europe
#    - Alternate domain name (CNAME): tudominio.com
#    - Custom SSL certificate: Selecciona tu certificado ACM
# 5. Default root object: index.html
```

### Política de Bucket S3

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontServicePrincipal",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::corporate-pitch-frontend/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::ACCOUNT-ID:distribution/DISTRIBUTION-ID"
        }
      }
    }
  ]
}
```

## 4️⃣ Configurar SSL con ACM

```bash
# Via AWS Console:
# 1. Ve a Certificate Manager
# 2. Request certificate
# 3. Request a public certificate
# 4. Domain names:
#    - tudominio.com
#    - *.tudominio.com
# 5. Validation: DNS validation
# 6. Agregar registros CNAME a tu DNS
```

## 5️⃣ Configurar Route 53 (DNS)

```bash
# Crear Hosted Zone
aws route53 create-hosted-zone --name tudominio.com --caller-reference $(date +%s)

# Crear registro para frontend (CloudFront)
# Type: A - Alias
# Alias Target: CloudFront distribution

# Crear registro para API (EC2/ALB)
# Type: A
# Value: IP elástica de EC2 o ALB DNS
```

## 6️⃣ Application Load Balancer (Opcional - Alta Disponibilidad)

```bash
# Via AWS Console:
# 1. EC2 → Load Balancers → Create
# 2. Application Load Balancer
# 3. Scheme: Internet-facing
# 4. Listeners: HTTP (80) y HTTPS (443)
# 5. Availability Zones: Selecciona 2+
# 6. Security Group: Permitir 80, 443
# 7. Target Group: EC2 instances en puerto 3001
# 8. Health check: /health
```

## 7️⃣ Migrar Base de Datos

```bash
# Desde tu máquina local, ejecuta las migraciones
# Actualiza .env con la URL de RDS

cd backend
npm run migrate
```

## 8️⃣ Variables de Entorno en Frontend

Actualiza el build con las URLs de producción:

```bash
# frontend/.env.production
VITE_API_URL=https://api.tudominio.com
```

Rebuild y redeploy:

```bash
cd frontend
npm run build
aws s3 sync dist/ s3://corporate-pitch-frontend --delete
aws cloudfront create-invalidation --distribution-id EXXXXX --paths "/*"
```

## 🔒 Seguridad

### Security Groups

```bash
# Backend EC2
Inbound:
- SSH (22) desde tu IP
- HTTP (80) desde ALB
- HTTPS (443) desde ALB

# RDS
Inbound:
- PostgreSQL (5432) desde Backend SG
```

### IAM Roles

```bash
# EC2 Role para acceder a S3, Secrets Manager
# CloudFront para acceder a S3
```

## 📊 Monitoreo

### CloudWatch

```bash
# Configurar alarmas para:
- CPU utilization > 80%
- Disk space < 20%
- Database connections
- 5xx errors
```

## 💰 Estimación de Costos (us-east-1)

- EC2 t2.micro: ~$8.50/mes
- RDS db.t3.micro: ~$15/mes
- S3: ~$0.50/mes (1GB)
- CloudFront: ~$1/mes (10GB)
- Route 53: ~$0.50/mes
- **Total estimado**: ~$26/mes

## 🚀 CI/CD con GitHub Actions

```yaml
# .github/workflows/deploy-aws.yml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy Backend to EC2
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ec2-user
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd ~/corporate-pitch-app
            git pull
            cd backend
            npm install
            npm run build
            pm2 restart corporate-pitch-api
      
      - name: Deploy Frontend to S3
        run: |
          cd frontend
          npm install
          npm run build
          aws s3 sync dist/ s3://corporate-pitch-frontend --delete
          aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_ID }} --paths "/*"
```

## ✅ Checklist de Despliegue

- [ ] RDS PostgreSQL configurado
- [ ] EC2 instancia corriendo
- [ ] Backend desplegado con PM2
- [ ] Nginx configurado
- [ ] Frontend en S3
- [ ] CloudFront configurado
- [ ] SSL configurado (ACM)
- [ ] DNS configurado (Route 53)
- [ ] Variables de entorno configuradas
- [ ] Migraciones ejecutadas
- [ ] Google OAuth actualizado con URLs de producción
- [ ] Monitoreo configurado
- [ ] Backups automatizados

---

**¡Tu aplicación está lista en AWS! 🎉**

