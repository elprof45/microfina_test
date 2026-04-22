import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const SocietePlain = t.Object(
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
);

export const SocieteRelations = t.Object(
  {
    agences: t.Array(
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
  },
  { additionalProperties: false },
);

export const SocietePlainInputCreate = t.Object(
  {
    nom: t.String(),
    raisonSociale: t.Optional(__nullable__(t.String())),
    identifiant: t.Optional(__nullable__(t.String())),
    email: t.Optional(__nullable__(t.String())),
    telephone: t.Optional(__nullable__(t.String())),
    adresse: t.Optional(__nullable__(t.String())),
    isActive: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const SocietePlainInputUpdate = t.Object(
  {
    nom: t.Optional(t.String()),
    raisonSociale: t.Optional(__nullable__(t.String())),
    identifiant: t.Optional(__nullable__(t.String())),
    email: t.Optional(__nullable__(t.String())),
    telephone: t.Optional(__nullable__(t.String())),
    adresse: t.Optional(__nullable__(t.String())),
    isActive: t.Optional(t.Boolean()),
    deletedAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const SocieteRelationsInputCreate = t.Object(
  {
    agences: t.Optional(
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
  },
  { additionalProperties: false },
);

export const SocieteRelationsInputUpdate = t.Partial(
  t.Object(
    {
      agences: t.Partial(
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
    },
    { additionalProperties: false },
  ),
);

export const SocieteWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.Integer(),
          nom: t.String(),
          raisonSociale: t.String(),
          identifiant: t.String(),
          email: t.String(),
          telephone: t.String(),
          adresse: t.String(),
          isActive: t.Boolean(),
          deletedAt: t.Date(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "Societe" },
  ),
);

export const SocieteWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.Integer(), identifiant: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.Integer() }),
            t.Object({ identifiant: t.String() }),
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
              nom: t.String(),
              raisonSociale: t.String(),
              identifiant: t.String(),
              email: t.String(),
              telephone: t.String(),
              adresse: t.String(),
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
  { $id: "Societe" },
);

export const SocieteSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      nom: t.Boolean(),
      raisonSociale: t.Boolean(),
      identifiant: t.Boolean(),
      email: t.Boolean(),
      telephone: t.Boolean(),
      adresse: t.Boolean(),
      isActive: t.Boolean(),
      deletedAt: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      agences: t.Boolean(),
      utilisateurs: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const SocieteInclude = t.Partial(
  t.Object(
    { agences: t.Boolean(), utilisateurs: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const SocieteOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      nom: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      raisonSociale: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      identifiant: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      email: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      telephone: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      adresse: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const Societe = t.Composite([SocietePlain, SocieteRelations], {
  additionalProperties: false,
});

export const SocieteInputCreate = t.Composite(
  [SocietePlainInputCreate, SocieteRelationsInputCreate],
  { additionalProperties: false },
);

export const SocieteInputUpdate = t.Composite(
  [SocietePlainInputUpdate, SocieteRelationsInputUpdate],
  { additionalProperties: false },
);
