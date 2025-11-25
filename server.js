const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const os = require('os');
const qrcode = require('qrcode-terminal');

// Optional: Try to load ngrok
let ngrok = null;
try {
  ngrok = require('ngrok');
} catch (e) {
  console.log('💡 ngrok not installed - remote access disabled. Run: npm install ngrok');
}

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');
const PREFERENCES_FILE = path.join(__dirname, 'preferences.json');
const BACKUP_DIR = path.join(__dirname, 'backups');
const CONFIG_FILE = path.join(__dirname, 'config.json');
const NGROK_CONFIG_FILE = path.join(__dirname, 'ngrok.config.json');

// Parse command line arguments
const args = process.argv.slice(2);
const USE_NGROK = args.includes('--ngrok') || args.includes('--remote');
const VERBOSE = args.includes('--verbose') || args.includes('-v');

// Increase payload limit to handle base64 images (10MB)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Verbose logging middleware (enabled with --verbose or -v flag)
if (VERBOSE) {
  app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    const method = req.method;
    const path = req.originalUrl || req.url;

    console.log(`\n📊 [${timestamp}]`);
    console.log(`   ${method} ${path}`);
    console.log(`   IP: ${ip}`);
    console.log(`   User-Agent: ${userAgent}`);

    // Log response status after request completes
    const originalSend = res.send;
    res.send = function(data) {
      console.log(`   Response: ${res.statusCode}`);
      return originalSend.apply(res, arguments);
    };

    next();
  });
  console.log('🔍 Verbose logging enabled\n');
}

app.use(express.static('public'));

// Ensure backup directory exists
async function ensureBackupDir() {
  try {
    await fs.access(BACKUP_DIR);
  } catch {
    await fs.mkdir(BACKUP_DIR);
  }
}

// Create a backup of the data file
async function createBackup() {
  try {
    await ensureBackupDir();
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const backupFile = path.join(BACKUP_DIR, `data-${timestamp}.json`);
    const data = await fs.readFile(DATA_FILE, 'utf8');
    await fs.writeFile(backupFile, data);
    console.log(`✓ Backup created: ${backupFile}`);
    return backupFile;
  } catch (error) {
    console.error('Backup creation failed:', error);
    throw error;
  }
}

// List all available backups
async function listBackups() {
  try {
    await ensureBackupDir();
    const files = await fs.readdir(BACKUP_DIR);
    const backups = files
      .filter(f => f.startsWith('data-') && f.endsWith('.json'))
      .sort()
      .reverse();

    const backupList = await Promise.all(backups.map(async (file) => {
      const filePath = path.join(BACKUP_DIR, file);
      const stats = await fs.stat(filePath);
      return {
        filename: file,
        path: filePath,
        size: stats.size,
        created: stats.mtime
      };
    }));

    return backupList;
  } catch (error) {
    console.error('Failed to list backups:', error);
    return [];
  }
}

// Restore from a backup
async function restoreFromBackup(backupFilename) {
  try {
    const backupPath = path.join(BACKUP_DIR, backupFilename);

    // Verify backup exists
    await fs.access(backupPath);

    // Create a backup of current data before restoring
    await createBackup();

    // Restore the backup
    const backupData = await fs.readFile(backupPath, 'utf8');
    await fs.writeFile(DATA_FILE, backupData);

    console.log(`✓ Restored from backup: ${backupFilename}`);
    return true;
  } catch (error) {
    console.error('Restore failed:', error);
    throw error;
  }
}

