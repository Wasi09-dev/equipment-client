import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.BETTER_AUTH_DB_URI);
const db = client.db("equipmentdb");

// Roles a user is allowed to pick when signing up. "admin" can never be self-assigned.
const SELF_ASSIGNABLE_ROLES = ["customer", "owner"];

export const auth = betterAuth({
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
            clientId: process.env.GOOGLE_CLIENT_ID ,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ,
        }, 
    },
    accountlinking: { 
      trustedProviders: ["google"],
      allowUnlinking: true,
    },
  database: mongodbAdapter(db, {
    client,
  }),
});
