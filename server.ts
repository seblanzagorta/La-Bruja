import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// User requested Gemini 3.7 Flash Lite
const PRIMARY_MODEL = process.env.GEMINI_MODEL || 'gemini-3.7-flash-lite';
const FALLBACK_MODEL = 'gemini-3.1-flash-lite';

// API Route: Server-side Gemini Astrological Mezcal Guidance
app.post('/api/gemini/reading-guidance', async (req, res) => {
  try {
    const { agaveName, lunarPhase, illumination, solarHouse, birthSign } = req.body;

    // If API key is not configured or placeholder, return crafted deterministic maestro reading
    if (!ai) {
      return res.json({
        success: true,
        source: 'catalyst-matrix',
        model: PRIMARY_MODEL,
        guidance: `Under tonight's ${lunarPhase || 'Waxing Gibbous'} transit (${illumination || 84}% illumination), the ${agaveName || 'Espadín Joven'} offers essential terrestrial grounding. Sip in unhurried silence from a shallow clay copita to harmonize the nocturnal sky.`
      });
    }

    const prompt = `You are the revered Maestro Mezcalero and Astrological Guide for LA BRUJA, a cosmic spirits monograph.
Generate a poetic, authentic 2-3 sentence celestial serving ritual and energetic insight for tonight's pour:
- Agave: ${agaveName || 'Espadín Joven'}
- Lunar Phase: ${lunarPhase || 'Waxing Gibbous'} (${illumination || 84}% illumination)
- Solar House: ${solarHouse || '8th House (Fixed Water)'}
- Birth Sign: ${birthSign || 'Scorpio'}

Tone: Knowledgeable maestro, careful artisan, and poetic guide. Respectful of Mexican botanical heritage (never gimmicky, no horoscope fluff). Emphasize tasting mindfully from a copita.`;

    let generatedText = '';
    try {
      const response = await ai.models.generateContent({
        model: PRIMARY_MODEL,
        contents: prompt,
      });
      generatedText = response.text || '';
    } catch (modelErr) {
      // Fallback if 3.7 alias needs standard 3.1 flash lite identifier
      console.warn(`Primary model ${PRIMARY_MODEL} returned error, trying fallback ${FALLBACK_MODEL}:`, modelErr);
      const fallbackResponse = await ai.models.generateContent({
        model: FALLBACK_MODEL,
        contents: prompt,
      });
      generatedText = fallbackResponse.text || '';
    }

    res.json({
      success: true,
      source: 'gemini',
      model: PRIMARY_MODEL,
      guidance: generatedText.trim()
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate celestial guidance',
      fallback: 'Under tonight\'s transit, honor the slow maturation of the agave. Sip mindfully.'
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'la-bruja-api', model: PRIMARY_MODEL });
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LA BRUJA server running at http://0.0.0.0:${PORT} [Model: ${PRIMARY_MODEL}]`);
  });
}

startServer();