// Initialize data file if it doesn't exist
async function initDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    const sample = [
      {
        id: '1',
        description: 'Take a pottery class together',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        imageUrl: '',
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
        ratings: { person1: 4, person2: 5 },
        notes: '',
        completed: false,
        comments: [
          { user: 'person1', text: 'This looks fun!', timestamp: Date.now() - 1000 * 60 * 60 * 2 },
          { user: 'person2', text: 'I agree! Let\'s do it this weekend!', timestamp: Date.now() - 1000 * 60 * 60 }
        ],
        createdBy: null
      },
      {
        id: '2',
        description: 'Try the new sushi restaurant downtown',
        videoUrl: '',
        imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1200&auto=format&fit=crop',
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 9,
        ratings: { person1: 5, person2: 4 },
        notes: '',
        completed: false,
        comments: [],
        createdBy: null
      },
      {
        id: '3',
        description: 'Escape room adventure',
        videoUrl: 'https://youtu.be/3GwjfUFyY6M',
        imageUrl: '',
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 8,
        ratings: { person1: 2, person2: 5 },
        notes: '',
        completed: false,
        comments: [],
        createdBy: null
      },
      {
        id: '4',
        description: 'Wine tasting at the local vineyard',
        videoUrl: '',
        imageUrl: '',
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
        ratings: { person1: 0, person2: 0 },
        notes: '',
        completed: false,
        comments: [],
        createdBy: null
      },
      {
        id: '5',
        description: 'Sunset picnic at the beach',
        videoUrl: '',
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop',
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 6,
        ratings: { person1: 5, person2: 0 },
        notes: '',
        completed: false,
        comments: [],
        createdBy: null
      },
      {
        id: '6',
        description: 'Indoor rock climbing',
        videoUrl: '',
        imageUrl: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=1200&auto=format&fit=crop',
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
        ratings: { person1: 0, person2: 3 },
        notes: '',
        completed: false,
        comments: [],
        createdBy: null
      },
      {
        id: '7',
        description: 'Visit the art museum and brunch',
        videoUrl: '',
        imageUrl: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?q=80&w=1200&auto=format&fit=crop',
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 4,
        ratings: { person1: 0, person2: 0 },
        notes: '',
        completed: false,
        comments: [],
        createdBy: null
      },
      {
        id: '8',
        description: 'Weekend getaway to the mountains',
        videoUrl: '',
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop',
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
        ratings: { person1: 0, person2: 4 },
        notes: '',
        completed: false,
        comments: [],
        createdBy: null
      },
      {
        id: '9',
        description: 'Cook a fancy dinner together at home',
        videoUrl: '',
        imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1200&auto=format&fit=crop',
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
        ratings: { person1: 5, person2: 5 },
        notes: '',
        completed: false,
        comments: [
          { user: 'person1', text: 'Love this idea!', timestamp: Date.now() - 1000 * 60 * 30 }
        ],
        createdBy: null
      },
      {
        id: '10',
        description: 'Take dance lessons',
        videoUrl: '',
        imageUrl: '',
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 1,
        ratings: { person1: 0, person2: 0 },
        notes: '',
        completed: false,
        comments: [],
        createdBy: null
      }
    ];
    await fs.writeFile(DATA_FILE, JSON.stringify(sample, null, 2));
  }
}

// Read data
async function readData() {
  const data = await fs.readFile(DATA_FILE, 'utf8');
  return JSON.parse(data);
}

// Write data (with automatic backup based on config)
let writeCounter = 0;
async function writeData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));

  // Create automatic backup based on config interval
  const config = await readConfig();
  const interval = config.backup?.autoBackupInterval || 10;

  writeCounter++;
  if (writeCounter >= interval) {
    writeCounter = 0;
    createBackup().catch(err => console.error('Auto-backup failed:', err));
  }
}

// Initialize config file if it doesn't exist
async function initConfigFile() {
  try {
    await fs.access(CONFIG_FILE);
  } catch {
    const defaultConfig = {
      imageCompression: {
        maxSizeKB: 500,
        maxWidth: 1200,
        quality: 0.85,
        description: 'Image compression settings. Adjust maxSizeKB to change target file size (100-2000KB recommended)'
      },
      backup: {
        autoBackupInterval: 10,
        maxBackups: 50,
        description: 'Backup settings. autoBackupInterval = backup every N writes, maxBackups = max backup files to keep'
      }
    };
    await fs.writeFile(CONFIG_FILE, JSON.stringify(defaultConfig, null, 2));
  }
}

// Read config
async function readConfig() {
  try {
    const data = await fs.readFile(CONFIG_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    // Return defaults if config file doesn't exist
    return {
      imageCompression: {
        maxSizeKB: 500,
        maxWidth: 1200,
        quality: 0.85
      },
      backup: {
        autoBackupInterval: 10,
        maxBackups: 50
      }
    };
  }
}

// Write config
async function writeConfig(config) {
  await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2));
}

