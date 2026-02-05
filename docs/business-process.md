# Business Process

## 1. Event Lifecycle

```mermaid
flowchart LR
    A[Create Event] --> B[Configure Tickets]
    B --> C[Publish]
    C --> D[Accept Registrations]
    D --> E[Event Day]
    E --> F[Check-in via QR]
    F --> G[Collect Files]
    G --> H[Generate Reports]
    H --> I[Archive]
```

---

## 2. Registration Process

### Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Website    │ →  │  Register   │ →  │   Payment   │
│  Browse     │    │  Fill Form  │    │   Gateway   │
└─────────────┘    └─────────────┘    └─────────────┘
                                            │
                                            ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Dashboard  │ ←  │   Email     │ ←  │  Generate   │
│   Access    │    │  QR + Pass  │    │  QR Code    │
└─────────────┘    └─────────────┘    └─────────────┘
```

### States
| Status | Description |
|--------|-------------|
| PENDING | Waiting payment |
| PAID | Payment confirmed |
| CANCELLED | User cancelled |
| EXPIRED | Payment timeout |
| CHECKED_IN | Attended event |

---

## 3. Payment Process

### Midtrans Integration
1. Create order → Get payment URL
2. Redirect user to Midtrans
3. User completes payment
4. Webhook received → Update status

### Xendit Integration
1. Create invoice → Get payment URL
2. Redirect user to Xendit
3. User completes payment
4. Webhook received → Update status

---

## 4. Check-in Process

### On-site Flow
1. Admin opens PWA on phone/tablet
2. Selects active event
3. Points camera to peserta's QR
4. System validates:
   - QR signature valid?
   - Payment confirmed?
   - Not already checked in?
5. Records check-in timestamp
6. Shows success/failure

---

## 5. File Management Process

### User Upload
1. User logs in (password from email)
2. Selects registration
3. Uploads file (PPT/PDF, max 10MB)
4. File stored with metadata

### Admin Access
1. Admin views files by event/user
2. Can download all files
3. Can delete inappropriate files

---

## 6. Reporting Process

### Available Reports
| Report | Data |
|--------|------|
| Registration | All registrations + status |
| Revenue | Total revenue, by ticket type |
| Attendance | Check-in count, time |
| Files | All uploaded files |

### Export Formats
- Excel (.xlsx)
- CSV
- PDF (summary)
