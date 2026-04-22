import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CotisationPlain = t.Object(
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
);

export const CotisationRelations = t.Object(
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
    utilisateurs: __nullable__(
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
    ),
    client: t.Object(
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
    carnet: t.Object(
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
  },
  { additionalProperties: false },
);

export const CotisationPlainInputCreate = t.Object(
  {
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
    soldeDeCloture: t.Optional(__nullable__(t.Number())),
    soldeDisponible: t.Number(),
    dateOuverture: t.Optional(t.Date()),
    dateCloture: t.Optional(__nullable__(t.Date())),
    isActif: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const CotisationPlainInputUpdate = t.Object(
  {
    mois: t.Optional(
      t.Union(
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
    ),
    annee: t.Optional(t.Integer()),
    mise: t.Optional(t.Number()),
    soldeDeCloture: t.Optional(__nullable__(t.Number())),
    soldeDisponible: t.Optional(t.Number()),
    dateOuverture: t.Optional(t.Date()),
    dateCloture: t.Optional(__nullable__(t.Date())),
    isActif: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const CotisationRelationsInputCreate = t.Object(
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
    utilisateurs: t.Optional(
      t.Object(
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
    ),
    client: t.Object(
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
    carnet: t.Object(
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
  },
  { additionalProperties: false },
);

export const CotisationRelationsInputUpdate = t.Partial(
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
      utilisateurs: t.Partial(
        t.Object(
          {
            connect: t.Object(
              {
                id: t.Integer({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            disconnect: t.Boolean(),
          },
          { additionalProperties: false },
        ),
      ),
      client: t.Object(
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
      carnet: t.Object(
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
    },
    { additionalProperties: false },
  ),
);

export const CotisationWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
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
          soldeDeCloture: t.Number(),
          soldeDisponible: t.Number(),
          dateOuverture: t.Date(),
          dateCloture: t.Date(),
          agenceId: t.Integer(),
          agentCollecteurId: t.Integer(),
          isActif: t.Boolean(),
        },
        { additionalProperties: false },
      ),
    { $id: "Cotisation" },
  ),
);

export const CotisationWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object({ id: t.Integer() }, { additionalProperties: false }),
          { additionalProperties: false },
        ),
        t.Union([t.Object({ id: t.Integer() })], {
          additionalProperties: false,
        }),
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
              soldeDeCloture: t.Number(),
              soldeDisponible: t.Number(),
              dateOuverture: t.Date(),
              dateCloture: t.Date(),
              agenceId: t.Integer(),
              agentCollecteurId: t.Integer(),
              isActif: t.Boolean(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Cotisation" },
);

export const CotisationSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      mois: t.Boolean(),
      annee: t.Boolean(),
      mise: t.Boolean(),
      clientId: t.Boolean(),
      carnetId: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      soldeDeCloture: t.Boolean(),
      soldeDisponible: t.Boolean(),
      dateOuverture: t.Boolean(),
      dateCloture: t.Boolean(),
      agenceId: t.Boolean(),
      agentCollecteurId: t.Boolean(),
      isActif: t.Boolean(),
      agence: t.Boolean(),
      utilisateurs: t.Boolean(),
      client: t.Boolean(),
      carnet: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const CotisationInclude = t.Partial(
  t.Object(
    {
      mois: t.Boolean(),
      agence: t.Boolean(),
      utilisateurs: t.Boolean(),
      client: t.Boolean(),
      carnet: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const CotisationOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      annee: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      mise: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clientId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      carnetId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      updatedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      soldeDeCloture: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      soldeDisponible: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dateOuverture: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dateCloture: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      agenceId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      agentCollecteurId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isActif: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const Cotisation = t.Composite([CotisationPlain, CotisationRelations], {
  additionalProperties: false,
});

export const CotisationInputCreate = t.Composite(
  [CotisationPlainInputCreate, CotisationRelationsInputCreate],
  { additionalProperties: false },
);

export const CotisationInputUpdate = t.Composite(
  [CotisationPlainInputUpdate, CotisationRelationsInputUpdate],
  { additionalProperties: false },
);
