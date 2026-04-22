import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CarnetPlain = t.Object(
  {
    id: t.Integer(),
    numeroCarnet: t.String(),
    agentCollecteurId: t.Integer(),
    clientTotineId: t.Integer(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const CarnetRelations = t.Object(
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

export const CarnetPlainInputCreate = t.Object(
  { numeroCarnet: t.String() },
  { additionalProperties: false },
);

export const CarnetPlainInputUpdate = t.Object(
  { numeroCarnet: t.Optional(t.String()) },
  { additionalProperties: false },
);

export const CarnetRelationsInputCreate = t.Object(
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

export const CarnetRelationsInputUpdate = t.Partial(
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

export const CarnetWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.Integer(),
          numeroCarnet: t.String(),
          agentCollecteurId: t.Integer(),
          clientTotineId: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "Carnet" },
  ),
);

export const CarnetWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.Integer(), numeroCarnet: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.Integer() }),
            t.Object({ numeroCarnet: t.String() }),
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
              numeroCarnet: t.String(),
              agentCollecteurId: t.Integer(),
              clientTotineId: t.Integer(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Carnet" },
);

export const CarnetSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      numeroCarnet: t.Boolean(),
      agentCollecteurId: t.Boolean(),
      clientTotineId: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      client: t.Boolean(),
      utilisateurs: t.Boolean(),
      cotisations: t.Boolean(),
      mouvementTotines: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const CarnetInclude = t.Partial(
  t.Object(
    {
      client: t.Boolean(),
      utilisateurs: t.Boolean(),
      cotisations: t.Boolean(),
      mouvementTotines: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const CarnetOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      numeroCarnet: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      agentCollecteurId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clientTotineId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const Carnet = t.Composite([CarnetPlain, CarnetRelations], {
  additionalProperties: false,
});

export const CarnetInputCreate = t.Composite(
  [CarnetPlainInputCreate, CarnetRelationsInputCreate],
  { additionalProperties: false },
);

export const CarnetInputUpdate = t.Composite(
  [CarnetPlainInputUpdate, CarnetRelationsInputUpdate],
  { additionalProperties: false },
);
