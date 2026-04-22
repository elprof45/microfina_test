import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const MouvementTotinePlain = t.Object(
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
);

export const MouvementTotineRelations = t.Object(
  {
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
    agence: __nullable__(
      t.Object(
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
    ),
    utilisateur: __nullable__(
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
    clientTotine: __nullable__(
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
    ),
  },
  { additionalProperties: false },
);

export const MouvementTotinePlainInputCreate = t.Object(
  { jour: t.Integer(), montant: t.Number() },
  { additionalProperties: false },
);

export const MouvementTotinePlainInputUpdate = t.Object(
  { jour: t.Optional(t.Integer()), montant: t.Optional(t.Number()) },
  { additionalProperties: false },
);

export const MouvementTotineRelationsInputCreate = t.Object(
  {
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
    agence: t.Optional(
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
    utilisateur: t.Optional(
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
    clientTotine: t.Optional(
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
  },
  { additionalProperties: false },
);

export const MouvementTotineRelationsInputUpdate = t.Partial(
  t.Object(
    {
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
      agence: t.Partial(
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
      utilisateur: t.Partial(
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
      clientTotine: t.Partial(
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
    },
    { additionalProperties: false },
  ),
);

export const MouvementTotineWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.Integer(),
          jour: t.Integer(),
          montant: t.Number(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
          carnetId: t.Integer(),
          agenceId: t.Integer(),
          utilisateurId: t.Integer(),
          clientTotineId: t.Integer(),
        },
        { additionalProperties: false },
      ),
    { $id: "MouvementTotine" },
  ),
);

export const MouvementTotineWhereUnique = t.Recursive(
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
              jour: t.Integer(),
              montant: t.Number(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
              carnetId: t.Integer(),
              agenceId: t.Integer(),
              utilisateurId: t.Integer(),
              clientTotineId: t.Integer(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "MouvementTotine" },
);

export const MouvementTotineSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      jour: t.Boolean(),
      montant: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      carnetId: t.Boolean(),
      carnet: t.Boolean(),
      agence: t.Boolean(),
      agenceId: t.Boolean(),
      utilisateur: t.Boolean(),
      utilisateurId: t.Boolean(),
      clientTotine: t.Boolean(),
      clientTotineId: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const MouvementTotineInclude = t.Partial(
  t.Object(
    {
      carnet: t.Boolean(),
      agence: t.Boolean(),
      utilisateur: t.Boolean(),
      clientTotine: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const MouvementTotineOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      jour: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      montant: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      updatedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      carnetId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      agenceId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      utilisateurId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clientTotineId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const MouvementTotine = t.Composite(
  [MouvementTotinePlain, MouvementTotineRelations],
  { additionalProperties: false },
);

export const MouvementTotineInputCreate = t.Composite(
  [MouvementTotinePlainInputCreate, MouvementTotineRelationsInputCreate],
  { additionalProperties: false },
);

export const MouvementTotineInputUpdate = t.Composite(
  [MouvementTotinePlainInputUpdate, MouvementTotineRelationsInputUpdate],
  { additionalProperties: false },
);
