import { z } from "zod";
import { RoleUtilisateur, Mois, TypeMouvement, StatutTransaction } from "../generated/prisma/enums";

// --- ENUMS ---
export const RoleUtilisateurSchema = z.nativeEnum(RoleUtilisateur);
export const MoisSchema = z.nativeEnum(Mois);
export const TypeMouvementSchema = z.nativeEnum(TypeMouvement);
export const StatutTransactionSchema = z.nativeEnum(StatutTransaction);

// --- UTILS ---
const DecimalSchema = z.union([z.number(), z.string(), z.any()]); // Flexible for Decimal

// --- SOCIETE ---
export const SocieteSchema = z.object({
  id: z.number().int(),
  nom: z.string().min(2),
  raisonSociale: z.string().optional().nullable(),
  identifiant: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  telephone: z.string().optional().nullable(),
  adresse: z.string().optional().nullable(),
  isActive: z.boolean(),
  deletedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const SocieteCreateSchema = SocieteSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true
}).extend({
  isActive: z.boolean().default(true).optional(),
});

export const SocieteUpdateSchema = SocieteCreateSchema.partial();

// --- AGENCE ---
export const AgenceSchema = z.object({
  id: z.number().int(),
  code: z.string().min(2),
  nom: z.string().min(2),
  adresse: z.string().optional().nullable(),
  telephone: z.string().optional().nullable(),
  zoneId: z.number().int().optional().nullable(),
  societeId: z.number().int(),
  isActive: z.boolean(),
  deletedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const AgenceCreateSchema = AgenceSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true
}).extend({
  isActive: z.boolean().default(true).optional(),
});

export const AgenceUpdateSchema = AgenceCreateSchema.partial();

// --- UTILISATEUR ---
export const UtilisateurSchema = z.object({
  id: z.number().int(),
  email: z.string().email(),
  motDePasseHash: z.string().min(6),
  nom: z.string().min(2),
  telephone: z.string().optional().nullable(),
  role: RoleUtilisateurSchema,
  societeId: z.number().int().optional().nullable(),
  agenceId: z.number().int().optional().nullable(),
  isActive: z.boolean(),
  lastLogin: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const UtilisateurCreateSchema = UtilisateurSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLogin: true
}).extend({
  role: RoleUtilisateurSchema.default(RoleUtilisateur.CAISSIER).optional(),
  isActive: z.boolean().default(true).optional(),
});

export const UtilisateurUpdateSchema = UtilisateurCreateSchema.partial();

// --- CLIENT TOTINE ---
export const ClientTotineSchema = z.object({
  id: z.number().int(),
  numeroClient: z.string().min(3),
  nom: z.string().min(2),
  telephone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  agentCollecteurId: z.number().int(),
  agenceId: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const ClientTotineCreateWithInitSchema = z.object({
  numeroClient: z.string().min(3),
  nom: z.string().min(2),
  telephone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  agentCollecteurId: z.number().int(),
  agenceId: z.number().int(),
  mois: MoisSchema,
  annee: z.number().int(),
  mise: DecimalSchema,
});

export const ClientTotineCreateSchema = ClientTotineSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const ClientTotineUpdateSchema = ClientTotineCreateSchema.partial();

// --- CARNET ---
export const CarnetSchema = z.object({
  id: z.number().int(),
  numeroCarnet: z.string().min(3),
  agentCollecteurId: z.number().int(),
  clientTotineId: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const CarnetCreateSchema = CarnetSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const CarnetUpdateSchema = CarnetCreateSchema.partial();

// --- COTISATION ---
export const CotisationSchema = z.object({
  id: z.number().int(),
  mois: MoisSchema,
  annee: z.number().int().min(2000).max(2100),
  mise: DecimalSchema,
  clientId: z.number().int(),
  carnetId: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  soldeDeCloture: DecimalSchema.optional().nullable(),
  soldeDisponible: DecimalSchema,
  dateOuverture: z.coerce.date(),
  dateCloture: z.coerce.date().optional().nullable(),
  agenceId: z.number().int(),
  agentCollecteurId: z.number().int(),
  isActif: z.boolean(),
});

export const CotisationCreateSchema = CotisationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
}).extend({
  dateOuverture: z.coerce.date().default(() => new Date()).optional(),
  isActif: z.boolean().default(true).optional(),
});

export const CotisationUpdateSchema = CotisationCreateSchema.partial();

// --- MOUVEMENT TOTINE ---
export const MouvementTotineSchema = z.object({
  id: z.number().int(),
  jour: z.number().int().min(1).max(31),
  montant: DecimalSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  carnetId: z.number().int(),
  agenceId: z.number().int().optional().nullable(),
  utilisateurId: z.number().int().optional().nullable(),
  clientTotineId: z.number().int().optional().nullable(),
});

export const MouvementTotineCreateSchema = MouvementTotineSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// --- CLIENT SOLDE ---
export const ClientSoldeSchema = z.object({
  id: z.number().int(),
  clientId: z.number().int(),
  soldeTotal: DecimalSchema,
  agenceId: z.number().int(),
  agentCollecteurId: z.number().int(),
  isActif: z.boolean(),
});

// --- TYPES ---
export type SocieteCreate = z.infer<typeof SocieteCreateSchema>;
export type AgenceCreate = z.infer<typeof AgenceCreateSchema>;
export type UtilisateurCreate = z.infer<typeof UtilisateurCreateSchema>;
export type ClientTotineCreate = z.infer<typeof ClientTotineCreateSchema>;
export type CarnetCreate = z.infer<typeof CarnetCreateSchema>;
export type CotisationCreate = z.infer<typeof CotisationCreateSchema>;
export type MouvementTotineCreate = z.infer<typeof MouvementTotineCreateSchema>;
