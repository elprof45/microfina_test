import { RoleUtilisateur, Mois } from "../generated/prisma/enums";
import { AgenceUncheckedCreateInput, AgenceUpdateInput, CarnetUncheckedCreateInput, ClientTotineUncheckedCreateInput, ClientTotineUpdateInput, CotisationUncheckedCreateInput, MouvementTotineUncheckedCreateInput, SocieteCreateInput, SocieteUpdateInput, UtilisateurUncheckedCreateInput, UtilisateurUpdateInput } from "../generated/prisma/models";
import { prisma } from "./db";

/**
 * DATA ACCESS LAYER - MICROPHINA
 * Complete CRUD and Reporting Service
 */

// --- SOCIETE ---
export const societeService = {
  async create(data: SocieteCreateInput) {
    return await prisma.societe.create({ data });
  },

  async getAll(includeAgences = false) {
    return await prisma.societe.findMany({
      where: { deletedAt: null },
      include: { _count: { select: { agences: true, utilisateurs: true } }, ...(includeAgences ? { agences: true } : {}) }
    });
  },

  async getById(id: number) {
    return await prisma.societe.findUnique({
      where: { id },
      include: {
        agences: true,
        utilisateurs: { select: { id: true, nom: true, role: true } }
      }
    });
  },

  async update(id: number, data: SocieteUpdateInput) {
    return await prisma.societe.update({ where: { id }, data });
  },

  async delete(id: number) {
    return await prisma.societe.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false }
    });
  },

  async getState(id: number) {
    const stats = await prisma.societe.findUnique({
      where: { id },
      select: {
        _count: {
          select: { agences: true, utilisateurs: true }
        }
      }
    });
    return stats;
  }
};

// --- AGENCE ---
export const agenceService = {
  async create(data: AgenceUncheckedCreateInput) {
    return await prisma.agence.create({ data });
  },

  async getAll(societeId?: number) {
    return await prisma.agence.findMany({
      where: {
        deletedAt: null,
        ...(societeId ? { societeId } : {})
      },
      include: { _count: { select: { clients: true, utilisateurs: true } } }
    });
  },

  async getById(id: number) {
    return await prisma.agence.findUnique({
      where: { id },
      include: {
        societe: true,
        utilisateurs: true,
        _count: { select: { clients: true, mouvementTotines: true } }
      }
    });
  },

  async update(id: number, data: AgenceUpdateInput) {
    return await prisma.agence.update({ where: { id }, data });
  },

  async delete(id: number) {
    return await prisma.agence.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false }
    });
  }
};

// --- UTILISATEUR / AGENTS ---
export const utilisateurService = {
  async create(data: UtilisateurUncheckedCreateInput) {
    return await prisma.utilisateur.create({ data });
  },

  async getAll(filter?: { role?: RoleUtilisateur, agenceId?: number }) {
    return await prisma.utilisateur.findMany({
      where: {
        isActive: true,
        ...(filter?.role ? { role: filter.role } : {}),
        ...(filter?.agenceId ? { agenceId: filter.agenceId } : {})
      },
      include: { agence: true, societe: true }
    });
  },

  async getById(id: number) {
    return await prisma.utilisateur.findUnique({
      where: { id },
      include: {
        agence: true,
        _count: { select: { clientTotines: true, carnets: true, cotisations: true } }
      }
    });
  },

  async update(id: number, data: UtilisateurUpdateInput) {
    return await prisma.utilisateur.update({ where: { id }, data });
  },

  async delete(id: number) {
    return await prisma.utilisateur.update({ where: { id }, data: { isActive: false } });
  },

  // get full info of user
  async getFullInfo(id: number) {
    return await prisma.utilisateur.findUnique({
      where: { id },
      include: {
        agence: true,
        societe: true,
        clientTotines: true,
        carnets: true,
        cotisations: true,
        _count: { select: { clientTotines: true, carnets: true, cotisations: true } }
      }
    });
  },

  // find by email
  async findByEmail(email: string) {
    return await prisma.utilisateur.findUnique({
      where: { email },
      include: { agence: true, societe: true }
    });
  },

  // update last login
  async updateLastLogin(id: number) {
    return await prisma.utilisateur.update({
      where: { id },
      data: { lastLogin: new Date() }
    });
  }
};

// --- CLIENT TOTINE ---
export type ClientCreateWithInit = ClientTotineUncheckedCreateInput & {
  mois: Mois;
  annee: number;
  mise: number;
};

export const clientService = {
  // create client with carnet and cotisations
  async create(data: ClientCreateWithInit) {
    const { mois, annee, mise, ...clientData } = data;
    return await prisma.$transaction(async (tx) => {
      const client = await tx.clientTotine.create({ data: clientData });
      const carnet = await tx.carnet.create({
        data: {
          clientTotineId: client.id,
          agentCollecteurId: data.agentCollecteurId,
          numeroCarnet: data.numeroClient
        }
      });
      const cotisation = await tx.cotisation.create({
        data: {
          clientId: client.id,
          carnetId: carnet.id,
          agentCollecteurId: data.agentCollecteurId,
          agenceId: data.agenceId,
          mois,
          annee,
          mise,
          soldeDisponible: mise
        }
      });
      return { client, carnet, cotisation };
    });
  },

  async getAll(agenceId?: number) {
    return await prisma.clientTotine.findMany({
      where: agenceId ? { agenceId } : {},
      include: { utilisateurs: { select: { nom: true } }, agence: { select: { nom: true } } }
    });
  },

  async getFullInfo(id: number) {
    return await prisma.clientTotine.findUnique({
      where: { id },
      include: {
        agence: true,
        utilisateurs: true,
        carnets: {
          include: {
            cotisations: { orderBy: { createdAt: 'desc' }, take: 5 },
            mouvementTotines: { orderBy: { createdAt: 'desc' }, take: 5 }
          }
        },
        clientSoldes: true
      }
    });
  },

  async update(id: number, data: ClientTotineUpdateInput) {
    return await prisma.clientTotine.update({ where: { id }, data });
  }
};

