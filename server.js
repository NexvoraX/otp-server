const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

// আপনার কুকি সংমিশ্রণ
const COOKIE_STRING = 'XSRF-TOKEN=eyJpdiI6Ii9QenZVdER5dTN5SnlCZkJ4N1RqZFE9PSIsInZhbHVlIjoiTEdlTGZ5MGN1aXFaVmFxa2hqaEdNU0ROUlczK0hXZnBlVGRTMEpxTTNQdEJ0YUR4aElEODJPNDJ0VFg1NDZDNHlFK1lEVG94TEhYZ3lzQU5xY2Q4NUZDdjkyTmtVVFpqa0FzeG43NDFNQ0M0b3ZGNE9NeFFBRUxPWllJbEI1dXYiLCJtYWMiOiJhNGNjMDg1NWEzNGQ3ZmRmYmM3ZGZhNzRhMTQ5YjkwNGQzMTQ0ZTY4NjdjNWJjN2QwZDIzOTk4Nzc3NGEzYjg2IiwidGFnIjoiIn0%3D; augestel-session=eyJpdiI6ImpGN3NESkUvakZlNGxEYWpxOTlCNkE9PSIsInZhbHVlIjoieXBiMStqWW9GMSs0SE54Nk5LTmZJVXhibFQ4UjhucEhiVTdvR1RNaC80QkQ0VmM2S0w1TU51K3Uzc3JVYUJyTmRmQ3Brbk1OVUlSK0hMZWF2UjJIRmJYdjh3eTBjNGU0UFk2MGZCOVViSWZNb2JITE5kOWUyU1hEM09EV01XOFMiLCJtYWMiOiI1ZTVhNmIwOGZiZWI4ZjYxNGZkNmVjNGQ2YzRmNjkxNjU0MjZmNx42MzE5MWVmOGU0YTgyZGM4NDc3ZGMzMDJkIiwidGFnIjoiIn0%3D';

app.get('/api/live-otp', async (req, res) => {
    try {
        // augestel.com থেকে ওটিপি লিস্ট আনবে
        const response = await axios.get('https://augestel.com/Sw/live-test-sms', {
            headers: {
                'Cookie': COOKIE_STRING,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        const rawData = response.data;

        // শুধুমাত্র WhatsApp এবং Telegram এর ডাটা ফিল্টার করা
        let filteredList = [];
        if (Array.isArray(rawData)) {
            filteredList = rawData.filter(item => {
                const text = JSON.stringify(item).toLowerCase();
                return text.includes('whatsapp') || text.includes('telegram');
            });
        }

        res.json({ success: true, data: filteredList });
    } catch (error) {
        console.error('Error fetching live data:', error.message);
        res.status(500).json({ success: false, error: 'ডাটা লোড করতে সমস্যা হয়েছে বা কুকির মেয়াদ শেষ।' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
