import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const RoleUtilisateur = t.Union(
  [t.Literal("ADMIN"), t.Literal("CAISSIER"), t.Literal("COLLECTEUR")],
  { additionalProperties: false },
);
