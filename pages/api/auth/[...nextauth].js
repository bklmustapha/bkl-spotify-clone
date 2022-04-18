import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify";


async function refreshAccessToken(token) {
  try {
    console.log('ACCESS_TOKEN', token.accessToken);
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);

    const {body: refreshedToken} = await spotifyApi.refreshAccessToken();

    console.log("REFRESSHED TOKEN IS", refreshedToken);

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now() . refreshedToken.expires_in * 1000, // = 1 hour as 3600 returns from spotify api
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken, // Replace if new one came back else fall back to old refresh token

    }
  } catch(error) {
    console.error("ERROR ",error);

    return {
      ...token,
      error: "RefreshAccessTokenError"
    }
  }
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: LOGIN_URL,
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({token, account, user}) {
      // initial sign in
      if(account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: account.expires_at * 1000 // convert to ms
        }
      }

      // Return previous token if the access token has not expired not expired yet
      if(Date.now() < token.accessTokenExpires) {
        console.log("EXISTING ACCESS TOKEN IS VALID => ", token);
        return token;
      }

      // Access token has expired, so we need to refresh it...
      console.log("ACCESS TOKEN HAS EXPIRED, REFRESHING...");
      return await refreshAccessToken(token)
    },
    async session({session, token}) {
      console.log('token.accessToken', token.accessToken);
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.username = token.username;
  
      console.log('SESSION 2 =>', session);
      return session;
    }
  },

    
})