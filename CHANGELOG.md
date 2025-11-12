# Changelog - What if we…

All notable changes to this project will be documented in this file.

## [1.1.0] - November 2025

### ✨ New Features

#### Image Upload System
- **Drag & drop upload** - Drop images directly into the form
- **Click to upload** - Traditional file picker
- **Preview** - See uploaded image before saving
- **Base64 storage** - Images stored in database (no external hosting needed)
- **File validation** - Only images, max 5MB
- **Easy removal** - Click X to remove uploaded image

#### Match System
- **Match badges** - Glowing "✨ Match!" badge when both partners rate 3+ stars
- **Match sort option** - Filter to see only mutual favorites
- **Visual indicators** - Pulsing animation on match badges

#### Rating Improvements
- **Click to clear** - Click the same star rating again to set to 0
- **Better touch targets** - Larger, easier to tap on mobile
- **Hover effects** - Stars scale up on hover for feedback

#### UI/UX Enhancements
- **Average rating display** - Show ⭐ X.X average on each card
- **Date timestamps** - See when ideas were added
- **Toast notifications** - Success/error messages in bottom right
- **Loading states** - Spinners during save operations
- **Duplicate button** - Quick copy of existing ideas
- **Better mobile** - Improved responsive design

#### Keyboard Shortcuts
- **Esc** - Close modals or clear search
- *(More shortcuts coming in future updates)*

### 🐛 Bug Fixes
- Fixed image error handling for broken thumbnails
- Improved YouTube thumbnail extraction
- Better error messages for failed operations
- Fixed rating sync issues between users

### 🎨 Design Changes
- Added pulse animation for match badges
- Improved card hover effects
- Better contrast for tag badges
- Smoother transitions throughout
- More consistent spacing

### ⚡ Performance
- Increased JSON payload limit to 10MB for images
- Optimized re-rendering when rating ideas
- Faster image preview loading
- Reduced unnecessary API calls

### 📝 Documentation
- Added comprehensive ROADMAP.md
- Updated README with new features
- Better inline code comments
- Improved troubleshooting guide

---

## [1.0.0] - November 2025

### 🎉 Initial Release

#### Core Features
- **Dual-user rating system** - Each partner rates ideas independently (1-5 stars)
- **Tag system** - Organize ideas with custom tags
- **Tag filtering** - Click tags to filter, see active filters
- **Search functionality** - Search by description or tags
- **Multiple sort options** - Date, rating, average
- **YouTube integration** - Auto-fetch thumbnails from YouTube URLs
- **Custom images** - Paste image URLs for custom thumbnails
- **Import/Export** - Backup and restore ideas as JSON
- **Local network sync** - Share across devices on same WiFi

#### Design
- **Dark theme** - Professional dark UI with gradients
- **Responsive layout** - Works on desktop, tablet, and mobile
- **Card-based interface** - Clean, scannable date idea cards
- **Modal forms** - Full-featured add/edit dialog
- **Smooth animations** - Polished transitions and hover effects

#### Technical
- **Express backend** - Simple Node.js API
- **JSON storage** - File-based data persistence
- **RESTful API** - Clean API endpoints
- **No dependencies** - Vanilla JavaScript frontend
- **Easy setup** - One command to start (`npm start`)

---

## Upcoming in v1.2.0

### Planned Features
- Reddit video thumbnail support
- Vimeo thumbnail support
- TikTok link handling
- Notes system (per idea, per person)
- Status field (New/Planning/Done/Archived)
- Custom partner names in UI
- Undo delete (5-second grace period)
- Bulk actions (select multiple, bulk tag/delete)

---

## Upcoming in v2.0.0

### Major Features
- Calendar integration
- Schedule dates to calendar
- Stats and analytics dashboard
- Photo gallery (multiple images per idea)
- Location/map integration
- Smart recommendations
- Weather-aware suggestions

---

## Version Numbering

We use [Semantic Versioning](https://semver.org/):
- **Major (X.0.0)** - Breaking changes, major new features
- **Minor (1.X.0)** - New features, non-breaking changes
- **Patch (1.0.X)** - Bug fixes, minor improvements

---

## How to Update

### From v1.0.0 to v1.1.0

1. **Backup your data** (always!)
   ```bash
   # Your data.json is in the app folder
   cp data.json data-backup.json
   ```

2. **Stop the server**
   ```bash
   # Press Ctrl+C in the terminal
   ```

3. **Extract new version**
   ```bash
   # Extract whatifwe-app.tar.gz over existing folder
   ```

4. **Start server**
   ```bash
   npm start
   ```

Your data will be preserved! The new version is fully backward compatible.

---

## Breaking Changes

### None in v1.1.0
All changes are backward compatible. Your existing data will work without modification.

---

## Deprecations

### None yet
All features from v1.0.0 remain supported.

---

## Contributors

Thanks to everyone who helped make this release possible!

- Initial development and design
- User testing and feedback
- Feature suggestions
- Bug reports

Want to contribute? See ROADMAP.md for ideas!

---

**Note:** Dates in this changelog use the format: Month Year (e.g., November 2025)
