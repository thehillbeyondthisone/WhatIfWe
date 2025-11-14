# Network Setup & Troubleshooting Guide

## 🚀 Quick Start

1. Run the app: `npm start` or `./start.sh` or `node server.js`
2. Look for the QR code and network URL in the terminal
3. Scan the QR code with your phone's camera
4. Both devices should be on the **same Wi-Fi network**

---

## 🔍 Finding Your Computer's IP Address

The app tries to auto-detect your IP, but it might not always work correctly. Here's how to find your actual IP address:

### **macOS**
```bash
# In Terminal:
ipconfig getifaddr en0    # For Wi-Fi
ipconfig getifaddr en1    # For Ethernet

# Or:
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**GUI Method:**
1. System Preferences → Network
2. Select your active connection (Wi-Fi/Ethernet)
3. Look for "IP Address" (e.g., `192.168.1.100`)

### **Windows**
```cmd
# In Command Prompt or PowerShell:
ipconfig
```
Look for "IPv4 Address" under your active network adapter.

**GUI Method:**
1. Settings → Network & Internet → Wi-Fi/Ethernet
2. Click on your connection
3. Find "IPv4 Address"

### **Linux**
```bash
# Any of these:
hostname -I
ip addr show
ifconfig
ip route get 1 | grep -oP 'src \K\S+'
```

Your LAN IP typically starts with:
- `192.168.x.x` (most common home networks)
- `10.x.x.x` (some routers/corporate networks)
- `172.16.x.x` to `172.31.x.x` (less common)

---

## 🔥 Firewall Configuration

### **macOS**

**Option 1: System Preferences**
1. System Preferences → Security & Privacy → Firewall
2. Click the lock to make changes
3. Click "Firewall Options"
4. Add Node.js or Terminal to allowed apps
5. Or temporarily turn off firewall to test

**Option 2: Command Line**
```bash
# Check firewall status
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate

# Add Node to allowed apps
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/local/bin/node
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblockapp /usr/local/bin/node
```

### **Windows**

**Option 1: GUI**
1. Windows Security → Firewall & network protection
2. Advanced settings
3. Inbound Rules → New Rule
4. Port → TCP → Specific local port: `3000`
5. Allow the connection
6. Apply to all profiles (Domain, Private, Public)
7. Name it "What If We App"

**Option 2: Command Line (as Administrator)**
```cmd
netsh advfirewall firewall add rule name="What If We App" dir=in action=allow protocol=TCP localport=3000
```

**Quick Test (disable firewall temporarily):**
```cmd
netsh advfirewall set allprofiles state off
:: Test if app works, then turn it back on:
netsh advfirewall set allprofiles state on
```

### **Linux**

**UFW (Ubuntu/Debian):**
```bash
# Check status
sudo ufw status

# Allow port 3000
sudo ufw allow 3000/tcp

# Reload
sudo ufw reload
```

**Firewalld (Fedora/RHEL/CentOS):**
```bash
# Check status
sudo firewall-cmd --state

# Allow port 3000
sudo firewall-cmd --add-port=3000/tcp --permanent
sudo firewall-cmd --reload

# Verify
sudo firewall-cmd --list-ports
```

**iptables:**
```bash
# Allow port 3000
sudo iptables -A INPUT -p tcp --dport 3000 -j ACCEPT

# Save rules (Ubuntu)
sudo netfilter-persistent save

