import { Elysia, t } from "elysia";
import { openapi } from '@elysiajs/openapi'
import { jwt } from "@elysiajs/jwt";
import {
  agenceService,
  carnetService,
  clientService,
  mouvementService,
  reportingService,
  societeService,
  utilisateurService
} from "../lib/data-access";
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
} from "../lib/validations";
import { authService } from "../lib/auth";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key-change-in-prod";

const app = new Elysia()
  .use(openapi())
  .use(jwt({ secret: JWT_SECRET }))

app.get("/", () => "Hello Elysia")

// --- AUTH ENDPOINTS ---
app.group("/auth", (app) =>
  app
    .post("/register", async ({ body }) => {
      // Check if user already exists
      const existing = await utilisateurService.findByEmail(body.email);
      if (existing) {
        throw new Error("User already exists with this email");
      }

      // Hash password
      const motDePasseHash = await authService.hashPassword(body.password);

      // Create user
      const user = await utilisateurService.create({
        email: body.email,
        motDePasseHash,
        nom: body.nom,
        telephone: body.telephone,
        role: body.role || "CAISSIER",
        agenceId: body.agenceId,
        societeId: body.societeId
      });

      // Remove password hash from response
      const { motDePasseHash: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }, {
      body: z.object({
        email: z.string().email(),
        password: z.string().min(6),
        nom: z.string(),
        telephone: z.string().optional(),
        role: z.enum(["ADMIN", "CAISSIER", "COLLECTEUR"]).optional(),
        agenceId: z.number().optional(),
        societeId: z.number().optional()
      }),
      detail: { summary: "Register a new user" }
    })
    .post("/login", async ({ body }) => {
      // Find user
      const user = await utilisateurService.findByEmail(body.email);
      if (!user) {
        throw new Error("Invalid credentials");
      }

      // Verify password
      const isPasswordValid = await authService.comparePassword(body.password, user.motDePasseHash);
      if (!isPasswordValid) {
        throw new Error("Invalid credentials");
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

      return {
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
      };
    }, {
      body: z.object({
        email: z.string().email(),
        password: z.string()
      }),
      detail: { summary: "Login and get tokens" }
    })
    .post("/refresh", async ({ body }) => {
      try {
        // Verify refresh token
        const decoded = await authService.verifyRefreshToken(body.refreshToken);
        const userId = decoded.userId;

        // Get fresh user data
        const user = await utilisateurService.getById(userId);
        if (!user || !user.isActive) {
          throw new Error("User not found or inactive");
        }

        // Generate new access token
        const accessToken = await authService.generateAccessToken({
          userId: user.id,
          email: user.email,
          role: user.role,
          agenceId: user.agenceId || undefined,
          societeId: user.societeId || undefined
        });

        return { accessToken };
      } catch (error) {
        throw new Error("Invalid refresh token");
      }
    }, {
      body: z.object({
        refreshToken: z.string()
      }),
      detail: { summary: "Refresh access token" }
    })
)

// JWT Guard middleware - protects all routes below
app.guard(
  {
    headers: t.Object({
      authorization: t.Optional(t.String())
    })
  },
  async ({ headers, set }) => {
    const authHeader = headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      set.status = 401;
      throw new Error("Missing or invalid Authorization header");
    }

    const token = authHeader.substring(7);
    try {
      const decoded = await authService.verifyAccessToken(token);
      return { user: decoded };
    } catch (error) {
      set.status = 401;
      throw new Error("Invalid or expired token");
    }
  }
)

// Group societe routes
app.group("/societe", (app) =>
  app
    .post("/", ({ body }) => societeService.create(body), {
      body: SocieteCreateSchema,
      response: SocieteSchema,
      detail: { summary: "Créer une société" }
    })
    .get("/", () => societeService.getAll(), {
      response: z.array(SocieteSchema),
      detail: { summary: "Liste des sociétés" }
    })
    .get("/:id", ({ params: { id } }) => societeService.getById(id), {
      params: z.object({ id: z.coerce.number() }),
      response: SocieteSchema,
      detail: { summary: "Détails d'une société" }
    })
    .put("/:id", ({ params: { id }, body }) => societeService.update(id, body), {
      params: z.object({ id: z.coerce.number() }),
      body: SocieteUpdateSchema,
      response: SocieteSchema,
      detail: { summary: "Modifier une société" }
    })
    .delete("/:id", ({ params: { id } }) => societeService.delete(id), {
      params: z.object({ id: z.coerce.number() }),
      response: SocieteSchema,
      detail: { summary: "Supprimer une société (soft delete)" }
    })
);

// Group agence routes
app.group("/agence", (app) =>
  app
    .post("/", ({ body }) => agenceService.create(body), {
      body: AgenceCreateSchema,
      response: AgenceSchema,
      detail: { summary: "Créer une agence" }
    })
    .get("/", () => agenceService.getAll(), {
      response: z.array(AgenceSchema),
      detail: { summary: "Liste des agences" }
    })
    .get("/:id", ({ params: { id } }) => agenceService.getById(id), {
      params: z.object({ id: z.coerce.number() }),
      response: AgenceSchema,
      detail: { summary: "Détails d'une agence" }
    })
    .put("/:id", ({ params: { id }, body }) => agenceService.update(id, body), {
      params: z.object({ id: z.coerce.number() }),
      body: AgenceUpdateSchema,
      response: AgenceSchema,
      detail: { summary: "Modifier une agence" }
    })
    .delete("/:id", ({ params: { id } }) => agenceService.delete(id), {
      params: z.object({ id: z.coerce.number() }),
      response: AgenceSchema,
      detail: { summary: "Supprimer une agence (soft delete)" }
    })
);

// Group utilisateur routes
app.group("/utilisateur", (app) =>
  app
    .post("/", ({ body }) => utilisateurService.create(body), {
      body: UtilisateurCreateSchema,
      response: UtilisateurSchema,
      detail: { summary: "Créer un utilisateur" }
    })
    .get("/", () => utilisateurService.getAll(), {
      response: z.array(UtilisateurSchema),
      detail: { summary: "Liste des utilisateurs" }
    })
    .get("/:id", ({ params: { id } }) => utilisateurService.getById(id), {
      params: z.object({ id: z.coerce.number() }),
      response: UtilisateurSchema,
      detail: { summary: "Détails d'un utilisateur" }
    })
    .put("/:id", ({ params: { id }, body }) => utilisateurService.update(id, body), {
      params: z.object({ id: z.coerce.number() }),
      body: UtilisateurUpdateSchema,
      response: UtilisateurSchema,
      detail: { summary: "Modifier un utilisateur" }
    })
    .delete("/:id", ({ params: { id } }) => utilisateurService.delete(id), {
      params: z.object({ id: z.coerce.number() }),
      response: UtilisateurSchema,
      detail: { summary: "Supprimer un utilisateur (soft delete)" }
    })
    .get("/:id/full", ({ params: { id } }) => utilisateurService.getFullInfo(id), {
      params: z.object({ id: z.coerce.number() }),
      response: z.any(),
      detail: { summary: "Détails complets d'un utilisateur" }
    })
);

// Group client routes
app.group("/client", (app) =>
  app
    .post("/", ({ body }) => clientService.create(body), {
      body: ClientTotineCreateWithInitSchema,
      response: z.any(),
      detail: { summary: "Créer un client (avec carnet et 1ère cotisation)" }
    })
    .get("/", () => clientService.getAll(), {
      response: z.array(ClientTotineSchema),
      detail: { summary: "Liste des clients" }
    })
    .get("/:id", ({ params: { id } }) => clientService.getFullInfo(id), {
      params: z.object({ id: z.coerce.number() }),
      response: z.any(),
      detail: { summary: "Profil complet du client" }
    })
    .put("/:id", ({ params: { id }, body }) => clientService.update(id, body), {
      params: z.object({ id: z.coerce.number() }),
      body: ClientTotineUpdateSchema,
      response: ClientTotineSchema,
      detail: { summary: "Modifier un client" }
    })
);

// Group carnet routes
app.group("/carnet", (app) =>
  app
    .post("/", ({ body }) => carnetService.create(body), {
      body: CarnetCreateSchema,
      response: CarnetSchema,
    })
    .get("/:id", ({ params: { id } }) => carnetService.getById(id), {
      params: z.object({ id: z.coerce.number() }),
      response: CarnetSchema,
    })
    .get("/client/:id", ({ params: { id } }) => carnetService.listByClient(id), {
      params: z.object({ id: z.coerce.number() }),
      response: z.array(CarnetSchema),
    })
);

// Group transaction routes
app.group("/transaction", (app) =>
  app
    .post("/", ({ body }) => mouvementService.create(body), {
      body: MouvementTotineCreateSchema,
      response: MouvementTotineSchema,
      detail: { summary: "Enregistrer un mouvement (versement/retrait)" }
    })
    .get("/recent", ({ query }) => mouvementService.getRecent(query.limit ? parseInt(query.limit) : 20), {
      query: z.object({ limit: z.string().optional() }),
      response: z.array(MouvementTotineSchema),
      detail: { summary: "Derniers mouvements" }
    })
);

// Group reporting routes
app.group("/stats", (app) =>
  app
    .get("/global", () => reportingService.getGlobalStats(), {
      detail: { summary: "Statistiques globales du système" }
    })
    .get("/agent/:id", ({ params: { id } }) => reportingService.getAgentPerformance(id), {
      params: z.object({ id: z.coerce.number() }),
      detail: { summary: "Performance d'un agent collecteur" }
    })
    .get("/client/:id", ({ params: { id } }) => reportingService.getClientPerformance(id), {
      params: z.object({ id: z.coerce.number() }),
      detail: { summary: "Performance d'un client" }
    })
    .get("/utilisateur/:id", ({ params: { id } }) => reportingService.getUtilisateurPerformance(id), {
      params: z.object({ id: z.coerce.number() }),
      detail: { summary: "Performance d'un utilisateur" }
    })
);

app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
