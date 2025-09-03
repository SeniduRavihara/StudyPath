import type { Config } from "drizzle-kit";

export default {
  schema: "./src/lib/schema.ts",
  out: "./drizzle",
  driver: "expo",
  dialect: "sqlite",
} satisfies Config;
