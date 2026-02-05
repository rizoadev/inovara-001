# Flowcharts

## 1. Registration & Payment Flow

```mermaid
flowchart TD
    A[User visits website] --> B[Browse events]
    B --> C[Select event]
    C --> D[Choose ticket type]
    D --> E[Fill registration form]
    E --> F[Submit & Create Order]
    F --> G[Redirect to Payment Gateway]
    G --> H{Payment Status}
    
    H -->|Success| I[Webhook received]
    I --> J[Update status to PAID]
    J --> K[Generate QR Code]
    K --> L[Generate random password]
    L --> M[Send Email]
    M --> N[Email contains: QR + Password + Event Details]
    
    H -->|Pending| O[Show waiting page]
    O --> P{User completes payment?}
    P -->|Yes| I
    P -->|Expired| Q[Mark as EXPIRED]
    
    H -->|Failed| R[Show error]
    R --> G
```

---

## 2. Check-in Flow (Admin Scan)

```mermaid
flowchart TD
    A[Admin opens PWA] --> B[Select event]
    B --> C[Open QR Scanner]
    C --> D[Point camera at QR]
    D --> E[Decode QR]
    E --> F{QR Valid?}
    
    F -->|Invalid| G[Show: Invalid QR]
    G --> C
    
    F -->|Valid| H[Fetch registration]
    H --> I{Payment status?}
    
    I -->|Not paid| J[Show: Not Paid]
    J --> C
    
    I -->|Paid| K{Already checked in?}
    
    K -->|Yes| L[Show: Already checked in at TIME]
    L --> C
    
    K -->|No| M[Record check-in]
    M --> N[Show: SUCCESS]
    N --> O[Display participant info]
    O --> C
```

---

## 3. User File Upload Flow

```mermaid
flowchart TD
    A[User receives email] --> B[Get password from email]
    B --> C[Login to dashboard]
    C --> D[View my registrations]
    D --> E[Select registration]
    E --> F[Go to Files section]
    F --> G[Click Upload]
    G --> H[Select file PPT/PDF]
    H --> I{File valid?}
    
    I -->|No - wrong type| J[Show error: only PPT/PDF]
    J --> G
    
    I -->|No - too large| K[Show error: max 10MB]
    K --> G
    
    I -->|Yes| L[Upload file]
    L --> M[Save to storage]
    M --> N[Create file record]
    N --> O[Show success]
    O --> P[File appears in list]
```

---

## 4. Admin File Management Flow

```mermaid
flowchart TD
    A[Admin opens dashboard] --> B[Go to Files]
    B --> C[Filter by event]
    C --> D[View file list]
    D --> E{Action?}
    
    E -->|View| F[Preview/Download file]
    F --> D
    
    E -->|Delete| G[Confirm delete]
    G --> H{Confirmed?}
    H -->|Yes| I[Delete file]
    I --> D
    H -->|No| D
    
    E -->|Upload material| J[Select file]
    J --> K[Mark as "material"]
    K --> L[Upload]
    L --> D
```

---

## 5. Payment Webhook Flow

```mermaid
flowchart TD
    A[Payment Gateway] -->|POST /webhook| B[API receives webhook]
    B --> C[Verify signature]
    C --> D{Signature valid?}
    
    D -->|No| E[Log invalid webhook]
    E --> F[Return 400]
    
    D -->|Yes| G[Parse transaction status]
    G --> H{Status?}
    
    H -->|settlement/capture| I[Find registration by order_id]
    I --> J[Update status to PAID]
    J --> K[Generate QR code]
    K --> L[Generate password]
    L --> M[Send confirmation email]
    M --> N[Return 200 OK]
    
    H -->|expire| O[Update status to EXPIRED]
    O --> N
    
    H -->|deny/cancel| P[Update status to CANCELLED]
    P --> N
```

---

## 6. Email Generation Flow

```mermaid
flowchart TD
    A[Payment confirmed] --> B[Load email template]
    B --> C[Generate QR code image]
    C --> D[Generate random password]
    D --> E[Hash password & save to DB]
    E --> F[Build email content]
    F --> G[Include: QR image, password, event details]
    G --> H[Send via SMTP]
    H --> I{Send success?}
    
    I -->|Yes| J[Log email sent]
    I -->|No| K[Retry 3x]
    K --> L{Retry success?}
    L -->|Yes| J
    L -->|No| M[Log failed, alert admin]
```

---

## 7. State Diagrams

### Registration Status

```mermaid
stateDiagram-v2
    [*] --> PENDING: Create registration
    PENDING --> PAID: Payment success
    PENDING --> EXPIRED: Payment timeout
    PENDING --> CANCELLED: User cancel
    PAID --> CHECKED_IN: QR scanned
    EXPIRED --> [*]
    CANCELLED --> [*]
    CHECKED_IN --> [*]
```

### File Status

```mermaid
stateDiagram-v2
    [*] --> UPLOADING: Start upload
    UPLOADING --> UPLOADED: Success
    UPLOADING --> FAILED: Error
    UPLOADED --> DELETED: Admin delete
    FAILED --> [*]
    DELETED --> [*]
    UPLOADED --> [*]
```
