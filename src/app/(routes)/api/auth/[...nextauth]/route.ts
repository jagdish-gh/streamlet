import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          scope: 'openid profile email https://www.googleapis.com/auth/youtube.readonly',
          // Add other scopes if needed
        },
      },
    }),
  ],
  secret: process.env.SecretKey as string,
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  
    async session({ session, token }) {
      // Send properties to the client, like the user's access token.
      session.accessToken = token.accessToken as string;
      return session;
    }
  },
});

export { handler as GET, handler as POST };