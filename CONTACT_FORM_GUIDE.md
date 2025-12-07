# 📧 Dynamic Contact Form Guide

**Contact form ko MongoDB se connect kiya gaya hai aur email setup add ki gai hai.**

---

## ✨ Kya kaam hota hai?

1. **Form submit karte ho** → Data MongoDB `contacts` collection me save hota hai
2. **Admin ko email** → Notification email jaata hai notification email ko
3. **User ko email** → Confirmation email bhejta hai user ke email pe

---

## 🔧 Setup Steps

### Step 1: Environment Variables Set Karo (`.env.local`)

```bash
# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_app_specific_password
CONTACT_EMAIL_RECIPIENT=r.k.prajapati0307@gmail.com

# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string

# Backend URL
BACKEND_URL=http://localhost:5000
```

### Step 2: Gmail Setup (अगर Gmail use कर रहे हो)

**Generate App-Specific Password:**

1. Go to: https://myaccount.google.com/
2. Search "App passwords" in the search bar
3. Select "Mail" and "Windows Computer"
4. Copy the 16-character password
5. Paste it in `SMTP_PASS` in `.env.local`

### Step 3: Backend Server चलाओ

```bash
cd backend
npm install
npm start
```

Backend localhost:5000 पर चलेगा

### Step 4: Frontend Dev Server Start करो

```bash
# दूसरे terminal में
npm run dev
```

---

## 📨 Email Configuration Options

### Gmail (Recommended)
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_char_app_password
```

### Outlook/Hotmail
```
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=your_email@outlook.com
SMTP_PASS=your_password
```

### Custom SMTP Server
```
SMTP_HOST=your_smtp_host
SMTP_PORT=your_port (usually 587 or 465)
SMTP_USER=your_username
SMTP_PASS=your_password
```

---

## 🎯 API Endpoint: `/api/contact`

### Request
```json
{
  "name": "राज प्रजापति",
  "email": "raj@example.com",
  "mobile": "+91 8082068480",
  "message": "यह एक test message है"
}
```

### Response (Success)
```json
{
  "message": "Message received! We will contact you soon. Check your email for confirmation.",
  "success": true
}
```

### Response (Error)
```json
{
  "error": "Provide a valid email or mobile number"
}
```

---

## 📊 Database Schema (MongoDB)

```javascript
// Collection: contacts
{
  _id: ObjectId,
  name: String,           // Required
  email: String,          // Optional (but email OR mobile required)
  mobile: String,         // Optional (but email OR mobile required)
  message: String,        // Required
  createdAt: Date         // Automatically set
}
```

---

## 🧪 Testing

### Test Frontend Form
```bash
1. Go to: http://localhost:3000/contact
2. Fill the form:
   - Name: राज प्रजापति
   - Email: your_email@gmail.com
   - Mobile: +91 8082068480
   - Message: Testing contact form submission
3. Click "Send Message"
```

### Check MongoDB
```bash
# Backend terminal में यह check करो:
# MongoDB Atlas -> Database -> portfolioDB -> contacts collection
# या backend admin panel में देखो
```

### Check Email
1. Admin email को check करो (notification)
2. User email को check करो (confirmation)

---

## 💡 Features

### ✅ Automatic Features
- ✓ Form validation (name, message required)
- ✓ Email validation
- ✓ Mobile validation (7-15 digits)
- ✓ Database auto-save
- ✓ Email notifications (admin + user)
- ✓ Formatted email templates (HTML)
- ✓ Auto-timestamp (createdAt)
- ✓ Error handling
- ✓ Fallback support (if SMTP fails, still saves to DB)

### 🎨 Email Templates
- **Admin Email**: पूरा submission details with timestamp
- **User Email**: Confirmation message with their message quote

---

## 🔒 Security

### Form Validation
- Name: 2+ characters required
- Email: Valid email format or mobile
- Mobile: 7-15 digits
- Message: 10+ characters required

### Rate Limiting (Optional)
अगर spam रोकना है तो add करो:

```typescript
// app/api/contact/route.ts में add करो
import { Ratelimit } from "@upstash/ratelimit";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 h"),
});

// POST function में:
const { success } = await ratelimit.limit(req.ip);
if (!success) {
  return new Response(JSON.stringify({ error: "Too many requests" }), {
    status: 429,
  });
}
```

---

## 🐛 Troubleshooting

### Email नहीं भेज रहे?

**Check करो:**
1. ✓ SMTP credentials सही हैं?
2. ✓ Gmail में "Less secure app access" enabled है? (पुराने accounts के लिए)
3. ✓ Browser console में error तो नहीं?
4. ✓ Backend सही तरीके से चल रहा है?

**Solution:**
- `SMTP_PASS` सही password है (app-specific password, not regular)
- Port 587 use करो (TLS) या 465 (SSL)

### MongoDB save नहीं हो रहा?

**Check करो:**
1. ✓ Backend server चल रहा है?
2. ✓ MongoDB connection string सही है?
3. ✓ Network access enabled है (IP whitelist)?

### Form submit करने पर कुछ नहीं होता?

**Check करो:**
1. ✓ `/api/contact` endpoint accessible है?
2. ✓ Network tab में request success है?
3. ✓ Server logs में कोई error?

---

## 📝 Example Usage

### Full Form Submission Flow

```typescript
// 1. User fills form on /contact page
const form = {
  name: "राज प्रजापति",
  email: "raj@gmail.com",
  mobile: "+91 8082068480",
  message: "मुझे website बनवानी है"
};

// 2. Frontend sends to API
fetch("/api/contact", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(form),
});

// 3. Backend validates
// ✓ Name: "राज प्रजापति" (2+ chars)
// ✓ Message: "मुझे website बनवानी है" (10+ chars)
// ✓ Email: valid format
// ✓ Mobile: +91 8082068480 (10 digits)

// 4. Saves to MongoDB
// contacts collection में एक नया document add होता है

// 5. Sends Emails
// Admin: r.k.prajapati0307@gmail.com ← notification
// User: raj@gmail.com ← confirmation

// 6. Returns Success
{
  "message": "Message received! Check your email...",
  "success": true
}
```

---

## 🚀 Advanced Customization

### Add Subject Field
```typescript
// Update form state
const [form, setForm] = useState({
  name: "",
  email: "",
  mobile: "",
  subject: "",  // नया field
  message: ""
});

// Update API to save subject
// Update MongoDB schema: subject: String
```

### Add File Upload
```typescript
// FormData use करो instead of JSON
const formData = new FormData();
formData.append("name", form.name);
formData.append("file", fileInput.files[0]);

fetch("/api/contact", {
  method: "POST",
  body: formData, // No Content-Type header!
});
```

### Add Category/Type Field
```typescript
// Project inquiry, bug report, partnership, etc.
const [category, setCategory] = useState("general");

// Email template में category show करो
```

---

## 📞 Support

कोई issue हो तो:
1. Backend logs check करो
2. Browser console check करो
3. MongoDB में data saved है या नहीं check करो
4. SMTP credentials फिर से verify करो

---

**Happy Coding! 🎉**
