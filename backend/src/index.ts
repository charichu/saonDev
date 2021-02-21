import "reflect-metadata";
import { createConnection } from 'typeorm';
import express from "express";
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { BookResolver } from "./resolvers/Book/BookResolver";
import helmet from 'helmet';
import cors from "cors";
import jwt from 'express-jwt';
import jwks from 'jwks-rsa';
//@ts-ignore
import * as dotenv from 'dotenv';

dotenv.config();

var jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: process.env.AUTH0_URI!
}),
audience: process.env.AUTH0_AUDIENCE,
issuer: process.env.AUTH0_DOMAIN,
algorithms: ['RS256'],
credentialsRequired: false
});

(async () => {
  const app = express();
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors());
  app.use(jwtCheck);

  await createConnection();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [BookResolver], 
      authChecker: ({ context: {user} }, roles) => {
        // if `@Authorized()`, check only if user exists
        if(roles.length === 0){
          return user !== undefined;
        }

        // there are some roles defined now
        if (!user) {
          // and if no user, restrict access
          return false;
        }        
        // grant access if the roles overlap
        if (user.permissions.some((role: any) => roles.includes(role))) {          
          return true;
        }
        // no roles matched, restrict access
        return false;
      }, 
      authMode: "error",
    }),
  context: ({req}: any) => { const user = req.user; return {user}} ,
});

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log('Server ready at 4000 and GraphQL is listening!');
  });
})();
