import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const Mois = t.Union(
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
);
