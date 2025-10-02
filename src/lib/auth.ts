import { db } from "@/db"; // your drizzle instance
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "../db/schema"; // your drizzle schema

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema,
  }),
  user: {
    modelName: "userTable",
  },
  session: {
    modelName: "sessionTable",
  },
  account: {
    modelName: "accountTable",
  },
});
