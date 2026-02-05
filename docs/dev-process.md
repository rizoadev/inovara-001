# Development Process

## 1. Tech Stack Setup

### Backend (FastAPI)
```bash
# Setup
python -m venv venv
source venv/bin/activate
pip install fastapi uvicorn sqlalchemy alembic psycopg2-binary pydantic python-jose passlib qrcode pillow python-multipart

# Run
uvicorn app.main:app --reload
```

### Frontend (Nuxt 4)
```bash
# Setup
npx nuxi@latest init frontend
cd frontend
npm install @nuxt/ui @pinia/nuxt @vite-pwa/nuxt

# Run
npm run dev
```

---

## 2. Development Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Setup project structure
- [ ] Database schema & migrations
- [ ] Auth (JWT login)
- [ ] Basic API endpoints

### Phase 2: Core Features (Week 3-4)
- [ ] Event CRUD
- [ ] Registration flow
- [ ] Payment integration
- [ ] Email with QR

### Phase 3: Dashboard (Week 5-6)
- [ ] User dashboard
- [ ] Admin dashboard (PWA)
- [ ] QR scanner
- [ ] File upload

### Phase 4: Polish (Week 7-8)
- [ ] Reports
- [ ] Testing
- [ ] Bug fixes
- [ ] Deployment

---

## 3. Git Workflow

```
main        ─────●─────────────●─────────────● (production)
                 │             │             │
staging     ─────●───●─────────●───●─────────● (testing)
                     │             │
feature/*   ─────────●─────────────● (development)
```

### Branch Naming
- `feature/xxx` - new features
- `fix/xxx` - bug fixes
- `hotfix/xxx` - urgent production fixes

### Commit Message
```
feat: add QR scanner component
fix: payment webhook signature validation
docs: update API spec
```

---

## 4. Testing Strategy

| Type | Tool | Coverage |
|------|------|----------|
| Unit | pytest | Services, utils |
| Integration | pytest | API endpoints |
| E2E | Playwright | User flows |

### Key Test Cases
- [ ] Registration → Payment → Email
- [ ] QR validation (valid, invalid, duplicate)
- [ ] File upload (valid, invalid type, too large)
- [ ] Admin check-in flow

---

## 5. Deployment

### VPS Setup (Biznet)
```bash
# Install Docker
curl -fsSL https://get.docker.com | sh

# Clone repo
git clone <repo> /opt/eventhub

# Setup env
cp .env.example .env
nano .env

# Run
docker-compose up -d
```

### CI/CD (GitHub Actions)
```yaml
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to VPS
        run: |
          ssh user@vps 'cd /opt/eventhub && git pull && docker-compose up -d --build'
```

---

## 6. Monitoring

| Tool | Purpose |
|------|---------|
| Docker logs | Application logs |
| PostgreSQL | Database monitoring |
| Uptime Robot | Availability monitoring |

---

## 7. Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost/eventhub

# Auth
JWT_SECRET=xxx
JWT_EXPIRY=3600

# Payment
MIDTRANS_SERVER_KEY=xxx
MIDTRANS_CLIENT_KEY=xxx

# Email
SMTP_HOST=smtp.gmail.com
SMTP_USER=xxx
SMTP_PASS=xxx

# App
APP_URL=https://eventhub.id
API_URL=https://api.eventhub.id
```