# Save rules (RHEL/CentOS)
sudo service iptables save
```

---

## 🧪 Testing Connectivity

### **Step 1: Verify Server is Running**
```bash
# Check if port 3000 is listening
netstat -an | grep 3000
# Or
lsof -i :3000
```

You should see something like:
```
tcp        0      0 0.0.0.0:3000            0.0.0.0:*               LISTEN
```

### **Step 2: Test from Same Computer**
Open browser on the computer running the server:
```
http://localhost:3000
```
✅ If this works, the server is running correctly.

### **Step 3: Test from Another Device on Same Network**

Replace `YOUR_IP` with your actual IP address:
```
http://YOUR_IP:3000
```

**Example:**
```
http://192.168.1.100:3000
```

### **Step 4: Ping Test**
From your phone/other device, check if you can reach the computer:

**iPhone/Android (using terminal app):**
```bash
ping YOUR_COMPUTER_IP
```

**Windows/Mac/Linux:**
```bash
ping YOUR_COMPUTER_IP
```

If ping doesn't work, there's a network/firewall issue.

---

## 🐛 Common Issues & Solutions

### Issue 1: "Connection Timed Out"

**Causes:**
- Firewall blocking port 3000
- Devices on different networks
- Wrong IP address

**Solutions:**
1. Verify both devices on **same Wi-Fi** (not cellular data!)
2. Check firewall (see sections above)
3. Verify IP address is correct
4. Try temporarily disabling firewall to test

### Issue 2: "Connection Refused"

**Causes:**
- Server not running
- Wrong port
- Server crashed

**Solutions:**
1. Make sure server is actually running (`node server.js`)
2. Check console for error messages
3. Verify port 3000 in URL
4. Restart the server

### Issue 3: Auto-detected IP is Wrong

**Causes:**
- Multiple network interfaces (VPN, Docker, etc.)
- Running in container/VM
- Complex network setup

**Solutions:**
1. Manually find your IP using methods above
2. Ignore the auto-detected IP
3. Manually type `http://YOUR_REAL_IP:3000` in phone browser
4. Update QR code using online generator with correct URL

### Issue 4: Works on Some Devices, Not Others

**Causes:**
- Some devices on 5GHz, others on 2.4GHz Wi-Fi
- Guest network isolation
- Device-specific firewall

**Solutions:**
1. Ensure all devices on same network band
2. Check if router has "AP Isolation" enabled (disable it)
3. Disable guest network isolation
4. Check individual device firewalls

### Issue 5: QR Code Doesn't Scan

**Causes:**
- QR code has wrong URL
- Camera app doesn't support QR

**Solutions:**
1. Manually type the URL instead
2. Use a dedicated QR scanner app
3. Generate new QR code with correct IP using [qr-code-generator.com](https://www.qr-code-generator.com/)

---

## 🌐 Advanced: Network Isolation Issues

### Router AP Isolation
Some routers prevent devices from communicating with each other (common on guest networks).

**Fix:**
1. Log into your router (usually `192.168.1.1` or `192.168.0.1`)
2. Look for "AP Isolation", "Client Isolation", or "Privacy Separator"
3. Disable it
4. Restart router if needed

### VPN Interference
If you're running a VPN on your computer, it might interfere with local network access.

**Fix:**
1. Temporarily disconnect VPN
2. Test if app works
3. If it does, configure VPN to allow local network access

### Docker/VM Networks
If running in Docker or VM, the detected IP might be internal.

**Fix:**
1. Use your host machine's IP address instead
2. Ensure port 3000 is forwarded from container/VM to host

---

## 📱 Alternative Access Methods

If you still can't get local network access working:

### Option 1: Use ngrok (Temporary Internet Tunnel)
```bash
# Install ngrok from https://ngrok.com
npm install -g ngrok

# In a separate terminal:
ngrok http 3000

# Use the https URL provided (e.g., https://abc123.ngrok.io)
```

### Option 2: Cloudflare Tunnel
```bash
# Install cloudflared
# Then:
cloudflared tunnel --url http://localhost:3000
```

### Option 3: Host Computer Only
Both partners can use the same computer:
- Use two browser windows/tabs
- Each partner sets their profile (Partner 1 / Partner 2)
- Works without any network setup!

---

## ✅ Quick Checklist

- [ ] Server is running (`node server.js`)
- [ ] Can access `http://localhost:3000` on host computer
- [ ] Know your computer's actual IP address
- [ ] Both devices on the SAME Wi-Fi network
- [ ] Firewall allows port 3000
- [ ] Using correct URL: `http://YOUR_IP:3000`
- [ ] Router doesn't have AP isolation enabled

---

## 🆘 Still Having Issues?

1. **Check the terminal output** when you start the server for any errors
2. **Try different port:** Edit `server.js` and change `PORT = 3000` to `PORT = 8080`
3. **Simplify setup:** Temporarily disable all firewalls and antivirus
4. **Use hotspot:** Have computer create Wi-Fi hotspot, connect phone to it
5. **Check router settings:** Ensure router allows device-to-device communication

---

## 🎉 Success!

Once connected, you should see the "What if we..." app. Each partner can:
- Switch between Partner 1 and Partner 2 using the toggle
- Add ideas with their own ratings
- See each other's ratings only when they're 3+ stars
- Toggle mobile mode with the 📱 button for optimized phone view

Enjoy planning your dates together! 💑
