import NextAuth from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import GithubProvider from "next-auth/providers/github";

import clientPromise from "../../../lib/mongodb";

// https://github.com/nextauthjs/next-auth-typescript-example/blob/main/pages/api/auth/%5B...nextauth%5D.ts
// https://github.com/nextauthjs/next-auth-example
// https://github.com/nextauthjs/next-auth/discussions/805
// https://nextjs.org/docs/authentication
// https://blog.logrocket.com/building-authorization-api-next-js/
// https://youtu.be/v6LoiRHRQzA

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // ...add more providers here
  ],
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      console.log("cb jwt", token, user, account, profile, isNewUser);
      // token.isAdmin = true;
      return token;
    },
    async session({ session, token, user }) {
      console.log("cb session", session, token, user);
      // session.isAdmin = token.isAdmin;
      return session;
    },
  },
});
