const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cheerio = require('cheerio'); // HTML পার্স করার জন্য

const app = express();
app.use(cors());

// আপনার কুকি তথ্য
const COOKIE_STRING = 'XSRF-TOKEN=eyJpdiI6Ii9QenZVdER5dTN5SnlCZkJ4N1RqZFE9PSIsInZhbHVlIjoiTEdlTGZ5MGN1aXFaVmFxa2hqaEdNU0ROUlczK0hXZnBlVGRTMEpxTTNQdEJ0YUR4aElEODJPNDJ0VFg1NDZDNHlFK1lEVG94TEhYZ3lzQU5xY2Q4NUZDdjkyTmtVVFpqa0FzeG43NDFNQ0M0b3ZGNE9NeFFBRUxPWllJbEI1dXYiLCJtYWMiOiJhNGNjMDg1NWEzNGQ3ZmRmYmM3ZGZhNzRhMTQ5YjkwNGQzMTQ0ZTY4NjdjNWJjN2QwZDIzOTk4Nzc3NGEzYjg2IiwidGFnIjoiIn0%3D; augestel-session=eyJpdiI6ImpGN3NESkUvakZlNGxEYWpxOTlCNkE9PSIsInZhbHVlIjoieXBiMStqWW9GMSs0SE54Nk5LTmZJVXhibFQ4UjhucEhiVTdvR1RNaC80QkQ0VmM2S0w1TU51K3Uzc3JVYUJyTmRmQ3Brbk1OVUlSK0hMZWF2UjJIRmJYdjh3eTBjNGU0UFk2MGZCOVViSWZNb2JITE5kOWUyU1hEM09EV01XOFMiLCJtYWMiOiI1ZTVhNmIwOGZiZWI4ZjYxNGZkNmVjNGQ2YzRmNjkxNjU0MjZmNx42MzE5MWVmOGU0YTgyZGM4NDc3ZGMzMDJkIiwidGFnIjoiIn0%3D';

app.get('/api/live-otp', async (req, res) => {
    try {
        const response = await axios.get('https://augestel.com/Sw/live-test-sms', {
            headers: {
                'Cookie': COOKIE_STRING,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            }
        });

        // যদি রেসপন্স ডাটা স্ট্রিং বা এইচটিএমএল হয়
        let extractedMessages = [];

        if (typeof response.data === 'string') {
            const $ = cheerio.load(response.data);
            
            // এইচটিএমএল থেকে কার্ড ডাটা স্ক্র্যাপ করা
            $('.card, .message-row, tr, div').each((i, el) => {
                const text = $(el).text();
                if (text.toLowerCase().includes('whatsapp') || text.toLowerCase().includes('telegram')) {
                    extractedMessages.push({
                        country: $(el).find('.country, strong, h5').first().text().trim() || 'LIVE OTP',
                        phone: $(el).find('.phone, .number').first().text().trim() || 'N/A',
                        message: text.trim()
                    });
                }
            });
        } else if (Array.isArray(response.data)) {
            extractedMessages = response.data.filter(item => {
                const str = JSON.stringify(item).toLowerCase();
                return str.includes('whatsapp') || str.includes('telegram');
            });
        }

        res.json({ success: true, data: extractedMessages });

    } catch (error) {
        console.error('Error fetching live data:', error.message);
        res.status(500).json({ success: false, error: 'কুকির মেয়াদ শেষ হতে পারে অথবা রিকোয়েস্ট ব্লক হয়েছে।' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
                
