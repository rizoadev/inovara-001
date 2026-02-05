# EventHub

> **Event Registration & Management Platform**

Platform registrasi event online dengan pembayaran otomatis, QR Code tiket digital, dan check-in di venue.

---

## Features

### Peserta
- Browse & register event
- Online payment (Midtrans/Xendit)
- QR Code tiket via email
- Login dashboard
- Upload file presentasi (PPT/PDF)

### Admin
- Manage events & tickets
- QR Scanner untuk check-in (PWA)
- Manage users & files
- Reports & export

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Nuxt 4 + Nuxt UI (PWA) |
| Backend | FastAPI |
| Database | PostgreSQL |
| Payment | Midtrans / Xendit |
| Infra | VPS Biznet |

---

## Documentation

| Document | Description |
|----------|-------------|
| [Whitepaper](./docs/whitepaper.md) | Vision, features, business model |
| [Architecture](./docs/architecture.md) | System design, database schema |
| [API Spec](./docs/api-spec.md) | All endpoints |
| [Flowcharts](./docs/flowcharts.md) | User journeys |
| [Dashboard Plan](./docs/dashboard-plan.md) | UI wireframes |
| [Algorithms](./docs/algorithms.md) | Core logic |
| [Business Process](./docs/business-process.md) | Operations |
| [Dev Process](./docs/dev-process.md) | Development guide |

---

## Quick Start

```bash
# Backend
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

---

## Project Structure

```
eventhub/
├── docs/           # Documentation
├── backend/        # FastAPI
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── schemas/
│   │   └── services/
│   └── alembic/
├── frontend/       # Nuxt 4
│   ├── pages/
│   ├── components/
│   └── stores/
└── docker-compose.yml
```

---

## License

MIT
