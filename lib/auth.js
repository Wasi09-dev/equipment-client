import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";


const globalForMongo = globalThis;
if (!globalForMongo._mongoClient) {
  globalForMongo._mongoClient = new MongoClient(process.env.BETTER_AUTH_DB_URI);
}
const client = globalForMongo._mongoClient;
const db = client.db("equipmentdb");

const SELF_ASSIGNABLE_ROLES = ["customer", "owner"];

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [
    "http://localhost:3000",
    "https://equipment-client-chi.vercel.app",
  ],
  user: {
    additionalFields: {
      role: {
        type: ["admin", "customer", "owner"],
        input: true,
        defaultValue: "customer",
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const requested = user.role;
          return {
            data: {
              ...user,
              role: SELF_ASSIGNABLE_ROLES.includes(requested)
                ? requested
                : "customer",
            },
          };
        },
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },
  database: mongodbAdapter(db),
});