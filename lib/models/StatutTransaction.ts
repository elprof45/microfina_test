import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const StatutTransaction = t.Union(
  [
    t.Literal("EN_ATTENTE"),
    t.Literal("VALIDE"),
    t.Literal("REJETE"),
    t.Literal("ANNULE"),
    t.Literal("REMBOURSE"),
  ],
  { additionalProperties: false },
);
