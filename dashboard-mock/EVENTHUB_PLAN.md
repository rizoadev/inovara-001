# EventHub Dashboard Implementation Plan

## Project Overview
EventHub adalah platform registrasi event dengan fitur:
- Registrasi event online
- Payment gateway (Midtrans/Xendit)
- QR Code tiket digital
- Check-in via QR Scanner (PWA)
- Upload file presentasi
- Admin dashboard

## Tech Stack
- Frontend: Nuxt 4 + Nuxt UI (PWA)
- Mock API: JSON files + composables
- State: Pinia stores
- QR: qrcode library
- Camera: Browser MediaDevices API

## Implementation Phases

### Phase 1: Core Structure & Mock API ✓
1. Setup composables untuk mock API
2. Create mock data (events, users, registrations)
3. Setup Pinia stores (auth, events)

### Phase 2: Public Pages
1. Landing page (/)
2. Events listing (/events)
3. Event detail + registration (/events/[slug])
4. Checkout page (/checkout)
5. Payment pages (/payment/pending, /payment/success)

### Phase 3: User Dashboard
1. Login page (/auth/login)
2. My registrations (/dashboard)
3. Registration detail with QR
4. File upload (/dashboard/files)

### Phase 4: Admin Dashboard (PWA)
1. Overview (/admin)
2. Events management (/admin/events)
3. QR Scanner (/admin/scan)
4. Users list (/admin/users)
5. Files management (/admin/files)
6. Reports (/admin/reports)

### Phase 5: PWA Features
1. Service worker
2. Manifest.json
3. Offline support
4. Camera access for QR scanning

## File Structure

```
dashboard-mock/
├── composables/
│   ├── useAuth.ts          # Auth logic
│   ├── useMockApi.ts       # Mock API calls
│   ├── useQRCode.ts        # QR generation
│   └── useQRScanner.ts     # QR scanning
├── stores/
│   ├── auth.ts             # Auth state
│   └── events.ts           # Events state
├── components/
│   ├── EventCard.vue       # Event display
│   ├── QRDisplay.vue       # Show QR code
│   ├── QRScanner.vue       # Camera scanner
│   ├── FileUpload.vue      # File upload
│   └── AdminNav.vue        # Admin navigation
├── pages/
│   ├── index.vue           # Landing
│   ├── events/
│   │   ├── index.vue       # List
│   │   └── [slug].vue      # Detail + register
│   ├── checkout.vue        # Checkout
│   ├── payment/
│   │   ├── pending.vue     # Waiting
│   │   └── success.vue     # Success
│   ├── auth/
│   │   └── login.vue       # Login
│   ├── dashboard/
│   │   ├── index.vue       # My registrations
│   │   └── files.vue       # Upload files
│   └── admin/
│       ├── index.vue       # Overview
│       ├── events/
│       │   ├── index.vue   # List
│       │   └── [id].vue    # Detail
│       ├── scan.vue        # QR Scanner
│       ├── users.vue       # Users
│       ├── files.vue       # Files
│       └── reports.vue     # Reports
├── layouts/
│   ├── default.vue         # Public layout
│   ├── dashboard.vue       # User dashboard
│   └── admin.vue           # Admin layout
├── public/
│   ├── manifest.json       # PWA manifest
│   └── sw.js               # Service worker
└── mock-data/
    ├── events.json         # Mock events
    ├── users.json          # Mock users
    └── registrations.json  # Mock registrations
```

## Mock Data Structure

### Events
```json
{
  "id": "uuid",
  "title": "Tech Conference 2024",
  "slug": "tech-conf-2024",
  "description": "...",
  "event_date": "2024-06-15T09:00:00",
  "location": "Jakarta Convention Center",
  "image": "/images/event1.jpg",
  "is_active": true,
  "tickets": [
    {
      "id": "uuid",
      "name": "Regular",
      "price": 500000,
      "quota": 100,
      "sold": 45
    }
  ]
}
```

### Users
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "phone": "08123456789",
  "role": "user"
}
```

### Registrations
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "event_id": "uuid",
  "ticket_id": "uuid",
  "qr_code": "EVTHUB-xxx-xxx",
  "status": "paid",
  "amount": 500000,
  "paid_at": "2024-01-01T10:00:00",
  "checked_in_at": null,
  "files": []
}
```

## Key Features Implementation

### 1. QR Code Generation
- Use `qrcode` library
- Format: `EVTHUB-{event_id}-{registration_id}`
- Include signature for validation

### 2. QR Scanner
- Use browser MediaDevices API
- Decode using `jsqr` library
- Validate format and signature
- Check payment status
- Prevent double check-in

### 3. File Upload
- Accept PPT, PPTX, PDF
- Max 10MB
- Store in localStorage (mock)
- Show preview/download

### 4. Payment Flow (Mock)
- Redirect to mock payment page
- Simulate webhook callback
- Update status to "paid"
- Generate QR code
- Send mock email

### 5. PWA Features
- Installable on mobile
- Offline event list
- Camera access
- Push notifications (optional)

## Design System
- Dark theme (#0a0a0a background)
- Green accent (#22c55e)
- Sharp corners (no border-radius)
- Monospace fonts for data
- Minimal, clean UI

## Next Steps
1. ✓ Create plan
2. Setup mock data & API
3. Build layouts
4. Implement public pages
5. Implement user dashboard
6. Implement admin dashboard
7. Add PWA features
8. Testing & polish
