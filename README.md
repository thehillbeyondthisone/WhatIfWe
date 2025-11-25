# 💭 What if we…

A beautiful, playful date idea planning app for couples. Plan together, rate separately, and discover your perfect match!

## ✨ Features

### 🔐 Emoji Authentication
- **Unique 4-emoji codes** - Each partner creates a personal emoji password
- **No traditional login** - Fun, visual authentication
- **Auto-detection** - System recognizes which partner is logging in

### 🎨 Personalization
- **Individual Themes** - Choose from 4 beautiful color themes (blue, pink, green, yellow)
- **Custom Names** - Set your display names in settings
- **Persistent Preferences** - Each partner's settings saved separately

### 📱 Dual View Modes
- **List Mode** - See all ideas at once with ratings and details
- **Swipe Mode** - Tinder-style card interface for quick rating
- **View Filters** - Show all, your unrated, or mutual favorites

### ⭐ Smart Rating System
- **1-5 Heart Ratings** - Express your interest level
- **Privacy First** - Partner's rating hidden until both rate 3+ hearts
- **Mutual Discovery** - Easily spot ideas both partners love

### 💬 Collaboration Features
- **Comments** - Discuss ideas together
- **Notes** - Add planning details to any idea
- **Completion Tracking** - Mark ideas as done

### 🎬 Rich Media Support
- **Auto Thumbnails** - YouTube links fetch thumbnails automatically
- **Image Upload** - Add custom photos (with smart compression)
- **Video Links** - Direct links to inspiration

### 💾 Data Management
- **Automatic Backups** - System backs up every 10 writes
- **Manual Backup** - Create and restore backups anytime
- **Import/Export** - Share or transfer your date ideas
- **Configurable Compression** - Adjust image quality settings

### 🌐 Flexible Access
- **Local Network** - Access on your home WiFi
- **QR Code** - Quick phone connection
- **Remote Access** - Optional ngrok tunneling (experimental)
- **PWA Support** - Install to home screen like a native app

## 🚀 Quick Start

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16 or newer recommended)

### 2. Installation
```bash
# Clone or download this repository
cd WhatIfWe

# Install dependencies
npm install

# Start the server
npm start
```

### 3. Access the App

The server will display:
- Local URL: `http://localhost:3000`
- Network URL: `http://192.168.x.x:3000` (your local IP)
- QR code for easy phone access

**First time setup:**
1. Open the app on any device
2. Select 4 emojis for your personal code
3. Click "Login" button
4. Your partner does the same with different emojis
5. Start adding date ideas!

## 🎮 How to Use

### First Login
1. Open the app
2. See the emoji palette (24 playful emojis)
3. Tap 4 emojis to create your code
4. Login button appears - tap it
5. Set your name in Settings (optional)

### Adding Date Ideas
1. Tap **"+"** or **"Add idea"**
2. Enter description (e.g., "Try the new Thai restaurant downtown")
3. Optional: Add YouTube URL or upload image
4. Optional: Add notes
5. Save!

### Rating Ideas

**List Mode:**
- Click hearts directly on each card
- See your rating on left, partner's on right (if both rated 3+)

**Swipe Mode:**
- Swipe left to skip
- Swipe right or tap hearts to rate
- Swipe through unrated ideas quickly

### View Filters
- **All Ideas** - Everything, sorted by your preference
- **Unrated** - Just ideas you haven't rated yet
- **Would (3+)** - Ideas both partners rated 3+ hearts

### Themes & Settings
- Tap settings icon (top right)
- Choose your theme color
- Change display name
- Update emoji code
- Adjust image compression settings

### Comments & Notes
- Open any idea
- Add notes for planning details
- Leave comments to discuss with your partner
- See comment history

### Backup & Restore
- Go to Settings
- Tap "Backup" to save current state
- View backup history
- Restore from any previous backup

## 📁 Data Storage

All data stored locally in JSON files:
- `data.json` - Date ideas, ratings, comments
- `preferences.json` - User settings and emoji codes
- `config.json` - Server configuration
- `backups/` - Automatic timestamped backups

## 🔧 Advanced Options

### Server Scripts

```bash
npm start          # Standard mode
npm run verbose    # Enable detailed connection logging
npm run remote     # Enable ngrok tunneling (experimental)
```

### Verbose Logging

Monitor all server activity:
```bash
npm run verbose
```

