const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const https = require('https');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.json());
app.use(express.static('public'));

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
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
        tags: ['class', 'hands-on', 'creative'],
        ratings: { person1: 4, person2: 5 },
        notes: []
      },
      {
        id: '2',
        description: 'Try the new sushi restaurant downtown',
        videoUrl: '',
        imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1200&auto=format&fit=crop',
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 4,
        tags: ['food', 'night-out'],
        ratings: { person1: 5, person2: 4 },
        notes: []
      },
      {
        id: '3',
        description: 'Escape room adventure',
        videoUrl: 'https://youtu.be/3GwjfUFyY6M',
        imageUrl: '',
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
        tags: ['game', 'puzzle', 'indoor'],
        ratings: { person1: 2, person2: 5 },
        notes: []
      },
      {
        id: '4',
        description: 'Wine tasting at the local vineyard',
        videoUrl: '',
        imageUrl: '',
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
        tags: ['outdoors', 'day-trip', 'relaxed'],
        ratings: { person1: 0, person2: 0 },
        notes: []
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

// Write data
async function writeData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
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
    const { description, videoUrl, imageUrl, tags, ratings } = req.body;
    
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
      tags: Array.isArray(tags) ? tags : [],
      ratings: ratings || { person1: 0, person2: 0 },
      notes: []
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
    const { description, videoUrl, imageUrl, tags, ratings } = req.body;
    
    let ideas = await readData();
    const ideaIndex = ideas.findIndex(i => i.id === id);
    
    if (ideaIndex === -1) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    
    const idea = ideas[ideaIndex];
    
    if (description !== undefined) idea.description = description;
    if (videoUrl !== undefined) idea.videoUrl = videoUrl;
    if (imageUrl !== undefined) idea.imageUrl = imageUrl;
    if (tags !== undefined) idea.tags = Array.isArray(tags) ? tags : [];
    if (ratings !== undefined) idea.ratings = ratings;
    
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

// Start server
initDataFile().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n✨ What if we… is running!`);
    console.log(`\n📱 Access from this device: http://localhost:${PORT}`);
    console.log(`📱 Access from other devices: http://YOUR_LOCAL_IP:${PORT}\n`);
  });
});
