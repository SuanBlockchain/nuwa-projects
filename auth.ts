import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getUser, saltAndHashPassword } from "@/app/lib/utils";

export const { signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await getUser(email);
        if (!user) {
          throw new Error("Invalid credentials.");
        }

        // const pwHash = await saltAndHashPassword(password);
        // console.log(pwHash, user.password);
        // if (pwHash !== user.password) { // Assuming user.password is the stored hash
        //   throw new Error("Invalid credentials.");
        // }

        return user; // Return user object if credentials match
      },
    }),
  ],
});