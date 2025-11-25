# 🚀 Quick Start - What if we…

## Get Running in 5 Minutes

### Step 1: Install Node.js
- Go to https://nodejs.org
- Download the LTS version (v16 or newer)
- Install it

### Step 2: Setup & Start

```bash
# Navigate to the app folder
cd WhatIfWe

# Install dependencies (first time only)
npm install

# Start the server - choose one:
npm start              # Normal mode (recommended)
npm run verbose        # Verbose mode (logs all connections)
```

**What's the difference?**

**Normal mode** (`npm start`):
```
✨ What if we… is running!

📱 On this computer: http://localhost:3000
🌐 On same network:  http://192.168.1.100:3000

📱 Scan with your phone:
[QR CODE appears here]
```

**Verbose mode** (`npm run verbose`):
```
🔍 Verbose logging enabled

✨ What if we… is running!
[Same output as above, PLUS detailed logs for every connection:]

📊 [2025-11-25T01:30:45.123Z]
   GET /
   IP: 192.168.1.105
   User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 17_0...)
   Response: 200

📊 [2025-11-25T01:30:46.456Z]
   POST /api/auth/validate
   IP: 192.168.1.105
   User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 17_0...)
   Response: 200
```

**Use verbose mode when:**
- Debugging connection issues
- Monitoring who's accessing the app
- Troubleshooting network problems
- Learning how the app works

**Use normal mode when:**
- Just using the app normally
- You don't need detailed logs
- Cleaner console output

### Step 3: Access from Your Devices

The server automatically detects your local IP. You'll see it in the output.

**From the same computer:**
```
http://localhost:3000
```

**From phones/tablets on same WiFi:**
```
http://192.168.1.XXX:3000
```
*(Use the exact IP shown in your server output)*

**Quick phone access:**
- Just scan the QR code shown in the terminal!

### Step 4: First Time Login

1. Open the app on your phone
2. You'll see 24 playful emojis
3. **Partner 1:** Tap 4 emojis to create your code (e.g., 😍🔥🌈✨)
4. Tap the "Login" button that appears
5. **Partner 2:** Create a different 4-emoji code (e.g., 🍕🎉🚀💎)
6. Tap "Login"

**From now on:**
- Just enter your 4 emojis and tap Login
- The app knows which partner you are
- Each partner has their own theme and settings

### Step 5: Start Adding Date Ideas

1. Tap the **"+"** button
2. Enter description: *"Try that new ramen place"*
3. Add a YouTube video or photo (optional)
4. Save!
5. Rate it with hearts (1-5)

## Remote Access (Optional)

Want to access from anywhere, not just same WiFi?

### Built-in Remote Access (Experimental)

```bash
npm run remote
```

This attempts to use ngrok for remote access. **Note:** Currently tabled for troubleshooting - local network is recommended.

### Alternative: Cloudflare Tunnel (Recommended)

Free, no signup required, works anywhere:

```bash
# Install cloudflared first (one-time):
# Windows: choco install cloudflared
# Mac: brew install cloudflare/cloudflare/cloudflared
# Linux: Download from cloudflare.com

# Then run:
cloudflared tunnel --url http://localhost:3000
```

Copy the `https://` URL it shows and share with your partner!

## Combining Flags

You can combine verbose with remote:

```bash
node server.js --verbose --remote
# or
node server.js -v --ngrok
```

## Pro Tips

### Best Practices
- 💾 **Export regularly** - Settings → Export to backup
- ⭐ **Rate independently** - Don't peek at partner's rating!
- 🎨 **Choose your theme** - Settings → Pick your favorite color
- 📱 **Add to home screen** - Safari/Chrome → "Add to Home Screen"

### View Modes
- **List Mode** - See all ideas at once
- **Swipe Mode** - Tinder-style card swiping
- Switch anytime with the toggle at top

### View Filters
- **All Ideas** - Everything
- **Unrated** - Just what you haven't rated
- **Would (3+)** - Ideas both partners like (3+ hearts)

### Emoji Code Tips
- **Remember your code!** Write it down first time
- **Make it memorable** - Pick emojis you like
- **Check Settings** - Your code is shown in Settings
- **Different codes** - Each partner needs unique code

## Troubleshooting

### Can't access from phone?

**Check these:**
1. ✅ Both devices on **same WiFi network**
2. ✅ Using the **exact IP** shown in server output
3. ✅ Firewall not blocking port 3000
   - Windows: Windows Defender Firewall → Allow an app
   - Mac: System Preferences → Security → Firewall
   - Linux: `sudo ufw allow 3000/tcp`
4. ✅ VPN disabled on both devices

**Try this:**
```bash
npm run verbose
```
Then try connecting - you'll see if requests are reaching the server.

### Port 3000 already in use?

Edit `server.js` line 17:
```javascript
const PORT = 3001;  // Change to any available port
```

### Forgot emoji code?

Check Settings while logged in, or:
1. Open `preferences.json` in a text editor
2. Find `"emojiCode": ["😍","🔥","🌈","✨"]`
3. That's your code!

### Server won't start?

```bash
# Check Node.js installed
node --version

# Should show v16.0.0 or newer

# Reinstall dependencies
rm -rf node_modules
npm install

# Try again
npm start
```

### Still stuck?

Run verbose mode and look for error messages:
```bash
npm run verbose
```

## Stopping the Server

Press `Ctrl+C` in the terminal where it's running.

## Next Steps

- Read `README.md` for full documentation
- Check `NETWORK_SETUP.md` for detailed network configuration
- See `public/ICONS.md` to customize home screen icon
- Explore Settings for theme customization and backups

---

**That's it! Start planning amazing date nights! 💕**