This logs:
- Timestamp for each request
- HTTP method and path
- Client IP address
- User agent
- Response status code

Perfect for debugging or monitoring who's accessing the app.

### Configuration Files

**config.json** - Adjust server settings:
```json
{
  "imageCompression": {
    "maxSizeKB": 500,
    "maxWidth": 1200,
    "quality": 0.85
  },
  "backup": {
    "autoBackupInterval": 10,
    "maxBackups": 50
  }
}
```

**ngrok.config.json** - Remote access (optional, experimental):
```json
{
  "authtoken": "your_ngrok_token_here"
}
```
Get token from: https://dashboard.ngrok.com/get-started/your-authtoken

### PWA / Home Screen Icon

The app supports installation to your phone's home screen!

**To customize the icon:**
1. Create `icon-192.png` (192x192 pixels)
2. Create `icon-512.png` (512x512 pixels)
3. Place in `public/` folder
4. See `public/ICONS.md` for design tips

**To install:**
- **iOS:** Safari → Share → "Add to Home Screen"
- **Android:** Chrome → Menu → "Add to Home Screen"

## 🔐 Security & Privacy

- **Local first** - All data stored on your device
- **No cloud** - Nothing sent to external servers
- **No tracking** - No analytics or telemetry
- **Emoji codes** - Simple but effective authentication for home use

⚠️ **Note:** This app is designed for trusted home network use. Not suitable for public internet without additional authentication layers.

## 🐛 Troubleshooting

### Can't access from phone
1. Verify both devices on **same WiFi network**
2. Check firewall isn't blocking port 3000
   - Windows: Windows Defender Firewall → Allow an app
   - Mac: System Preferences → Security → Firewall
   - Linux: `sudo ufw allow 3000/tcp`
3. Try each IP address shown in server output
4. Disable VPN if running

### Emoji code not working
- Make sure you're using the **exact same 4 emojis** in order
- Tap "Settings" to see your registered code
- Create a new code if forgotten (old data persists)

### Images too large
- Adjust `maxSizeKB` in `config.json`
- Recommended range: 300-800 KB
- Lower quality = smaller files

### Backup/restore failed
- Check `backups/` folder exists
- Ensure write permissions
- Try manual export instead

### Server crashes or won't start
```bash
# Check Node.js version
node --version

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check if port 3000 is in use
# Windows: netstat -ano | findstr :3000
# Mac/Linux: lsof -i :3000
```

## 💡 Tips & Best Practices

### For Best Experience
- **Rate independently** before discussing
- **Use swipe mode** for quick initial ratings
- **Export regularly** to backup your ideas
- **Add photos** to make ideas more appealing
- **Use comments** to coordinate plans

### Organization Tips
- Write clear, specific descriptions
- Add notes with practical details (reservations, websites, etc.)
- Use completion tracking to remember what you've done
- Keep the list fresh - delete ideas you won't do

### Performance
- Images are automatically compressed
- Backups happen every 10 saves
- Old backups auto-pruned (keeps 50 most recent)
- App works offline after initial load

## 📱 Mobile Features

- **Responsive design** - Works on any screen size
- **Touch optimized** - Swipe gestures in swipe mode
- **PWA ready** - Install to home screen
- **iOS safe areas** - Proper spacing for notched devices
- **Portrait optimized** - Best experience in portrait mode

## 🔮 Technical Details

**Frontend:**
- Vanilla JavaScript (no frameworks)
- CSS custom properties for theming
- LocalStorage for temporary session data
- Fetch API for server communication

**Backend:**
- Node.js + Express
- JSON file-based storage
- Optional ngrok integration
- Automatic backup system

**No external dependencies** for core functionality!

## 📚 Additional Documentation

- `QUICKSTART.md` - Fast setup guide
- `NETWORK_SETUP.md` - Detailed network configuration
- `NGROK_SETUP.md` - Remote access setup (experimental)
- `CHANGELOG.md` - Version history
- `ROADMAP.md` - Future plans
- `public/ICONS.md` - Custom icon guide

## 🤝 Contributing

This is a personal project, but suggestions welcome! File issues or submit pull requests.

## 📄 License

MIT License - Free to use, modify, and share!

## ❤️ About

Built for couples who want to keep date night exciting and collaborative. No cloud services, no subscriptions, no tracking - just you two and your ideas.

**Version:** 1.1.0
**Last Updated:** November 2025

---

**Made with 💕 for keeping date night exciting!**
