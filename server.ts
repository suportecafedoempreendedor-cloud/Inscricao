import express from 'express';
import { createServer as createViteServer } from 'vite';
import {
  getAllRegistrations,
  getRegistrationByCode,
  insertRegistration,
  updateRegistrationStatus,
  getAllExhibitors,
  insertExhibitor,
  getAllPaymentProofs,
  insertPaymentProof,
  getCertificateByCode,
  getOrCreateUser,
} from './src/db/queries.js';
import { requireAuth, AuthRequest } from './src/middleware/auth.js';

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '15mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'cafe-do-empreendedor-api' });
});

// Sync / Register authenticated user
app.post('/api/auth/sync', requireAuth, async (req: AuthRequest, res) => {
  try {
    const user = req.user!;
    const dbUser = await getOrCreateUser(user.uid, user.email || '', user.name);
    res.json({ success: true, user: dbUser });
  } catch (error: any) {
    console.error('Failed to sync user:', error);
    res.status(500).json({ error: error.message || 'Erro ao sincronizar utilizador' });
  }
});

// Registrations API
app.get('/api/registrations', async (req, res) => {
  try {
    const list = await getAllRegistrations();
    res.json(list);
  } catch (error: any) {
    console.error('Failed to fetch registrations:', error);
    res.status(500).json({ error: error.message || 'Erro ao carregar inscrições' });
  }
});

app.get('/api/registrations/:code', async (req, res) => {
  try {
    const reg = await getRegistrationByCode(req.params.code);
    if (!reg) {
      return res.status(404).json({ error: 'Inscrição não encontrada' });
    }
    res.json(reg);
  } catch (error: any) {
    console.error('Failed to get registration:', error);
    res.status(500).json({ error: error.message || 'Erro ao consultar inscrição' });
  }
});

app.post('/api/registrations', async (req, res) => {
  try {
    const created = await insertRegistration(req.body);
    res.status(201).json(created);
  } catch (error: any) {
    console.error('Failed to create registration:', error);
    res.status(500).json({ error: error.message || 'Erro ao gravar inscrição' });
  }
});

app.patch('/api/registrations/:id/status', async (req, res) => {
  try {
    const { status, notes } = req.body;
    const updated = await updateRegistrationStatus(req.params.id, status, notes);
    res.json(updated);
  } catch (error: any) {
    console.error('Failed to update registration status:', error);
    res.status(500).json({ error: error.message || 'Erro ao atualizar estado' });
  }
});

// Exhibitors API
app.get('/api/exhibitors', async (req, res) => {
  try {
    const list = await getAllExhibitors();
    res.json(list);
  } catch (error: any) {
    console.error('Failed to fetch exhibitors:', error);
    res.status(500).json({ error: error.message || 'Erro ao carregar expositores' });
  }
});

app.post('/api/exhibitors', async (req, res) => {
  try {
    const created = await insertExhibitor(req.body);
    res.status(201).json(created);
  } catch (error: any) {
    console.error('Failed to create exhibitor:', error);
    res.status(500).json({ error: error.message || 'Erro ao gravar expositor' });
  }
});

// Payment Proofs API
app.get('/api/payment-proofs', async (req, res) => {
  try {
    const list = await getAllPaymentProofs();
    res.json(list);
  } catch (error: any) {
    console.error('Failed to fetch payment proofs:', error);
    res.status(500).json({ error: error.message || 'Erro ao carregar comprovativos' });
  }
});

app.post('/api/payment-proofs', async (req, res) => {
  try {
    const created = await insertPaymentProof(req.body);
    res.status(201).json(created);
  } catch (error: any) {
    console.error('Failed to submit payment proof:', error);
    res.status(500).json({ error: error.message || 'Erro ao submeter comprovativo' });
  }
});

// Certificate Verification API
app.get('/api/certificates/verify/:code', async (req, res) => {
  try {
    const cert = await getCertificateByCode(req.params.code);
    if (!cert) {
      return res.status(404).json({ error: 'Certificado não encontrado' });
    }
    res.json(cert);
  } catch (error: any) {
    console.error('Failed to verify certificate:', error);
    res.status(500).json({ error: error.message || 'Erro ao validar certificado' });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
