import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { zValidator } from '@hono/zod-validator';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';
import {
  agenceService,
  carnetService,
  clientService,
  mouvementService,
  reportingService,
  societeService,
  utilisateurService
} from '../lib/data-access';
import {
  AgenceCreateSchema,
  AgenceSchema,
  AgenceUpdateSchema,
  CarnetCreateSchema,
  CarnetSchema,
  ClientTotineCreateWithInitSchema,
  ClientTotineSchema,
  ClientTotineUpdateSchema,
  MouvementTotineCreateSchema,
  MouvementTotineSchema,
  SocieteCreateSchema,
  SocieteSchema,
  SocieteUpdateSchema,
  UtilisateurCreateSchema,
  UtilisateurSchema,
  UtilisateurUpdateSchema
} from '../lib/validations';
import { authService } from '../lib/auth';
import { jwtGuard } from '../lib/middleware';

const app = new Hono();

// --- MIDDLEWARE ---
app.use('*', cors());

// --- AUTH ENDPOINTS (PUBLIC) ---
app.post(
  '/auth/register',
  zValidator('json', z.object({
    email: z.string().email(),
    password: z.string().min(6),
    nom: z.string(),
    telephone: z.string().optional(),
    role: z.enum(['ADMIN', 'CAISSIER', 'COLLECTEUR']).optional(),
    agenceId: z.number().optional(),
    societeId: z.number().optional()
  })),
  async (c) => {
    const body = c.req.valid('json');

    // Check if user already exists
    const existing = await utilisateurService.findByEmail(body.email);
    if (existing) {
      throw new HTTPException(400, { message: 'User already exists with this email' });
    }

    // Hash password
    const motDePasseHash = await authService.hashPassword(body.password);

    // Create user
    const user = await utilisateurService.create({
      email: body.email,
      motDePasseHash,
      nom: body.nom,
      telephone: body.telephone,
      role: body.role || 'CAISSIER',
      agenceId: body.agenceId,
      societeId: body.societeId
    });

    // Remove password hash from response
    const { motDePasseHash: _, ...userWithoutPassword } = user;
    return c.json(userWithoutPassword);
  }
);

app.post(
  '/auth/login',
  zValidator('json', z.object({
    email: z.string().email(),
    password: z.string()
  })),
  async (c) => {
    const body = c.req.valid('json');

    // Find user
    const user = await utilisateurService.findByEmail(body.email);
    if (!user) {
      throw new HTTPException(401, { message: 'Invalid credentials' });
    }

    // Verify password
    const isPasswordValid = await authService.comparePassword(body.password, user.motDePasseHash);
    if (!isPasswordValid) {
      throw new HTTPException(401, { message: 'Invalid credentials' });
    }

    // Update last login
    await utilisateurService.updateLastLogin(user.id);

    // Generate tokens
    const accessToken = await authService.generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      agenceId: user.agenceId || undefined,
      societeId: user.societeId || undefined
    });

    const refreshToken = await authService.generateRefreshToken(user.id);

    return c.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        nom: user.nom,
        role: user.role,
        agenceId: user.agenceId,
        societeId: user.societeId
      }
    });
  }
);

app.post(
  '/auth/refresh',
  zValidator('json', z.object({
    refreshToken: z.string()
  })),
  async (c) => {
    const body = c.req.valid('json');

    try {
      // Verify refresh token
      const decoded = await authService.verifyRefreshToken(body.refreshToken);
      const userId = decoded.userId;

      // Get fresh user data
      const user = await utilisateurService.getById(userId);
      if (!user || !user.isActive) {
        throw new HTTPException(401, { message: 'User not found or inactive' });
      }

      // Generate new access token
      const accessToken = await authService.generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role,
        agenceId: user.agenceId || undefined,
        societeId: user.societeId || undefined
      });

      return c.json({ accessToken });
    } catch (error) {
      throw new HTTPException(401, { message: 'Invalid refresh token' });
    }
  }
);

