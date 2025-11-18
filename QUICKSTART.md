# 🚀 Quick Start - What if we…

## Get Running in 5 Minutes

### Step 1: Install Node.js
- Go to https://nodejs.org
- Download the LTS version
- Install it

### Step 2: Setup
```bash
# Open terminal/command prompt in the whatifwe-app folder
npm install
npm start
```

You should see:
```
✨ What if we… is running!

📱 Access from this device: http://localhost:3000
📱 Access from other devices: http://YOUR_LOCAL_IP:3000
```

### Step 3: Find Your IP Address

**Windows:**
```cmd
ipconfig
```
Look for "IPv4 Address" → something like `192.168.1.100`

**Mac/Linux:**
```bash
ifconfig
# or
ip addr
```
Look for "inet" → something like `192.168.1.100`

### Step 4: Access from Phones

**Option A: Local Network (Same WiFi)**
1. Connect both phones to same WiFi
2. Open browser
3. Go to: `http://YOUR_IP:3000`
   - Example: `http://192.168.1.100:3000`

**Option B: Cloudflare Tunnel (Anywhere, No Port Forwarding)**

Perfect for accessing from different networks without exposing your IP!

1. Install Cloudflare Tunnel:
   ```bash
   # Download from: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/
   # Or use package manager:

   # Mac (Homebrew)
   brew install cloudflare/cloudflare/cloudflared

   # Windows (Chocolatey)
   choco install cloudflared

   # Linux
   wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64
   chmod +x cloudflared-linux-amd64
   sudo mv cloudflared-linux-amd64 /usr/local/bin/cloudflared
   ```

2. Start tunnel:
   ```bash
   cloudflared tunnel --url http://localhost:3000
   ```

3. Copy the `https://` URL it generates (e.g., `https://random-name.trycloudflare.com`)
4. Share this URL with your partner - works anywhere!

**Option C: ngrok (Anywhere, Simple Setup)**

Another great option for remote access:

1. Sign up for free at https://ngrok.com
2. Install ngrok:
   ```bash
   # Download from: https://ngrok.com/download
   # Or use package manager:

   # Mac (Homebrew)
   brew install ngrok

   # Windows (Chocolatey)
   choco install ngrok

   # Linux (Snap)
   snap install ngrok
   ```

3. Authenticate (one-time):
   ```bash
   ngrok config add-authtoken YOUR_TOKEN_FROM_NGROK_DASHBOARD
   ```

4. Start tunnel:
   ```bash
   ngrok http 3000
   ```

5. Copy the `https://` URL (e.g., `https://abc123.ngrok-free.app`)
6. Share this URL with your partner!

**Which Option Should I Use?**
- **Same WiFi**: Fastest, most private, works offline
- **Cloudflare Tunnel**: Free, no signup, perfect for quick remote access
- **ngrok**: Free tier available, more reliable long-term, includes request inspection

## First Use

1. **Toggle to your name** at the top
2. **Click "Add idea"**
3. **Enter a date idea:**
   - Description: "Take a cooking class"
   - Tags: "food, learning, indoor"
   - Video: Paste a YouTube link (optional)
4. **Rate it** with stars
5. **Switch to partner's name** and rate independently
6. **Click tags** to filter by category

## Pro Tips

- ⭐ Rate honestly and independently
- 🏷️ Use consistent tags (food, outdoor, quick, etc.)
- 💾 Export regularly as backup
- 🎬 YouTube links = auto thumbnails
- 🔍 Search works on descriptions AND tags

## Troubleshooting

**Can't connect from phone?**
- Same WiFi? ✓
- Firewall blocking? ✓
- Correct IP? ✓

**Port 3000 in use?**
Edit `server.js` line 6:
```javascript
const PORT = 3001;  // or any other port
```

## That's It!

You're ready to start planning date nights! 💕

For more details, see README.md