// --- CARNET ---
export const carnetService = {
  async create(data: CarnetUncheckedCreateInput) {
    return await prisma.carnet.create({ data });
  },

  async getById(id: number) {
    return await prisma.carnet.findUnique({
      where: { id },
      include: { client: true, utilisateurs: true, cotisations: true }
    });
  },

  async listByClient(clientId: number) {
    return await prisma.carnet.findMany({
      where: { clientTotineId: clientId },
      include: { _count: { select: { cotisations: true } } }
    });
  }
};

// --- COTISATION (TOTINE) ---
export const cotisationService = {
  async create(data: CotisationUncheckedCreateInput) {
    return await prisma.cotisation.create({ data });
  },

  async getByClientAndMonth(clientId: number, mois: Mois, annee: number) {
    return await prisma.cotisation.findFirst({
      where: { clientId, mois, annee },
      include: { carnet: true }
    });
  },

  async getActiveByClient(clientId: number) {
    return await prisma.cotisation.findMany({
      where: { clientId, isActif: true },
      orderBy: { annee: 'desc' }
    });
  },

  async closeCotisation(id: number, soldeCloture: number) {
    return await prisma.cotisation.update({
      where: { id },
      data: { isActif: false, dateCloture: new Date(), soldeDeCloture: soldeCloture }
    });
  }
};

// --- MOUVEMENT TOTINE ---
export const mouvementService = {
  async create(data: MouvementTotineUncheckedCreateInput) {
    return await prisma.$transaction(async (tx) => {
      const mouvement = await tx.mouvementTotine.create({ data });

      // Update ClientSolde if exists or create
      if (data.clientTotineId) {
        const currentSolde = await tx.clientSolde.findFirst({
          where: { clientId: data.clientTotineId }
        });

        if (currentSolde) {
          await tx.clientSolde.update({
            where: { id: currentSolde.id },
            data: { soldeTotal: { increment: data.montant } }
          });
        }
      }

      return mouvement;
    });
  },

  async getRecent(limit = 20) {
    return await prisma.mouvementTotine.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { clientTotine: true, utilisateur: true, agence: true }
    });
  }
};

// --- GLOBAL STATE / STATS ---
export const reportingService = {
  async getGlobalStats() {
    const [societes, agences, clients, utilisateurs, carnets, totalMouvements] = await Promise.all([
      prisma.societe.count({ where: { deletedAt: null } }),
      prisma.agence.count({ where: { deletedAt: null } }),
      prisma.clientTotine.count(),
      prisma.utilisateur.count({ where: { deletedAt: null } }),
      prisma.carnet.count(),
      prisma.mouvementTotine.aggregate({
        _sum: { montant: true },
        _count: true
      })
    ]);

    return {
      totalSocietes: societes,
      totalAgences: agences,
      totalClients: clients,
      totalUsers: utilisateurs,
      totalCarnets: carnets,
      totalTransactions: totalMouvements._count,
      totalVolume: totalMouvements._sum.montant || 0
    };
  },

  async getUtilisateurPerformance(utilisateurId: number) {
    const performance = await prisma.mouvementTotine.groupBy({
      by: ['utilisateurId'],
      where: { utilisateurId: utilisateurId },
      _sum: { montant: true },
      _count: true
    });

    const clientCount = await prisma.clientTotine.count({
      where: { agentCollecteurId: utilisateurId }
    });

    return {
      utilisateurId,
      totalCollecte: performance[0]?._sum.montant || 0,
      nombreTransactions: performance[0]?._count || 0,
      portefeuilleClients: clientCount
    };
  },

  async getAgentPerformance(agentId: number) {
    const performance = await prisma.mouvementTotine.groupBy({
      by: ['utilisateurId'],
      where: { utilisateurId: agentId },
      _sum: { montant: true },
      _count: true
    });

    const clientCount = await prisma.clientTotine.count({
      where: { agentCollecteurId: agentId }
    });

    return {
      agentId,
      totalCollecte: performance[0]?._sum.montant || 0,
      nombreTransactions: performance[0]?._count || 0,
      portefeuilleClients: clientCount
    };
  },

  async getClientPerformance(clientId: number) {
    const performance = await prisma.mouvementTotine.groupBy({
      by: ['clientTotineId'],
      where: { clientTotineId: clientId },
      _sum: { montant: true },
      _count: true
    });

    const clientCount = await prisma.clientTotine.count({
      where: { id: clientId }
    });

    return {
      clientId,
      totalCollecte: performance[0]?._sum.montant || 0,
      nombreTransactions: performance[0]?._count || 0,
      portefeuilleClients: clientCount
    };
  },

  async isInitialized() {
    const userCount = await prisma.utilisateur.count();
    return userCount > 0;
  }
};
