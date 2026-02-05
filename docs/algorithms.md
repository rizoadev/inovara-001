# Core Algorithms

## 1. QR Code Generation

```python
import qrcode, hashlib, hmac, json
from cryptography.fernet import Fernet

class QRGenerator:
    def __init__(self, secret: str):
        self.secret = secret.encode()
        self.cipher = Fernet(Fernet.generate_key())
    
    def generate(self, registration_id: str, event_id: str) -> str:
        """Generate signed QR code data"""
        payload = json.dumps({"rid": registration_id, "eid": event_id})
        encrypted = self.cipher.encrypt(payload.encode()).decode()
        sig = hmac.new(self.secret, encrypted.encode(), hashlib.sha256).hexdigest()[:8]
        return f"EVT-{encrypted}-{sig}"
    
    def validate(self, code: str) -> dict | None:
        """Validate and decode QR"""
        try:
            parts = code.split("-")
            if parts[0] != "EVT": return None
            expected = hmac.new(self.secret, parts[1].encode(), hashlib.sha256).hexdigest()[:8]
            if parts[2] != expected: return None
            return json.loads(self.cipher.decrypt(parts[1].encode()))
        except:
            return None
```

---

## 2. Password Generation

```python
import secrets
import string

def generate_password(length: int = 8) -> str:
    """Generate random password for email"""
    chars = string.ascii_letters + string.digits
    return ''.join(secrets.choice(chars) for _ in range(length))
```

---

## 3. Check-in Validation

```python
async def validate_checkin(db, qr_code: str, event_id: str):
    # Decode QR
    payload = qr_generator.validate(qr_code)
    if not payload:
        return {"valid": False, "reason": "invalid_qr"}
    
    if payload["eid"] != event_id:
        return {"valid": False, "reason": "wrong_event"}
    
    # Get registration
    reg = await db.fetch_one(
        "SELECT * FROM registrations WHERE id = :id",
        {"id": payload["rid"]}
    )
    
    if not reg:
        return {"valid": False, "reason": "not_found"}
    
    if reg["status"] != "paid":
        return {"valid": False, "reason": "not_paid"}
    
    # Check duplicate
    checkin = await db.fetch_one(
        "SELECT * FROM checkins WHERE registration_id = :id",
        {"id": payload["rid"]}
    )
    
    if checkin:
        return {"valid": False, "reason": "already_checked_in", "at": checkin["checked_in_at"]}
    
    # Record check-in
    await db.execute(
        "INSERT INTO checkins (registration_id, checked_in_at) VALUES (:id, NOW())",
        {"id": payload["rid"]}
    )
    
    return {"valid": True, "registration": dict(reg)}
```

---

## 4. Payment Webhook Verification

```python
import hashlib

def verify_midtrans_signature(order_id: str, status_code: str, gross_amount: str, server_key: str, signature: str) -> bool:
    """Verify Midtrans webhook signature"""
    raw = f"{order_id}{status_code}{gross_amount}{server_key}"
    expected = hashlib.sha512(raw.encode()).hexdigest()
    return signature == expected

def verify_xendit_signature(payload: bytes, signature: str, webhook_token: str) -> bool:
    """Verify Xendit webhook signature"""
    expected = hmac.new(webhook_token.encode(), payload, hashlib.sha256).hexdigest()
    return signature == expected
```

---

## 5. File Validation

```python
ALLOWED_TYPES = {"application/pdf", "application/vnd.ms-powerpoint", 
                 "application/vnd.openxmlformats-officedocument.presentationml.presentation"}
MAX_SIZE = 10 * 1024 * 1024  # 10MB

def validate_file(file) -> tuple[bool, str]:
    if file.content_type not in ALLOWED_TYPES:
        return False, "Only PDF and PPT files allowed"
    
    if file.size > MAX_SIZE:
        return False, "File too large (max 10MB)"
    
    return True, "OK"
```
