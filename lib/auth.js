import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.BETTER_AUTH_DB_URI);
const db = client.db('equipmentdb');

export const auth = betterAuth({
    user: {
      additionalFields:{
        role:{
          type:['admin', 'customer', 'owner'],
          input: true,
          defaultValue: 'customer'
        }
      }
    },
  
     emailAndPassword: { 
    enabled: true, 
  }, 

  database: mongodbAdapter(db, {
    client,
  }),
});