// --- JWT GUARD MIDDLEWARE - Protects all routes below ---
app.use('/societe/*', jwtGuard());
app.use('/agence/*', jwtGuard());
app.use('/utilisateur/*', jwtGuard());
app.use('/client/*', jwtGuard());
app.use('/carnet/*', jwtGuard());
app.use('/transaction/*', jwtGuard());
app.use('/stats/*', jwtGuard());

// --- SOCIETE ROUTES ---
app.post(
  '/societe',
  zValidator('json', SocieteCreateSchema),
  async (c) => {
    const body = c.req.valid('json');
    const result = await societeService.create(body);
    return c.json(result);
  }
);

app.get('/societe', async (c) => {
  const result = await societeService.getAll();
  return c.json(result);
});

app.get(
  '/societe/:id',
  zValidator('param', z.object({ id: z.coerce.number() })),
  async (c) => {
    const { id } = c.req.valid('param');
    const societe = await societeService.getById(id);
    if (!societe) {
      throw new HTTPException(404, { message: 'SociÃ©tÃ© not found' });
    }
    return c.json(societe);
  }
);

app.put(
  '/societe/:id',
  zValidator('param', z.object({ id: z.coerce.number() })),
  zValidator('json', SocieteUpdateSchema),
  async (c) => {
    const { id } = c.req.valid('param');
    const body = c.req.valid('json');
    const result = await societeService.update(id, body);
    return c.json(result);
  }
);

app.delete(
  '/societe/:id',
  zValidator('param', z.object({ id: z.coerce.number() })),
  async (c) => {
    const { id } = c.req.valid('param');
    const result = await societeService.delete(id);
    return c.json(result);
  }
);

// --- AGENCE ROUTES ---
app.post(
  '/agence',
  zValidator('json', AgenceCreateSchema),
  async (c) => {
    const body = c.req.valid('json');
    const result = await agenceService.create(body);
    return c.json(result);
  }
);

app.get('/agence', async (c) => {
  const result = await agenceService.getAll();
  return c.json(result);
});

app.get(
  '/agence/:id',
  zValidator('param', z.object({ id: z.coerce.number() })),
  async (c) => {
    const { id } = c.req.valid('param');
    const agence = await agenceService.getById(id);
    if (!agence) {
      throw new HTTPException(404, { message: 'Agence not found' });
    }
    return c.json(agence);
  }
);

app.put(
  '/agence/:id',
  zValidator('param', z.object({ id: z.coerce.number() })),
  zValidator('json', AgenceUpdateSchema),
  async (c) => {
    const { id } = c.req.valid('param');
    const body = c.req.valid('json');
    const result = await agenceService.update(id, body);
    return c.json(result);
  }
);

app.delete(
  '/agence/:id',
  zValidator('param', z.object({ id: z.coerce.number() })),
  async (c) => {
    const { id } = c.req.valid('param');
    const result = await agenceService.delete(id);
    return c.json(result);
  }
);

// --- UTILISATEUR ROUTES ---
app.post(
  '/utilisateur',
  zValidator('json', UtilisateurCreateSchema),
  async (c) => {
    const body = c.req.valid('json');
    const result = await utilisateurService.create(body);
    return c.json(result);
  }
);

app.get('/utilisateur', async (c) => {
  const result = await utilisateurService.getAll();
  return c.json(result);
});

app.get(
  '/utilisateur/:id',
  zValidator('param', z.object({ id: z.coerce.number() })),
  async (c) => {
    const { id } = c.req.valid('param');
    const utilisateur = await utilisateurService.getById(id);
    if (!utilisateur) {
      throw new HTTPException(404, { message: 'Utilisateur not found' });
    }
    return c.json(utilisateur);
  }
);

app.put(
  '/utilisateur/:id',
  zValidator('param', z.object({ id: z.coerce.number() })),
  zValidator('json', UtilisateurUpdateSchema),
  async (c) => {
    const { id } = c.req.valid('param');
    const body = c.req.valid('json');
    const result = await utilisateurService.update(id, body);
    return c.json(result);
  }
);

app.delete(
  '/utilisateur/:id',
  zValidator('param', z.object({ id: z.coerce.number() })),
  async (c) => {
    const { id } = c.req.valid('param');
    const result = await utilisateurService.delete(id);
    return c.json(result);
  }
);

