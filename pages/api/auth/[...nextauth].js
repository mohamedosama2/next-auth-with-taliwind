import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "my-project",
      credentials: {
        email: {
          label: "phone",
          type: "phone",
          placeholder: "jsmith@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const payload = {
          phone: credentials.phone,
          password: credentials.password,
        };
        console.log(payload);

        const res = await fetch(
          "https://elearningloutas.herokuapp.com/auth/login",
          {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const user = await res.json();
        if (!res.ok) {
          throw new Error(user.exception);
        }
        // If no error and we have user data, return it
        if (res.ok && user) {
          return user;
        }

        // Return null if user data could not be retrieved
        return null;
      },
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          accessToken: user.token,
          sub: user,
        };
      }

      return token;
    },

    async session({ session, token, user }) {
      /*       console.log("Sessions", token);
      console.log("user", user); */
      session.user.accessToken = token.accessToken;
      session.user.info = token.sub.user;

      return session;
    },
  },
  theme: {
    colorScheme: "auto", // "auto" | "dark" | "light"
    brandColor: "", // Hex color code #33FF5D
    logo: "/vercel.svg", // Absolute URL to image
  },
  // Enable debug messages in the console if you are having problems
  debug: process.env.NODE_ENV === "development",
});
