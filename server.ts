import express, { Request, Response } from 'express';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent header as required by guidelines
const geminiApiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (geminiApiKey) {
  aiClient = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const SYSTEM_INSTRUCTION = `You are a helpful, empathetic assistant for immigrant parents of autistic children in Denmark. Your job is to explain Danish social laws, specifically 'Barnets Lov' (which covers children) and relevant parts of 'Serviceloven'. You must understand terms like:
- PPR (Pædagogisk Psykologisk Rådgivning)
- VISO (national advisory board)
- Merudgifter (Barnets Lov § 86 - covering extra costs)
- Tabt arbejdsfortjeneste (Barnets Lov § 87 - lost earnings)
- Aflastning (Relief care).
Always explain concepts in plain language. If asked about a myth, gently fact-check it. Always end by reminding the user to contact their local Kommune sagsbehandler (case worker) for official decisions.`;

// Curated Danish legal fact-checking responses for instant fallback
const LEGAL_FALLBACKS: Record<string, string> = {
  ppr: `PPR stands for Pædagogisk Psykologisk Rådgivning (Educational-Psychological Advisory Service). Every Danish municipality has a PPR office.

• What they do: PPR evaluates whether your child needs extra pedagogical support, special teaching materials, or placement in a specialized small-group class (specialklasse or specialskole).
• How to start: Usually initiated through your child's daycare (daginstitution) or school. You can also contact PPR directly as a parent.
• Your rights: You have the right to receive draft evaluation reports (PPV) before meetings, and the right to a free certified interpreter (Forvaltningsloven § 7) and a support person (bisidder).

Always reach out to your child's daycare pedagogue or your local Kommune PPR office to begin an assessment.`,

  lost_work: `Yes, under Barnets Lov § 87, parents can apply for compensation for lost earnings (Tabt arbejdsfortjeneste).

• Who qualifies: If caring for your child at home—or accompanying them to frequent hospital, psychiatric, or therapy appointments—prevents you from working your normal job hours.
• Medical basis: A medical diagnosis or ongoing clinical assessment showing significant and permanent impairment.
• Important note: This is not based on your family income; it compensates your actual lost wage up to a national legal cap.

Please speak directly with your family case worker (sagsbehandler) in your Kommune to request an application form for Barnets Lov § 87.`,

  school_rights: `Under Danish Folkeskoleloven and Barnets Lov, your child has the legal right to an education adapted to their developmental and sensory needs.

• Support Hours: If your child needs 9 hours or less of weekly support, the school principal decides this internally. If more than 9 hours or special school is needed, PPR must conduct a formal PPV evaluation.
• Special Classes (Specialklasser): Small classes (typically 4-8 students) with lower sensory stimulation and specialized pedagogues.
• Free Transportation: If your child attends a specialized school outside your walking district, the municipality must provide free door-to-door taxi or bus transport (skolekørsel).

Ask your school leadership or sagsbehandler to arrange a network meeting (netværksmøde) with PPR to review your child's educational plan.`,

  merudgifter: `Under Barnets Lov § 86, you can receive reimbursement for necessary extra expenses (Merudgifter) caused by your child's autism or disability.

• What is covered: Sensory equipment (weighted blankets, timers, ear defenders), special clothing (seamless socks, extra shoe wear), specialized medicine, and extra transport to treatments.
• Threshold: Expenses must exceed the national minimum threshold (approx. 5,500 DKK per year total).
• Tip: Always keep every receipt and documentation of medical recommendation!

Submit your list of extra disability expenses to your Kommune's handicap/family department under Barnets Lov § 86.`
};

/**
 * AI Rights & Fact-Checker Endpoint
 */
app.post('/api/rights-assistant', async (req: Request, res: Response) => {
  try {
    const { message, language = 'en' } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    // If Gemini API is configured, call Gemini 3.8 Flash model
    if (aiClient) {
      const promptWithLanguage = `${message}\n\nPlease respond in ${language}. Ensure the explanation is clear, empathetic, and uses plain language.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptWithLanguage,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      const replyText = response.text || '';
      res.json({ reply: replyText });
      return;
    }

    // High-accuracy fallback when running in environment without GEMINI_API_KEY
    const lower = message.toLowerCase();
    let reply = '';

    if (lower.includes('ppr') || lower.includes('evaluation') || lower.includes('assessment')) {
      reply = LEGAL_FALLBACKS.ppr;
    } else if (lower.includes('work') || lower.includes('tabt') || lower.includes('arbejdsfortjeneste') || lower.includes('salary') || lower.includes('earnings')) {
      reply = LEGAL_FALLBACKS.lost_work;
    } else if (lower.includes('school') || lower.includes('skole') || lower.includes('specialklasse') || lower.includes('rights')) {
      reply = LEGAL_FALLBACKS.school_rights;
    } else if (lower.includes('merudgift') || lower.includes('blanket') || lower.includes('cost') || lower.includes('expense') || lower.includes('receipt')) {
      reply = LEGAL_FALLBACKS.merudgifter;
    } else {
      reply = `Thank you for your question about Danish social and special needs legislation. Under Barnets Lov (Children's Act) and Serviceloven, immigrant parents have protected statutory rights:

1. Right to an official interpreter (Forvaltningsloven § 7) during all meetings with PPR and case workers.
2. Right to a support advocate (Bisidder) to take notes and support you.
3. Access to Barnets Lov § 86 (Extra disability costs) and § 87 (Lost earnings compensation).

Always remember to contact your local Kommune sagsbehandler (case worker) for official decisions regarding your child's specific case.`;
    }

    res.json({ reply });
  } catch (error) {
    console.error('Error in /api/rights-assistant:', error);
    res.status(500).json({ 
      error: 'Failed to generate rights advice',
      reply: 'An error occurred while consulting the Danish legal knowledge base. Please check back shortly or consult your municipality sagsbehandler.'
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    const distPath = fileURLToPath(new URL('./dist', import.meta.url));
    const indexPath = fileURLToPath(new URL('./dist/index.html', import.meta.url));
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(indexPath);
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AutismDK server running on http://localhost:${PORT}`);
  });
}

startServer();
