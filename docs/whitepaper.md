# EventHub - Whitepaper

> **Platform Registrasi Event & Manajemen Peserta**

---

## Executive Summary

EventHub adalah platform registrasi event online yang memungkinkan peserta mendaftar, bayar, dan mendapatkan QR Code tiket digital. Admin dapat melakukan scan QR untuk validasi masuk venue, serta mengelola peserta dan file materi.

---

## 1. Problem Statement

### Tantangan Saat Ini

| Masalah | Dampak |
|---------|--------|
| Registrasi via WA/Form manual | Data tidak terstruktur, error-prone |
| Cek transfer manual | Lambat, sering terlewat |
| Check-in dengan daftar hadir | Antrian panjang, tidak akurat |
| Materi via email/WA | File tercecer, sulit tracking |
| Laporan manual | Rekap memakan waktu |

---

## 2. Solution Overview

```
┌─────────────────────────────────────────────────────────┐
│                    EventHub Platform                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   PESERTA FLOW:                                         │
│   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌────────┐  │
│   │ Website │ → │Register │ → │ Payment │ → │ Email  │  │
│   │ Browse  │   │ & Pay   │   │Midtrans/│   │QR Code │  │
│   │ Event   │   │         │   │ Xendit  │   │+ Pass  │  │
│   └─────────┘   └─────────┘   └─────────┘   └────┬───┘  │
│                                                  │      │
│   ┌──────────────────────────────────────────────▼───┐  │
│   │                  AT VENUE                        │  │
│   │  ┌──────────┐      ┌───────────┐                 │  │
│   │  │ Admin    │ scan │  Peserta  │                 │  │
│   │  │ (PWA)    │ ───→ │  QR Code  │ → VALIDATED     │  │
│   │  └──────────┘      └───────────┘                 │  │
│   └──────────────────────────────────────────────────┘  │
│                                                         │
│   POST-EVENT / USER DASHBOARD:                          │
│   ┌─────────────────────────────────────────────────┐   │
│   │  User login (password dari email)               │   │
│   │  → Upload file presentasi (PPT, PDF)            │   │
│   │  → View event materials                         │   │
│   └─────────────────────────────────────────────────┘   │
│                                                         │
│   ADMIN DASHBOARD (PWA):                                │
│   ┌─────────────────────────────────────────────────┐   │
│   │  • Scan QR untuk validasi masuk venue           │   │
│   │  • Manage users (peserta)                       │   │
│   │  • Manage files (materi, upload dari peserta)   │   │
│   │  • View reports                                 │   │
│   └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Core Features

### 3.1 Peserta Features

| Feature | Description |
|---------|-------------|
| **Browse Event** | Lihat event yang tersedia |
| **Register & Pay** | Pilih tiket, isi data, bayar online |
| **Email Confirmation** | Terima QR Code + password login |
| **Login to Dashboard** | Akses dengan email + password |
| **Upload Files** | Upload file presentasi (PPT, PDF) |
| **View Materials** | Akses materi dari admin/peserta lain |

### 3.2 Admin Features (PWA Dashboard)

| Feature | Description |
|---------|-------------|
| **Scan QR** | Validasi peserta masuk venue (camera scan) |
| **Manage Event** | CRUD event, tiket, pricing |
| **Manage Users** | Lihat daftar peserta, status, data |
| **Manage Files** | View/download file dari peserta, upload materi |
| **Reports** | Laporan peserta, attendance, transaksi |

---

## 4. User Flows

### 4.1 Peserta Registration Flow

```
1. Buka website
      ↓
2. Pilih event → Pilih kategori tiket
      ↓
3. Isi data pendaftaran (nama, email, phone, dll)
      ↓
4. Checkout → Pilih metode pembayaran
      ↓
5. Redirect ke Midtrans/Xendit
      ↓
6. Bayar sesuai metode (VA, QRIS, CC, dll)
      ↓
7. Payment success → Webhook update status
      ↓
8. Email terkirim:
   - QR Code tiket digital
   - Password untuk login
   - Detail event
      ↓
9. [Di venue] Tunjukkan QR ke admin untuk scan
      ↓
10. [Setelah event] Login → Upload file presentasi
```

### 4.2 Admin Check-in Flow

```
1. Buka Admin Dashboard (PWA) di HP/Tablet
      ↓
2. Pilih event → Masuk mode scan
      ↓
3. Arahkan kamera ke QR peserta
      ↓
4. Sistem validasi:
   - QR valid?
   - Sudah pernah check-in?
   - Status pembayaran?
      ↓
5. Tampilkan hasil:
   ✓ VALID → Nama peserta, kategori tiket
   ✗ INVALID → Alasan (sudah masuk, belum bayar, dll)
      ↓
6. Record check-in timestamp
```

---

## 5. Technical Stack

| Layer | Technology |
|-------|------------|
| Frontend | **Nuxt 4 + Nuxt UI** (PWA enabled) |
| Backend | **FastAPI** (Python) |
| Database | **PostgreSQL** |
| Auth | **JWT** (access + refresh tokens) |
| Payment | **Midtrans / Xendit** |
| QR | Generate (qrcode lib) + Scan (camera API) |
| Email | SMTP transactional |
| File Storage | Local / S3-compatible |
| Infrastructure | VPS Biznet |

---

## 6. User Roles

| Role | Capabilities |
|------|--------------|
| **Admin** | Full access: events, users, files, scan, reports |
| **Peserta** | Register, pay, view QR, login, upload files |

---

## 7. PWA Requirements

Admin dashboard harus PWA untuk:

| Requirement | Reason |
|-------------|--------|
| **Offline capable** | Scan tetap bisa jalan walau internet flaky |
| **Camera access** | Untuk scan QR code |
| **Installable** | Bisa di-install di HP sebagai app |
| **Responsive** | Bisa dipakai di HP, tablet, laptop |

---

## 8. MVP Scope

### Phase 1: Core Registration (Week 1-4)
- [ ] Landing page + event listing
- [ ] Registration form
- [ ] Payment integration (Midtrans/Xendit)
- [ ] Email with QR Code + password
- [ ] User login

### Phase 2: Check-in & Files (Week 5-8)
- [ ] Admin dashboard (PWA)
- [ ] QR scanner for check-in
- [ ] User file upload (PPT, PDF)
- [ ] Admin file management
- [ ] Basic reports

### Phase 3: Enhancement (Week 9+)
- [ ] Multiple events
- [ ] Advanced reporting
- [ ] Email notifications
- [ ] Export data

---

## 9. Business Model

| Revenue | Description |
|---------|-------------|
| **Platform fee** | X% per transaksi sukses |
| **Subscription** | Monthly fee untuk organizer |

---

## 10. Success Metrics

| Metric | Target |
|--------|--------|
| Events | 20+ events/tahun |
| Registrations | 5,000+ peserta |
| Check-in rate | 90%+ menggunakan QR scan |
