import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const TypeMouvement = t.Union(
  [t.Literal("VERSEMENT"), t.Literal("RETRAIT"), t.Literal("DEPOT")],
  { additionalProperties: false },
);
