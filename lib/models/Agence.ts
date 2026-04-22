import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AgencePlain = t.Object(
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
);

export const AgenceRelations = t.Object(
  {
    societe: t.Object(
      {
        id: t.Integer(),
        nom: t.String(),
        raisonSociale: __nullable__(t.String()),
        identifiant: __nullable__(t.String()),
        email: __nullable__(t.String()),
        telephone: __nullable__(t.String()),
        adresse: __nullable__(t.String()),
        isActive: t.Boolean(),
        deletedAt: __nullable__(t.Date()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    utilisateurs: t.Array(
      t.Object(
        {
          id: t.Integer(),
          email: t.String(),
          motDePasseHash: t.String(),
          nom: t.String(),
          telephone: __nullable__(t.String()),
          role: t.Union(
            [
              t.Literal("ADMIN"),
              t.Literal("CAISSIER"),
              t.Literal("COLLECTEUR"),
            ],
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
      { additionalProperties: false },
    ),
    clients: t.Array(
      t.Object(
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
  },
  { additionalProperties: false },
);

export const AgencePlainInputCreate = t.Object(
  {
    code: t.String(),
    nom: t.String(),
    adresse: t.Optional(__nullable__(t.String())),
    telephone: t.Optional(__nullable__(t.String())),
    isActive: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const AgencePlainInputUpdate = t.Object(
  {
    code: t.Optional(t.String()),
    nom: t.Optional(t.String()),
    adresse: t.Optional(__nullable__(t.String())),
    telephone: t.Optional(__nullable__(t.String())),
    isActive: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const AgenceRelationsInputCreate = t.Object(
  {
    societe: t.Object(
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
    utilisateurs: t.Optional(
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
    clients: t.Optional(
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
  },
  { additionalProperties: false },
);

export const AgenceRelationsInputUpdate = t.Partial(
  t.Object(
    {
      societe: t.Object(
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
      utilisateurs: t.Partial(
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
      clients: t.Partial(
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
    },
    { additionalProperties: false },
  ),
);

export const AgenceWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.Integer(),
          code: t.String(),
          nom: t.String(),
          adresse: t.String(),
          telephone: t.String(),
          zoneId: t.Integer(),
          societeId: t.Integer(),
          isActive: t.Boolean(),
          deletedAt: t.Date(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "Agence" },
  ),
);

export const AgenceWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.Integer(), code: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.Integer() }), t.Object({ code: t.String() })],
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
              code: t.String(),
              nom: t.String(),
              adresse: t.String(),
              telephone: t.String(),
              zoneId: t.Integer(),
              societeId: t.Integer(),
              isActive: t.Boolean(),
              deletedAt: t.Date(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Agence" },
);

export const AgenceSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      code: t.Boolean(),
      nom: t.Boolean(),
      adresse: t.Boolean(),
      telephone: t.Boolean(),
      zoneId: t.Boolean(),
      societeId: t.Boolean(),
      isActive: t.Boolean(),
      deletedAt: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      societe: t.Boolean(),
      utilisateurs: t.Boolean(),
      clients: t.Boolean(),
      cotisations: t.Boolean(),
      mouvementTotines: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const AgenceInclude = t.Partial(
  t.Object(
    {
      societe: t.Boolean(),
      utilisateurs: t.Boolean(),
      clients: t.Boolean(),
      cotisations: t.Boolean(),
      mouvementTotines: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const AgenceOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      code: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      nom: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      adresse: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      telephone: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      zoneId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      societeId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isActive: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      deletedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const Agence = t.Composite([AgencePlain, AgenceRelations], {
  additionalProperties: false,
});

export const AgenceInputCreate = t.Composite(
  [AgencePlainInputCreate, AgenceRelationsInputCreate],
  { additionalProperties: false },
);

export const AgenceInputUpdate = t.Composite(
  [AgencePlainInputUpdate, AgenceRelationsInputUpdate],
  { additionalProperties: false },
);