app.get(
  '/utilisateur/:id/full',
  zValidator('param', z.object({ id: z.coerce.number() })),
  async (c) => {
    const { id } = c.req.valid('param');
    const result = await utilisateurService.getFullInfo(id);
    return c.json(result);
  }
);

// --- CLIENT ROUTES ---
app.post(
  '/client',
  zValidator('json', ClientTotineCreateWithInitSchema),
  async (c) => {
    const body = c.req.valid('json');
    const result = await clientService.create(body);
    return c.json(result);
  }
);

app.get('/client', async (c) => {
  const result = await clientService.getAll();
  return c.json(result);
});

app.get(
  '/client/:id',
  zValidator('param', z.object({ id: z.coerce.number() })),
  async (c) => {
    const { id } = c.req.valid('param');
    const result = await clientService.getFullInfo(id);
    return c.json(result);
  }
);

app.put(
  '/client/:id',
  zValidator('param', z.object({ id: z.coerce.number() })),
  zValidator('json', ClientTotineUpdateSchema),
  async (c) => {
    const { id } = c.req.valid('param');
    const body = c.req.valid('json');
    const result = await clientService.update(id, body);
    return c.json(result);
  }
);

// --- CARNET ROUTES ---
app.post(
  '/carnet',
  zValidator('json', CarnetCreateSchema),
  async (c) => {
    const body = c.req.valid('json');
    const result = await carnetService.create(body);
    return c.json(result);
  }
);

app.get(
  '/carnet/:id',
  zValidator('param', z.object({ id: z.coerce.number() })),
  async (c) => {
    const { id } = c.req.valid('param');
    const carnet = await carnetService.getById(id);
    if (!carnet) {
      throw new HTTPException(404, { message: 'Carnet not found' });
    }
    return c.json(carnet);
  }
);

app.get(
  '/carnet/client/:id',
  zValidator('param', z.object({ id: z.coerce.number() })),
  async (c) => {
    const { id } = c.req.valid('param');
    const result = await carnetService.listByClient(id);
    return c.json(result);
  }
);

// --- TRANSACTION ROUTES ---
app.post(
  '/transaction',
  zValidator('json', MouvementTotineCreateSchema),
  async (c) => {
    const body = c.req.valid('json');
    const result = await mouvementService.create(body);
    return c.json(result);
  }
);

app.get('/transaction/recent', async (c) => {
  const limit = c.req.query('limit') ? parseInt(c.req.query('limit')!) : 20;
  const result = await mouvementService.getRecent(limit);
  return c.json(result);
});

// --- STATS ROUTES ---
app.get('/stats/global', async (c) => {
  const result = await reportingService.getGlobalStats();
  return c.json(result);
});

app.get(
  '/stats/agent/:id',
  zValidator('param', z.object({ id: z.coerce.number() })),
  async (c) => {
    const { id } = c.req.valid('param');
    const result = await reportingService.getAgentPerformance(id);
    return c.json(result);
  }
);

app.get(
  '/stats/client/:id',
  zValidator('param', z.object({ id: z.coerce.number() })),
  async (c) => {
    const { id } = c.req.valid('param');
    const result = await reportingService.getClientPerformance(id);
    return c.json(result);
  }
);

app.get(
  '/stats/utilisateur/:id',
  zValidator('param', z.object({ id: z.coerce.number() })),
  async (c) => {
    const { id } = c.req.valid('param');
    const result = await reportingService.getUtilisateurPerformance(id);
    return c.json(result);
  }
);

// --- ERROR HANDLING ---
app.onError((err, c) => {
  console.error('Error:', err);

  if (err instanceof HTTPException) {
    return c.json(
      { error: err.message },
      { status: err.status }
    );
  }

  return c.json(
    { error: err instanceof Error ? err.message : 'Internal server error' },
    { status: 500 }
  );
});

// --- START SERVER ---
const port = 3033;
console.log(`🚀 Hono server is running at http://localhost:${port}`);

export default {
  port: port,
  fetch: app.fetch,
};



