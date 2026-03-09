import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/chat', async (req, res) => {
    try {
        const { messages } = req.body;
        const apiKey = process.env.OPENROUTER_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: 'AI API Key not configured on server' });
        }

        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: 'openrouter/free',
            messages: messages
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:5173',
                'X-Title': 'Vithartha Assistant'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('AI Proxy Error:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: 'Failed to fetch AI response',
            details: error.response?.data || error.message
        });
    }
});

export default router;
