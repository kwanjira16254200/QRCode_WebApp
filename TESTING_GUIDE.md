# QR Code Testing Guide

## 🧪 How to Test Your QR Code App

### 1. **Testing URL Auto-Prefix**

When creating a new QR Code, try these inputs:

| Input | Expected Output |
|-------|----------------|
| `google.com` | `https://www.google.com` |
| `www.facebook.com` | `https://www.facebook.com` |
| `example.com` | `https://www.example.com` |
| `https://github.com` | `https://github.com` (unchanged) |

**Steps:**
1. Click "Create QR Code"
2. Enter QR Code Name: "Test"
3. Enter URL: `google.com`
4. Click "Create"
5. Check the created link - it should redirect to `https://www.google.com`

---

### 2. **Testing QR Code Scanning**

#### **Option A: Scan from Same Computer (Localhost)**
- ✅ Works with webcam on the same computer
- ❌ Won't work from mobile phone

**QR Code URL Format:**
```
http://localhost:5173/r/abc12345
```

#### **Option B: Scan from Mobile Phone (Local Network)**
- ✅ Works from any device on the same WiFi
- ✅ Best for testing real QR code scanning

**Steps:**

1. **Find Your Computer's IP Address:**
   ```bash
   ifconfig | grep "inet "
   ```
   Look for something like: `inet 10.216.1.38`

2. **Access from Mobile:**
   - Open browser on mobile: `http://10.216.1.38:5173`
   - Make sure mobile and computer are on the same WiFi

3. **Create QR Code:**
   - The QR code will contain: `http://10.216.1.38:5173/r/abc12345`
   - Scan this QR code from your mobile phone
   - It should redirect to your destination URL

**Important Notes:**
- ⚠️ Localhost (`127.0.0.1` or `localhost`) only works on the same computer
- ✅ Use your local IP (e.g., `10.216.1.38`) for mobile testing
- 🔒 Both devices must be on the same WiFi network

---

### 3. **Testing Dynamic vs Static QR Codes**

#### **Dynamic QR Code:**
1. Create QR Code with "Dynamic QR Code" checkbox **checked**
2. Note the destination URL (e.g., `https://www.google.com`)
3. Scan the QR code - should go to Google
4. Edit the QR code and change URL to `https://www.facebook.com`
5. Scan the **same QR code** again - should now go to Facebook ✅

#### **Static QR Code:**
1. Create QR Code with "Dynamic QR Code" checkbox **unchecked**
2. Note the destination URL (e.g., `https://www.google.com`)
3. Try to edit the URL - should show warning: "⚠ This is a Static QR Code - Cannot edit URL"
4. URL field should be disabled ✅

---

### 4. **Testing URL Validation**

Try creating QR codes with these URLs:

| Input | Should Work? | Result |
|-------|-------------|--------|
| `google.com` | ✅ Yes | Auto-converts to `https://www.google.com` |
| `https://example.com` | ✅ Yes | Valid URL |
| `invalid url here` | ❌ No | Shows error: "Invalid URL format" |
| `just text` | ❌ No | Shows error: "Invalid URL format" |
| `facebook.com` | ✅ Yes | Auto-converts to `https://www.facebook.com` |

---

### 5. **Testing Short URL**

**What is Short URL?**
- Short URL is the redirect link that's embedded in the QR code
- Format: `http://localhost:5173/r/abc12345`
- When scanned, it redirects to your destination URL

**How to Test:**
1. Create a QR code with destination: `https://www.google.com`
2. Note the Short URL (e.g., `/r/abc12345`)
3. Open the short URL directly in browser: `http://localhost:5173/r/abc12345`
4. Should redirect to Google ✅

**Benefits of Short URL:**
- ✅ Can change destination without changing QR code (Dynamic)
- ✅ Track analytics (clicks, scans)
- ✅ Simpler QR code pattern

---

### 6. **Common Issues & Solutions**

#### **Issue: QR Code doesn't work on mobile**
**Solution:** Use your local IP address instead of localhost
```
❌ http://localhost:5173/r/abc12345
✅ http://10.216.1.38:5173/r/abc12345
```

#### **Issue: URL validation not working**
**Solution:** Make sure you're entering a valid domain with a dot (`.`)
```
❌ google (invalid)
✅ google.com (valid)
✅ www.google.com (valid)
✅ https://google.com (valid)
```

#### **Issue: Can't edit Static QR code URL**
**Solution:** This is by design! Static QR codes cannot be edited. Create a new Dynamic QR code if you need to edit the URL later.

---

### 7. **Production Deployment**

When you deploy to a real server (e.g., Netlify, Vercel):

**Before Deployment:**
```
http://localhost:5173/r/abc12345
```

**After Deployment:**
```
https://yourapp.com/r/abc12345
```

✅ QR codes will work from anywhere in the world
✅ No need for same WiFi network
✅ Fully functional on all devices

---

## 📱 Quick Test Checklist

- [ ] Create QR code with `google.com` - should auto-add `https://www.`
- [ ] Create Dynamic QR code and edit URL - should work
- [ ] Create Static QR code and try to edit URL - should be disabled
- [ ] Scan QR code from mobile using local IP address
- [ ] Test short URL redirect in browser
- [ ] Check analytics tracking

---

## 🆘 Need Help?

If something doesn't work:
1. Check browser console for errors (F12)
2. Verify server is running on port 5001
3. Verify client is running on port 5173
4. Make sure both devices are on same WiFi (for mobile testing)
5. Try using your local IP address instead of localhost
