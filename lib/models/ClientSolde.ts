import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ClientSoldePlain = t.Object(
  {
    id: t.Integer(),
    clientId: t.Integer(),
    soldeTotal: t.Number(),
    agenceId: t.Integer(),
    agentCollecteurId: t.Integer(),
    isActif: t.Boolean(),
  },
  { additionalProperties: false },
);

export const ClientSoldeRelations = t.Object(
  {
    client: __nullable__(
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
  },
  { additionalProperties: false },
);

export const ClientSoldePlainInputCreate = t.Object(
  { soldeTotal: t.Number(), isActif: t.Optional(t.Boolean()) },
  { additionalProperties: false },
);

export const ClientSoldePlainInputUpdate = t.Object(
  { soldeTotal: t.Optional(t.Number()), isActif: t.Optional(t.Boolean()) },
  { additionalProperties: false },
);

export const ClientSoldeRelationsInputCreate = t.Object(
  {
    client: t.Optional(
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
  },
  { additionalProperties: false },
);

export const ClientSoldeRelationsInputUpdate = t.Partial(
  t.Object(
    {
      client: t.Partial(
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
    },
    { additionalProperties: false },
  ),
);

export const ClientSoldeWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.Integer(),
          clientId: t.Integer(),
          soldeTotal: t.Number(),
          agenceId: t.Integer(),
          agentCollecteurId: t.Integer(),
          isActif: t.Boolean(),
        },
        { additionalProperties: false },
      ),
    { $id: "ClientSolde" },
  ),
);

export const ClientSoldeWhereUnique = t.Recursive(
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
              clientId: t.Integer(),
              soldeTotal: t.Number(),
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
  { $id: "ClientSolde" },
);

export const ClientSoldeSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clientId: t.Boolean(),
      soldeTotal: t.Boolean(),
      agenceId: t.Boolean(),
      agentCollecteurId: t.Boolean(),
      isActif: t.Boolean(),
      client: t.Boolean(),
      utilisateurs: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ClientSoldeInclude = t.Partial(
  t.Object(
    { client: t.Boolean(), utilisateurs: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const ClientSoldeOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clientId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      soldeTotal: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const ClientSolde = t.Composite(
  [ClientSoldePlain, ClientSoldeRelations],
  { additionalProperties: false },
);

export const ClientSoldeInputCreate = t.Composite(
  [ClientSoldePlainInputCreate, ClientSoldeRelationsInputCreate],
  { additionalProperties: false },
);

export const ClientSoldeInputUpdate = t.Composite(
  [ClientSoldePlainInputUpdate, ClientSoldeRelationsInputUpdate],
  { additionalProperties: false },
);
