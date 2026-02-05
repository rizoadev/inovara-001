# API Specification

**Base URL:** `https://api.eventhub.id/v1`

---

## Authentication

### POST /auth/register
Register new user (during event registration).

```json
// Request
{
  "email": "user@example.com",
  "full_name": "John Doe",
  "phone": "08123456789"
}

// Response 201
{
  "id": "uuid",
  "email": "user@example.com",
  "password": "auto-generated",  // sent via email
  "tokens": { "access_token": "...", "refresh_token": "..." }
}
```

### POST /auth/login
```json
// Request
{ "email": "user@example.com", "password": "xxx" }

// Response 200
{
  "user": { "id": "uuid", "email": "...", "role": "user" },
  "tokens": { "access_token": "...", "refresh_token": "..." }
}
```

### POST /auth/refresh
```json
// Request
{ "refresh_token": "..." }

// Response 200
{ "access_token": "..." }
```

---

## Events

### GET /events
List public events.

```json
// Response 200
{
  "data": [
    {
      "id": "uuid",
      "title": "Tech Conference 2024",
      "slug": "tech-conf-2024",
      "event_date": "2024-06-15T09:00:00",
      "location": "Jakarta Convention Center",
      "tickets": [
        { "id": "uuid", "name": "Regular", "price": 500000, "available": 50 }
      ]
    }
  ]
}
```

### GET /events/:slug
Get event detail.

### POST /events (Admin)
Create event.

### PUT /events/:id (Admin)
Update event.

---

## Registrations

### POST /registrations
Create registration + initiate payment.

```json
// Request
{
  "event_id": "uuid",
  "ticket_id": "uuid",
  "participant": {
    "email": "user@example.com",
    "full_name": "John Doe",
    "phone": "08123456789"
  }
}

// Response 201
{
  "registration_id": "uuid",
  "amount": 500000,
  "payment": {
    "redirect_url": "https://payment.midtrans.com/...",
    "expires_at": "2024-01-01T01:00:00"
  }
}
```

### GET /registrations/me
Get user's registrations (requires auth).

### GET /registrations/:id
Get registration detail.

---

## Payments

### POST /payments/webhook/midtrans
Webhook from Midtrans.

```json
// Request (from Midtrans)
{
  "order_id": "REG-xxx",
  "transaction_status": "settlement",
  "gross_amount": "500000",
  "signature_key": "..."
}

// Response 200
{ "status": "ok" }
```

### POST /payments/webhook/xendit
Webhook from Xendit.

---

## Check-in

### POST /checkins/scan (Admin)
Validate QR and record check-in.

```json
// Request
{ "qr_code": "EVTHUB-xxx-xxx" }

// Response 200
{
  "valid": true,
  "registration": {
    "id": "uuid",
    "participant_name": "John Doe",
    "ticket_name": "Regular",
    "status": "paid"
  },
  "checked_in_at": "2024-01-01T09:30:00"
}

// Response 400 (already checked in)
{
  "valid": false,
  "reason": "already_checked_in",
  "checked_in_at": "2024-01-01T08:00:00"
}
```

### GET /checkins/event/:event_id (Admin)
Get all check-ins for event.

---

## Files

### POST /files/upload
Upload file (PPT, PDF). Requires auth.

```
Content-Type: multipart/form-data
- file: (binary)
- registration_id: uuid
```

```json
// Response 201
{
  "id": "uuid",
  "filename": "presentation.pdf",
  "filetype": "application/pdf",
  "filesize": 1024000,
  "url": "/files/uuid/download"
}
```

### GET /files
List files (filtered by event/user).

### GET /files/:id/download
Download file.

### DELETE /files/:id (Admin)
Delete file.

---

## Users (Admin)

### GET /users
List all users.

### GET /users/:id
Get user detail with registrations.

### PUT /users/:id
Update user.

---

## Reports (Admin)

### GET /reports/event/:event_id
```json
{
  "total_registrations": 150,
  "paid": 140,
  "pending": 10,
  "checked_in": 120,
  "revenue": 70000000,
  "by_ticket": [
    { "name": "Regular", "count": 100, "revenue": 50000000 },
    { "name": "VIP", "count": 50, "revenue": 20000000 }
  ]
}
```

---

## Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [{ "field": "email", "message": "Invalid format" }]
  }
}
```

| Code | HTTP | Description |
|------|------|-------------|
| AUTH_INVALID | 401 | Invalid credentials |
| AUTH_EXPIRED | 401 | Token expired |
| FORBIDDEN | 403 | Not authorized |
| NOT_FOUND | 404 | Resource not found |
| VALIDATION_ERROR | 400 | Invalid input |
| PAYMENT_FAILED | 422 | Payment error |
| QR_INVALID | 400 | Invalid QR code |
| ALREADY_CHECKED_IN | 400 | Already checked in |
