# 💭 What if we…

A beautiful, dark-themed date idea planning app for couples. Plan together, rate separately, and find your perfect match!

## ✨ Features

- **🎨 Beautiful Dark UI** - Professional, modern interface with smooth animations
- **⭐ Individual Ratings** - Each partner rates ideas separately (1-5 stars)
- **🏷️ Tags & Filtering** - Organize ideas with tags, filter by clicking them
- **🔍 Search & Sort** - Find ideas quickly with search and multiple sorting options
- **🎬 Auto Thumbnails** - YouTube links automatically fetch thumbnails
- **📱 Mobile Friendly** - Works great on phones and tablets
- **💾 Import/Export** - Backup and share your date ideas
- **🏠 Local Network** - Run on your home network, no cloud required

## 🚀 Quick Start

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (LTS version recommended)

### 2. Installation
```bash
# Extract the archive and navigate to the folder
cd whatifwe-app

# Install dependencies
npm install

# Start the server
npm start
```

### 3. Access the App

**From the host computer:**
```
http://localhost:3000
```

**From your phones:**
1. Find your computer's local IP address:
   - **Windows:** Open Command Prompt, type `ipconfig`
   - **Mac/Linux:** Open Terminal, type `ifconfig` or `ip addr`
   - Look for something like `192.168.1.XXX`

2. Make sure both phones are on the same WiFi network

3. Open browser and go to:
   ```
   http://YOUR_IP_ADDRESS:3000
   ```
   Example: `http://192.168.1.100:3000`

## 📖 How to Use

### Adding Date Ideas
1. Click **"Add idea"** button
2. Enter a description (e.g., "Take a pottery class together")
3. Add tags (comma-separated, e.g., "creative, hands-on, indoor")
4. Optional: Add YouTube URL for automatic thumbnail
5. Optional: Add custom image URL
6. Set initial ratings for both partners
7. Click **Save**

### Rating Ideas
- Click the stars on any card to rate
- Your rating updates instantly
- Partner's rating is shown to the right

### Filtering & Searching
- **Search bar:** Type to search descriptions and tags
- **Click tags:** Filter by specific tags
- **Sort dropdown:** Sort by date, rating, average, etc.
- **Clear filters:** Reset all filters at once

### Managing Ideas
- **Edit:** Click the edit button on any card
- **Delete:** Click delete (with confirmation)
- **Open video:** Click "Open video" to watch in new tab

### Import/Export
- **Export:** Download your ideas as JSON
- **Import:** Upload a JSON file to restore/merge ideas

## 🎨 Customization

### Change Partner Names
Edit `public/index.html`, find this line (around line 290):
```javascript
const users = {person1:'Partner 1', person2:'Partner 2'};
```
Change to your actual names:
```javascript
const users = {person1:'Alex', person2:'Jordan'};
```

### Change Port
Edit `server.js`, line 6:
```javascript
const PORT = 3000;  // Change to any available port
```

### Customize Colors
Edit the `:root` section in `public/index.html` (around line 8):
```css
:root{
  --bg: #0f172a;           /* Main background */
  --brand:#7dd3fc;         /* Primary brand color */
  --accent:#f59e0b;        /* Accent color */
  /* ... etc */
}
```

## 📁 Data Storage

All date ideas are stored in `data.json` in the app folder.

**To backup:**
- Use the Export button in the app, OR
- Copy the `data.json` file

**To restore:**
- Use the Import button, OR
- Replace `data.json` with your backup

## 🔧 Troubleshooting

### Can't access from phone
- ✅ Both devices on same WiFi?
- ✅ Computer firewall blocking port 3000?
- ✅ Using correct IP address?
- ✅ VPN disabled?

### Server won't start
- Check if Node.js is installed: `node --version`
- Make sure you ran `npm install`
- Check if port 3000 is available

### Thumbnails not loading
- YouTube thumbnails require internet connection
- Some sites block thumbnail extraction
- Custom image URLs must be direct links to images

### Page won't load after editing
- Check browser console for errors (F12)
- Clear browser cache and refresh
- Make sure server is still running

## 🌐 Network Security Notes

This app is designed for **local network use only**. It has no authentication.

**To make it internet-accessible (not recommended without additional security):**
- Set up port forwarding on your router
- Use a reverse proxy with HTTPS
- Add authentication middleware
- Consider using a proper hosting solution

## 💡 Tips

### Best Practices
- Add tags consistently (e.g., always use "food" not "dinner" or "eating")
- Use descriptive titles
- Rate independently before discussing
- Export your data regularly as backup

### Tag Ideas
- **Type:** food, activity, game, movie
- **Location:** indoor, outdoor, downtown, home
- **Time:** quick, evening, weekend, day-trip
- **Mood:** romantic, adventure, relaxed, active
- **Weather:** rainy-day, summer, winter

## 📱 Mobile Tips

- Add to home screen for app-like experience
- Landscape mode works great on tablets
- Swipe down to refresh data
- Works offline once loaded (but needs connection for new thumbnails)

## 🐛 Known Issues

- Some video sites don't provide thumbnails (will show text-only card)
- Import doesn't validate tag format (clean your data first)
- No undo for deletions (export regularly!)

## 🔮 Future Ideas

Want to extend it? Here are some ideas:
- "Date night randomizer" button
- Calendar integration
- Completed/favorite markers
- Notes per idea
- Cost estimates
- Weather integration for outdoor ideas
- Notification reminders

## 📄 License

MIT - Feel free to modify and share!

## 🤝 Support

Having issues? Check:
1. Browser console for errors
2. Server terminal for error messages
3. Network connectivity
4. Data.json file format

---

Made with ❤️ for keeping date night exciting!

**Version:** 1.0.0  
**Last Updated:** November 2025