// Initialize preferences file if it doesn't exist
async function initPreferencesFile() {
  try {
    await fs.access(PREFERENCES_FILE);
  } catch {
    const defaultPrefs = {
      person1: {
        displayName: 'Partner 1',
        emojiCode: ['😍', '🔥', '🌈', '✨'],
        mode: 'list',
        theme: 'blue',
        view: 'all',
        sort: 'date_desc'
      },
      person2: {
        displayName: 'Partner 2',
        emojiCode: ['🍕', '🎉', '🚀', '💎'],
        mode: 'list',
        theme: 'blue',
        view: 'all',
        sort: 'date_desc'
      }
    };
    await fs.writeFile(PREFERENCES_FILE, JSON.stringify(defaultPrefs, null, 2));
  }
}

// Read preferences
async function readPreferences() {
  const data = await fs.readFile(PREFERENCES_FILE, 'utf8');
  return JSON.parse(data);
}

// Write preferences
async function writePreferences(data) {
  await fs.writeFile(PREFERENCES_FILE, JSON.stringify(data, null, 2));
}

// Fetch thumbnail from URL
async function fetchThumbnail(url) {
  // YouTube
  const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/;
  const youtubeMatch = url.match(youtubeRegex);
  if (youtubeMatch) {
    return `https://img.youtube.com/vi/${youtubeMatch[1]}/mqdefault.jpg`;
  }

  // For other URLs, try to fetch og:image
  return new Promise((resolve) => {
    try {
      const urlObj = new URL(url);
      const options = {
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; DateIdeasBot/1.0)'
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
          if (data.length > 500000) {
            req.destroy();
          }
        });
        res.on('end', () => {
          const ogImageMatch = data.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
          if (ogImageMatch) {
            resolve(ogImageMatch[1]);
          } else {
            resolve(null);
          }
        });
      });

      req.on('error', () => resolve(null));
      req.setTimeout(3000, () => {
        req.destroy();
        resolve(null);
      });
      req.end();
    } catch {
      resolve(null);
    }
  });
}

// Get all ideas
app.get('/api/ideas', async (req, res) => {
  try {
    const ideas = await readData();
    res.json(ideas);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read ideas' });
  }
});

// Add new idea
app.post('/api/ideas', async (req, res) => {
  try {
    const { description, videoUrl, imageUrl, ratings, createdBy, notes, completed, comments } = req.body;

    if (!description) {
      return res.status(400).json({ error: 'Description required' });
    }

    const ideas = await readData();
    const newIdea = {
      id: Date.now().toString(),
      description,
      videoUrl: videoUrl || '',
      imageUrl: imageUrl || '',
      createdAt: Date.now(),
      ratings: ratings || { person1: 0, person2: 0 },
      createdBy: createdBy || null,
      notes: notes || '',
      completed: completed || false,
      comments: comments || []
    };

    ideas.push(newIdea);
    await writeData(ideas);

    res.json(newIdea);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add idea' });
  }
});

// Update idea
app.patch('/api/ideas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { description, videoUrl, imageUrl, ratings, notes, completed, comments } = req.body;

    let ideas = await readData();
    const ideaIndex = ideas.findIndex(i => i.id === id);

    if (ideaIndex === -1) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    const idea = ideas[ideaIndex];

    if (description !== undefined) idea.description = description;
    if (videoUrl !== undefined) idea.videoUrl = videoUrl;
    if (imageUrl !== undefined) idea.imageUrl = imageUrl;
    if (ratings !== undefined) idea.ratings = ratings;
    if (notes !== undefined) idea.notes = notes;
    if (completed !== undefined) idea.completed = completed;
    if (comments !== undefined) idea.comments = comments;

    ideas[ideaIndex] = idea;
    await writeData(ideas);

    res.json(idea);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update idea' });
  }
});

