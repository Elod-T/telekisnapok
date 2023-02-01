import NextAuth from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";

export const authOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID,
      httpOptions: {
        timeout: 5000,
      },
      authorization: {
        params: {
          scope: "openid profile user.Read email offline_access",
        },
      },
    }),
  ],
  jwt: {
    maxAge: 60 * 60 * 24 * 30,
  },
};

export default NextAuth(authOptions);
