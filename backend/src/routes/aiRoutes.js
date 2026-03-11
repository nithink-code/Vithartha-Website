import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/ping', (req, res) => {
    res.json({ message: 'AI Route is working' });
});

router.get('/debug-env', (req, res) => {
    res.json({
        OPENROUTER_API_KEY_PRESENT: !!process.env.OPENROUTER_API_KEY,
        VITE_OPENROUTER_API_KEY_PRESENT: !!process.env.VITE_OPENROUTER_API_KEY,
        NODE_ENV: process.env.NODE_ENV,
        message: 'Debug route for checking environment variables. Do not expose actual keys.'
    });
});

router.post('/chat', async (req, res) => {
    try {
        const { messages } = req.body;
        let apiKey = process.env.OPENROUTER_API_KEY || process.env.VITE_OPENROUTER_API_KEY;

        console.log("Checking AI Config:");
        console.log("OPENROUTER_API_KEY present:", !!process.env.OPENROUTER_API_KEY);
        console.log("VITE_OPENROUTER_API_KEY present:", !!process.env.VITE_OPENROUTER_API_KEY);
        console.log("NODE_ENV:", process.env.NODE_ENV);

        if (!apiKey) {
            return res.status(500).json({
                error: 'AI Config Error',
                message: 'OPENROUTER_API_KEY is missing from Render environment variables.'
            });
        }

        // Sanitize the key: clean whitespace and remove accidental 'Bearer ' prefix
        apiKey = apiKey.trim();
        if (apiKey.startsWith('Bearer ')) {
            apiKey = apiKey.replace('Bearer ', '').trim();
        }

        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: 'mistralai/mistral-7b-instruct:free',
            messages: messages
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': 'https://vithartha.com',
                'X-Title': 'Vithartha AI'
            }
        });

        res.json(response.data);
    } catch (error) {
        const errorData = error.response?.data;
        console.error('AI Proxy Error:', errorData || error.message);

        if (error.response?.status === 401) {
            const detail = error.response?.data?.error?.message || 'Invalid or expired API key.';
            return res.status(401).json({
                error: 'AI API Key Rejected',
                message: `OpenRouter Error: ${detail}`
            });
        }

        res.status(error.response?.status || 500).json({
            error: 'AI Assistant Error',
            message: 'Encountered an error with the AI service.',
            debug: errorData || error.message
        });
    }
});

export default router;
