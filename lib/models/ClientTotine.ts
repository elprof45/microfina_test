import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ClientTotinePlain = t.Object(
  {
    id: t.Integer(),
    numeroClient: t.String(),
    nom: t.String(),
    telephone: __nullable__(t.String()),
    email: __nullable__(t.String()),
    agentCollecteurId: t.Integer(),
    agenceId: t.Integer(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const ClientTotineRelations = t.Object(
  {
    agence: t.Object(
      {
        id: t.Integer(),
        code: t.String(),
        nom: t.String(),
        adresse: __nullable__(t.String()),
        telephone: __nullable__(t.String()),
        zoneId: __nullable__(t.Integer()),
        societeId: t.Integer(),
        isActive: t.Boolean(),
        deletedAt: __nullable__(t.Date()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    utilisateurs: t.Object(
      {
        id: t.Integer(),
        email: t.String(),
        motDePasseHash: t.String(),
        nom: t.String(),
        telephone: __nullable__(t.String()),
        role: t.Union(
          [t.Literal("ADMIN"), t.Literal("CAISSIER"), t.Literal("COLLECTEUR")],
          { additionalProperties: false },
        ),
        societeId: __nullable__(t.Integer()),
        agenceId: __nullable__(t.Integer()),
        isActive: t.Boolean(),
        lastLogin: __nullable__(t.Date()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    carnets: t.Array(
      t.Object(
        {
          id: t.Integer(),
          numeroCarnet: t.String(),
          agentCollecteurId: t.Integer(),
          clientTotineId: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    cotisations: t.Array(
      t.Object(
        {
          id: t.Integer(),
          mois: t.Union(
            [
              t.Literal("JANVIER"),
              t.Literal("FEVRIER"),
              t.Literal("MARS"),
              t.Literal("AVRIL"),
              t.Literal("MAI"),
              t.Literal("JUIN"),
              t.Literal("JUILLET"),
              t.Literal("AOUT"),
              t.Literal("SEPTEMBRE"),
              t.Literal("OCTOBRE"),
              t.Literal("NOVEMBRE"),
              t.Literal("DECEMBRE"),
            ],
            { additionalProperties: false },
          ),
          annee: t.Integer(),
          mise: t.Number(),
          clientId: t.Integer(),
          carnetId: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
          soldeDeCloture: __nullable__(t.Number()),
          soldeDisponible: t.Number(),
          dateOuverture: t.Date(),
          dateCloture: __nullable__(t.Date()),
          agenceId: t.Integer(),
          agentCollecteurId: t.Integer(),
          isActif: t.Boolean(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    mouvementTotines: t.Array(
      t.Object(
        {
          id: t.Integer(),
          jour: t.Integer(),
          montant: t.Number(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
          carnetId: t.Integer(),
          agenceId: __nullable__(t.Integer()),
          utilisateurId: __nullable__(t.Integer()),
          clientTotineId: __nullable__(t.Integer()),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    clientSoldes: t.Array(
      t.Object(
        {
          id: t.Integer(),
          clientId: t.Integer(),
          soldeTotal: t.Number(),
          agenceId: t.Integer(),
          agentCollecteurId: t.Integer(),
          isActif: t.Boolean(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const ClientTotinePlainInputCreate = t.Object(
  {
    numeroClient: t.String(),
    nom: t.String(),
    telephone: t.Optional(__nullable__(t.String())),
    email: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const ClientTotinePlainInputUpdate = t.Object(
  {
    numeroClient: t.Optional(t.String()),
    nom: t.Optional(t.String()),
    telephone: t.Optional(__nullable__(t.String())),
    email: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const ClientTotineRelationsInputCreate = t.Object(
  {
    agence: t.Object(
      {
        connect: t.Object(
          {
            id: t.Integer({ additionalProperties: false }),
          },
          { additionalProperties: false },
        ),
      },
      { additionalProperties: false },
    ),
    utilisateurs: t.Object(
      {
        connect: t.Object(
          {
            id: t.Integer({ additionalProperties: false }),
          },
          { additionalProperties: false },
        ),
      },
      { additionalProperties: false },
    ),
    carnets: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.Integer({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    cotisations: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.Integer({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    mouvementTotines: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.Integer({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    clientSoldes: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.Integer({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const ClientTotineRelationsInputUpdate = t.Partial(
  t.Object(
    {
      agence: t.Object(
        {
          connect: t.Object(
            {
              id: t.Integer({ additionalProperties: false }),
            },
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
      utilisateurs: t.Object(
        {
          connect: t.Object(
            {
              id: t.Integer({ additionalProperties: false }),
            },
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
      carnets: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.Integer({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.Integer({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      cotisations: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.Integer({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.Integer({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      mouvementTotines: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.Integer({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.Integer({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      clientSoldes: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.Integer({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.Integer({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
    },
    { additionalProperties: false },
  ),
);

export const ClientTotineWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.Integer(),
          numeroClient: t.String(),
          nom: t.String(),
          telephone: t.String(),
          email: t.String(),
          agentCollecteurId: t.Integer(),
          agenceId: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "ClientTotine" },
  ),
);

export const ClientTotineWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.Integer(), numeroClient: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.Integer() }),
            t.Object({ numeroClient: t.String() }),
          ],
          { additionalProperties: false },
        ),
        t.Partial(
          t.Object({
            AND: t.Union([
              Self,
              t.Array(Self, { additionalProperties: false }),
            ]),
            NOT: t.Union([
              Self,
              t.Array(Self, { additionalProperties: false }),
            ]),
            OR: t.Array(Self, { additionalProperties: false }),
          }),
          { additionalProperties: false },
        ),
        t.Partial(
          t.Object(
            {
              id: t.Integer(),
              numeroClient: t.String(),
              nom: t.String(),
              telephone: t.String(),
              email: t.String(),
              agentCollecteurId: t.Integer(),
              agenceId: t.Integer(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "ClientTotine" },
);

export const ClientTotineSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      numeroClient: t.Boolean(),
      nom: t.Boolean(),
      telephone: t.Boolean(),
      email: t.Boolean(),
      agentCollecteurId: t.Boolean(),
      agenceId: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      agence: t.Boolean(),
      utilisateurs: t.Boolean(),
      carnets: t.Boolean(),
      cotisations: t.Boolean(),
      mouvementTotines: t.Boolean(),
      clientSoldes: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ClientTotineInclude = t.Partial(
  t.Object(
    {
      agence: t.Boolean(),
      utilisateurs: t.Boolean(),
      carnets: t.Boolean(),
      cotisations: t.Boolean(),
      mouvementTotines: t.Boolean(),
      clientSoldes: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ClientTotineOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      numeroClient: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      nom: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      telephone: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      email: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      agentCollecteurId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      agenceId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      updatedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const ClientTotine = t.Composite(
  [ClientTotinePlain, ClientTotineRelations],
  { additionalProperties: false },
);

export const ClientTotineInputCreate = t.Composite(
  [ClientTotinePlainInputCreate, ClientTotineRelationsInputCreate],
  { additionalProperties: false },
);

export const ClientTotineInputUpdate = t.Composite(
  [ClientTotinePlainInputUpdate, ClientTotineRelationsInputUpdate],
  { additionalProperties: false },
);