// Update rating
app.patch('/api/ideas/:id/rate', async (req, res) => {
  try {
    const { id } = req.params;
    const { person, rating } = req.body;
    
    if (!person || rating === undefined) {
      return res.status(400).json({ error: 'Person and rating required' });
    }
    
    if (rating < 0 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 0 and 5' });
    }
    
    let ideas = await readData();
    const idea = ideas.find(i => i.id === id);
    
    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    
    idea.ratings[person] = rating;
    await writeData(ideas);
    
    res.json(idea);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update rating' });
  }
});

// Delete idea
app.delete('/api/ideas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let ideas = await readData();
    
    ideas = ideas.filter(i => i.id !== id);
    await writeData(ideas);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete idea' });
  }
});

// Bulk update (for import)
app.post('/api/ideas/bulk', async (req, res) => {
  try {
    const { ideas } = req.body;

    if (!Array.isArray(ideas)) {
      return res.status(400).json({ error: 'Ideas must be an array' });
    }

    await writeData(ideas);
    res.json({ success: true, count: ideas.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to bulk update' });
  }
});

// Get all profiles (for login screen)
app.get('/api/profiles', async (req, res) => {
  try {
    const prefs = await readPreferences();
    const profiles = {
      person1: {
        id: 'person1',
        displayName: prefs.person1?.displayName || 'Partner 1'
      },
      person2: {
        id: 'person2',
        displayName: prefs.person2?.displayName || 'Partner 2'
      }
    };
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read profiles' });
  }
});

// Validate emoji code login (auto-detect user)
app.post('/api/auth/validate', async (req, res) => {
  try {
    const { emojiCode } = req.body;

    if (!Array.isArray(emojiCode) || emojiCode.length !== 4) {
      return res.status(400).json({ error: 'Invalid emoji code format' });
    }

    const prefs = await readPreferences();

    // Check both users to see which one matches
    for (const userId of ['person1', 'person2']) {
      const userPrefs = prefs[userId];
      const storedCode = userPrefs?.emojiCode || [];

      if (JSON.stringify(emojiCode) === JSON.stringify(storedCode)) {
        return res.json({ valid: true, user: userId });
      }
    }

    // No match found
    res.json({ valid: false });
  } catch (error) {
    res.status(500).json({ error: 'Failed to validate' });
  }
});

// Get user preferences
app.get('/api/preferences/:user', async (req, res) => {
  try {
    const { user } = req.params;

    if (!['person1', 'person2'].includes(user)) {
      return res.status(400).json({ error: 'Invalid user' });
    }

    const prefs = await readPreferences();
    res.json(prefs[user] || {
      displayName: 'Partner',
      emojiCode: ['🌈', '✨', '🎉', '💎'],
      mode: 'list',
      theme: 'blue',
      view: 'all',
      sort: 'date_desc'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to read preferences' });
  }
});

// Update user preferences
app.patch('/api/preferences/:user', async (req, res) => {
  try {
    const { user } = req.params;
    const { mode, theme, view, sort, displayName, emojiCode } = req.body;

    if (!['person1', 'person2'].includes(user)) {
      return res.status(400).json({ error: 'Invalid user' });
    }

    const prefs = await readPreferences();

    if (!prefs[user]) {
      prefs[user] = {
        displayName: 'Partner',
        emojiCode: ['🌈', '✨', '🎉', '💎'],
        mode: 'list',
        theme: 'blue',
        view: 'all',
        sort: 'date_desc'
      };
    }

    if (mode !== undefined) prefs[user].mode = mode;
    if (theme !== undefined) prefs[user].theme = theme;
    if (view !== undefined) prefs[user].view = view;
    if (sort !== undefined) prefs[user].sort = sort;
    if (displayName !== undefined) prefs[user].displayName = displayName;
    if (emojiCode !== undefined && Array.isArray(emojiCode) && emojiCode.length === 4) {
      prefs[user].emojiCode = emojiCode;
    }

    await writePreferences(prefs);
    res.json(prefs[user]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

// Configuration endpoints
app.get('/api/config', async (req, res) => {
  try {
    const config = await readConfig();
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read configuration' });
  }
});

app.patch('/api/config', async (req, res) => {
  try {
    const updates = req.body;
    const config = await readConfig();

    // Merge updates into config
    if (updates.imageCompression) {
      config.imageCompression = { ...config.imageCompression, ...updates.imageCompression };
    }
    if (updates.backup) {
      config.backup = { ...config.backup, ...updates.backup };
    }

    await writeConfig(config);
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update configuration' });
  }
});

// Backup and restore endpoints
app.post('/api/backup/create', async (req, res) => {
  try {
    const backupFile = await createBackup();
    res.json({ success: true, backup: path.basename(backupFile) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create backup' });
  }
});

app.get('/api/backup/list', async (req, res) => {
  try {
    const backups = await listBackups();
    res.json(backups);
  } catch (error) {
    res.status(500).json({ error: 'Failed to list backups' });
  }
});

app.post('/api/backup/restore', async (req, res) => {
  try {
    const { filename } = req.body;
    if (!filename) {
      return res.status(400).json({ error: 'Filename required' });
    }

    await restoreFromBackup(filename);
    res.json({ success: true, message: `Restored from ${filename}` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to restore backup' });
  }
});

app.get('/api/backup/download/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const backupPath = path.join(BACKUP_DIR, filename);

    // Security: prevent directory traversal
    if (!filename.startsWith('data-') || !filename.endsWith('.json')) {
      return res.status(400).json({ error: 'Invalid filename' });
    }

    await fs.access(backupPath);
    res.download(backupPath);
  } catch (error) {
    res.status(404).json({ error: 'Backup not found' });
  }
});

// Get local IP address - prioritize common home network ranges
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  const addresses = [];

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal (loopback) and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push({ address: iface.address, name });
      }
    }
  }

  // Priority order for home networks
  const priorities = [
    /^192\.168\.1\./,    // Most common home router default
    /^192\.168\.0\./,    // Second most common
    /^192\.168\.\d+\./,  // Any other 192.168.x.x
    /^10\.0\.0\./,       // Some routers use 10.x
    /^10\.\d+\.\d+\./,   // Any other 10.x.x.x
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // 172.16-31.x.x (private range)
  ];

  // Try to find best match based on priority
  for (const pattern of priorities) {
    const match = addresses.find(a => pattern.test(a.address));
    if (match) {
      return { address: match.address, allAddresses: addresses };
    }
  }

  // If no priority match, return first found
  if (addresses.length > 0) {
    return { address: addresses[0].address, allAddresses: addresses };
  }

  return { address: 'localhost', allAddresses: [] };
}

// Read ngrok config if it exists
async function readNgrokConfig() {
  try {
    const data = await fs.readFile(NGROK_CONFIG_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

// Create default ngrok config file
async function createDefaultNgrokConfig() {
  const defaultConfig = {
    authtoken: ""
  };
  await fs.writeFile(NGROK_CONFIG_FILE, JSON.stringify(defaultConfig, null, 2));
  console.log(`\n📝 Created ngrok.config.json`);
  console.log(`   Add your authtoken from: https://dashboard.ngrok.com/get-started/your-authtoken`);
}

// Start ngrok tunnel (optional)
async function startNgrokTunnel() {
  if (!ngrok) {
    console.log('💡 ngrok not available - install with: npm install ngrok');
    return null;
  }

  if (!USE_NGROK) {
    return null;
  }

  try {
    console.log(`🌍 Starting ngrok tunnel...`);

    // Try to load local ngrok config
    let ngrokConfig = await readNgrokConfig();

    // Priority order for authtoken:
    // 1. Environment variable NGROK_AUTHTOKEN
    // 2. Local ngrok.config.json file
    // 3. System ngrok config (handled by ngrok library automatically)

    let options = { addr: PORT };

    if (process.env.NGROK_AUTHTOKEN) {
      options.authtoken = process.env.NGROK_AUTHTOKEN;
      console.log('   Using authtoken from environment variable');
    } else if (ngrokConfig && ngrokConfig.authtoken && ngrokConfig.authtoken.trim()) {
      options.authtoken = ngrokConfig.authtoken.trim();
      console.log('   Using authtoken from ngrok.config.json');
    } else {
      console.log('   Using system ngrok configuration (~/.ngrok2/ngrok.yml)');
    }

    // Kill any existing ngrok process first to avoid conflicts
    try {
      await ngrok.kill();
    } catch (e) {
      // Ignore - no existing process
    }

    const url = await ngrok.connect(options);
    console.log(`✓ ngrok tunnel established: ${url}`);
    return url;
  } catch (error) {
    console.error('⚠️  ngrok tunnel failed:', error.message);
    console.error('   Note: ngrok setup is optional - tabled for later troubleshooting');

    // Provide helpful setup instructions
    console.log('\n' + '='.repeat(60));
    console.log('📝 NGROK SETUP REQUIRED');
    console.log('='.repeat(60));
    console.log('\nOption 1: Use environment variable (recommended)');
    console.log('   export NGROK_AUTHTOKEN="your_token_here"');
    console.log('   npm run remote');
    console.log('\nOption 2: Use ngrok.config.json file');
    console.log('   Create/edit ngrok.config.json with:');
    console.log('   { "authtoken": "your_token_here" }');
    console.log('\nOption 3: Use system ngrok config (easiest if already configured)');
    console.log('   ngrok config add-authtoken YOUR_TOKEN');
    console.log('   This saves to ~/.ngrok2/ngrok.yml or %USERPROFILE%\\.ngrok2\\ngrok.yml');
    console.log('   Then just run: npm run remote (no config file needed!)');
    console.log('\nGet your authtoken: https://dashboard.ngrok.com/get-started/your-authtoken');
    console.log('='.repeat(60) + '\n');

    return null;
  }
}

// Start server
Promise.all([initDataFile(), initPreferencesFile(), initConfigFile()]).then(async () => {
  app.listen(PORT, '0.0.0.0', async () => {
    const ipInfo = getLocalIP();
    const localUrl = `http://${ipInfo.address}:${PORT}`;

    console.log('\n' + '='.repeat(60));
    console.log('✨  What if we… is running!');
    console.log('='.repeat(60));
    console.log(`\n📱 On this computer: http://localhost:${PORT}`);
    console.log(`🌐 On same network:  ${localUrl}\n`);

    // Show all detected IPs if multiple found
    if (ipInfo.allAddresses.length > 1) {
      console.log('📍 All detected network addresses:');
      ipInfo.allAddresses.forEach(addr => {
        const marker = addr.address === ipInfo.address ? '→ ' : '  ';
        console.log(`${marker}http://${addr.address}:${PORT} (${addr.name})`);
      });
      console.log('   → = recommended address for your LAN\n');
    }

    console.log('📱 Scan with your phone:\n');
    qrcode.generate(localUrl, { small: true });

    // Try to start ngrok tunnel if requested
    const ngrokUrl = await startNgrokTunnel();
    if (ngrokUrl) {
      console.log('\n' + '='.repeat(60));
      console.log('🌍 REMOTE ACCESS (ngrok tunnel)');
      console.log('='.repeat(60));
      console.log(`\n🔗 Access from anywhere: ${ngrokUrl}`);
      console.log('📱 Share this link with your partner!\n');
      console.log('⚠️  Note: ngrok free tier has session limits');
      console.log('   → Sessions expire after inactivity');
      console.log('   → URL changes on each restart\n');
    } else if (!USE_NGROK && ngrok) {
      console.log('\n💡 Want remote access? Restart with: npm run remote');
    }

    console.log('\n' + '='.repeat(60));
    console.log('🚨 TROUBLESHOOTING: Can\'t access from other devices?');
    console.log('='.repeat(60));
    console.log('\n1. Try each network address shown above');
    console.log('   • If multiple IPs listed, try them all');
    console.log('   • The recommended (→) one should work best');
    console.log('\n2. Check your firewall:');
    console.log('   • Make sure port 3000 is allowed through your firewall');
    console.log('   • On Mac: System Preferences → Security → Firewall');
    console.log('   • On Windows: Windows Defender Firewall → Allow an app');
    console.log('   • On Linux: sudo ufw allow 3000/tcp');
    console.log('\n3. Verify devices are on the SAME Wi-Fi network');
    console.log('\n4. Use the ngrok URL above for remote access (no LAN needed)');
    console.log('\n' + '='.repeat(60) + '\n');
  });
});
