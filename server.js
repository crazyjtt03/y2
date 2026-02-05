
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 80;
const DATA_FILE = path.join(__dirname, 'story.json');

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Allow large payloads for images/music
app.use(express.static(path.join(__dirname, 'dist')));

// Initialize data file if not exists
const DEFAULT_DATA = {
    nickname: '宝贝',
    letter: '此时此刻，我的心里乱极了...',
    promises: ['再生气也不冷战...', '学会换位思考...', '每天都要给你一个早安吻...'],
    photos: [],
    showPhotos: true,
    showPromises: true,
    bgMusicUrl: '',
    showMusic: true
};

// Helper: Ensure valid data exists
function ensureDataFile() {
    let shouldWrite = false;
    if (!fs.existsSync(DATA_FILE)) {
        shouldWrite = true;
    } else {
        try {
            const content = fs.readFileSync(DATA_FILE, 'utf8');
            if (!content || content.trim() === '') {
                shouldWrite = true;
            } else {
                JSON.parse(content); // Test parse
            }
        } catch (e) {
            console.warn('Data file corrupted or empty, resetting to default.');
            shouldWrite = true;
        }
    }

    if (shouldWrite) {
        fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_DATA, null, 2));
    }
}

// Initialize on startup
ensureDataFile();

// API Routes
app.get('/api/story', (req, res) => {
    try {
        ensureDataFile(); // Double check before read
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        console.error('Error reading story data:', err);
        // Fallback to default in memory if file read fails hard
        res.json(DEFAULT_DATA);
    }
});

app.post('/api/story', (req, res) => {
    try {
        const newData = req.body;
        fs.writeFileSync(DATA_FILE, JSON.stringify(newData, null, 2));
        res.json({ success: true, message: 'Data saved successfully' });
    } catch (err) {
        console.error('Error saving story data:', err);
        res.status(500).json({ error: 'Failed to save data' });
    }
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
