# Halaman yang Ditambahkan

## Admin Pages

### 1. `/admin/events/index.vue` ✅
- Daftar semua event
- Statistik per event (registrations)
- Tombol create event
- Navigasi ke detail event

### 2. `/admin/events/[id].vue` ✅
- Detail event lengkap
- Info tickets dan quota
- Statistik (total registrations, checked in, revenue)
- Daftar registrations untuk event tersebut
- Tombol edit event

### 3. `/admin/users.vue` ✅
- Daftar semua users
- Search dan filter by role
- Statistik users (total, admin, regular)
- Jumlah registrations per user
- Navigasi ke detail user

### 4. `/admin/users/[id].vue` ✅
- Detail user lengkap
- Statistik user (registrations, paid, total spent)
- Daftar registrations user tersebut

### 5. `/admin/files.vue` ✅
- Daftar semua uploaded files
- Info file (name, event, user, size, date)
- Download dan delete file

### 6. `/admin/reports.vue` ✅
- Pilih event untuk report
- Summary stats (registrations, checked in, revenue, files)
- Ticket sales breakdown
- Export CSV/PDF (placeholder)

## User Pages

### 7. `/dashboard/files.vue` ✅
- Pilih registration untuk upload file
- Upload file (PDF, PPT, PPTX)
- Daftar files yang sudah diupload
- Download dan delete file

### 8. `/checkout.vue` ✅
- Form participant information
- Order summary
- Proceed to payment

## Components

### 9. `components/AdminNav.vue` ✅
- Navigation bar untuk admin
- Links ke semua admin pages

### 10. `components/DashboardNav.vue` ✅
- Navigation bar untuk user dashboard
- Links ke tickets dan files

### 11. `components/EventCard.vue` ✅
- Card component untuk display event
- Reusable di berbagai halaman

### 12. `components/QRDisplay.vue` ✅
- Component untuk display QR code
- Loading state
- Error handling

## Halaman yang Sudah Ada (Tidak Diubah)

- `/admin/index.vue` - Admin overview
- `/admin/scan.vue` - QR Scanner
- `/dashboard/index.vue` - My registrations
- `/events/index.vue` - Events listing
- `/events/[slug].vue` - Event detail
- `/auth/login.vue` - Login page
- `/payment/pending.vue` - Payment pending
- `/payment/success.vue` - Payment success
- `/index.vue` - Landing page

## Layout yang Sudah Ada

- `layouts/admin.vue` - Admin layout dengan sidebar
- `layouts/dashboard.vue` - User dashboard layout
- `layouts/default.vue` - Public layout

## Fitur yang Sudah Diimplementasi

✅ Admin dapat melihat semua events
✅ Admin dapat melihat detail event dan registrations
✅ Admin dapat melihat semua users
✅ Admin dapat melihat detail user
✅ Admin dapat melihat semua files
✅ Admin dapat generate reports per event
✅ User dapat upload files untuk registrations
✅ User dapat manage files mereka
✅ Checkout flow untuk registrasi event
✅ Components reusable (EventCard, QRDisplay, Navigation)

## Catatan

Semua halaman menggunakan:
- Dark theme (#0a0a0a background)
- Green accent (#22c55e)
- Nuxt UI components
- Mock API dari composables
- Responsive design
- Loading states
- Error handling
