# Mock Data Documentation

## Overview
Mock data untuk EventHub platform. Data ini digunakan untuk development dan testing.

## Files

### events.json
Berisi 8 events dengan berbagai kategori:
- Tech Conference 2024
- Workshop AI & Machine Learning
- Startup Summit 2024
- Digital Marketing Masterclass
- Blockchain & Web3 Summit
- UX/UI Design Workshop
- Cloud Computing Conference
- Mobile App Development Bootcamp

**Total Events:** 8
**Total Tickets:** 13 ticket types

### users.json
Berisi 11 users:
- 2 Admin accounts
- 9 Regular users

**Login Credentials:**
- Admin: `admin@eventhub.id` / `admin123`
- Admin 2: `admin2@eventhub.id` / `admin456`
- User: `john@example.com` / `pass123`
- User: `jane@example.com` / `pass456`
- (dan seterusnya dengan pattern `pass` + angka)

### registrations.json
Berisi 20 registrations dengan berbagai status:
- **Paid:** 17 registrations
- **Pending:** 2 registrations
- **Cancelled:** 1 registration

**Total Revenue:** Rp 17,950,000

### files.json
Berisi 8 uploaded files:
- PDF presentations
- PowerPoint slides
- Video files

**Total Files:** 8
**Total Size:** ~27 MB

### checkins.json
Berisi 4 check-in records untuk event Tech Conference 2024

## Data Relationships

```
users (11)
  └─> registrations (20)
       ├─> events (8)
       │    └─> tickets (13)
       ├─> files (8)
       └─> checkins (4)
```

## Statistics

### Events
- Total Events: 8
- Active Events: 8
- Total Ticket Types: 13
- Total Quota: 810 seats
- Total Sold: 430 tickets
- Available: 380 seats

### Users
- Total Users: 11
- Admins: 2
- Regular Users: 9

### Registrations
- Total: 20
- Paid: 17 (85%)
- Pending: 2 (10%)
- Cancelled: 1 (5%)
- Total Revenue: Rp 17,950,000

### Check-ins
- Total Check-ins: 4
- Check-in Rate: 23.5% (4 out of 17 paid)

### Files
- Total Files: 8
- PDF: 6 files
- PPTX: 2 files
- Video: 1 file (not counted in registrations.json)

## Usage

### Import in API Routes
```typescript
import events from '~/mock-data/events.json'
import users from '~/mock-data/users.json'
import registrations from '~/mock-data/registrations.json'
import files from '~/mock-data/files.json'
import checkins from '~/mock-data/checkins.json'
```

### Example Queries

**Get all paid registrations:**
```typescript
const paidRegs = registrations.filter(r => r.status === 'paid')
```

**Get user's registrations:**
```typescript
const userRegs = registrations.filter(r => r.user_id === 'usr-002')
```

**Get event registrations:**
```typescript
const eventRegs = registrations.filter(r => r.event_id === 'evt-001')
```

**Calculate event revenue:**
```typescript
const revenue = registrations
  .filter(r => r.event_id === 'evt-001' && r.status === 'paid')
  .reduce((sum, r) => sum + r.amount, 0)
```

## Data Generation Rules

### IDs
- Events: `evt-001` to `evt-008`
- Users: `usr-001` to `usr-011`
- Tickets: `tkt-001` to `tkt-013`
- Registrations: `reg-001` to `reg-020`
- Files: `file-001` to `file-008`
- Check-ins: `chk-001` to `chk-004`

### Dates
- Events: 2024-06-15 to 2025-01-15
- User creation: 2024-01-01 to 2024-02-07
- Registrations: 2024-01-15 to 2024-02-17

### Prices
- Range: Rp 300,000 - Rp 2,500,000
- Average: ~Rp 900,000

### Status Distribution
- Paid: 85%
- Pending: 10%
- Cancelled: 5%

## Notes

1. All passwords are plain text for development only
2. File sizes are in bytes
3. Dates are in ISO 8601 format
4. Phone numbers use Indonesian format (08xxx)
5. QR codes follow pattern: `EVTHUB-{event_id}-{registration_id}`
