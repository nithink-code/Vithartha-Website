import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/chat', async (req, res) => {
    try {
        const { messages } = req.body;
        const apiKey = process.env.OPENROUTER_API_KEY || process.env.VITE_OPENROUTER_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                error: 'AI Config Error',
                message: 'OPENROUTER_API_KEY is missing from Vercel environment variables.'
            });
        }

        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: 'mistralai/mistral-7b-instruct:free',
            messages: messages
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey.trim()}`,
                'HTTP-Referer': 'https://vithartha-website.vercel.app',
                'X-Title': 'Vithartha Assistant'
            }
        });

        res.json(response.data);
    } catch (error) {
        const errorData = error.response?.data;
        console.error('AI Proxy Error:', errorData || error.message);

        if (error.response?.status === 401) {
            return res.status(401).json({
                error: 'AI API Key Rejected',
                message: 'The OpenRouter API key in Vercel settings is invalid or has expired.'
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
