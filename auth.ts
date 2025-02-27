import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
// Your own logic for dealing with plaintext password strings; be careful!
import { getUser, saltAndHashPassword } from "@/app/lib/utils";
 
export const { signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials: Partial<Record<"email" | "password", unknown>>, request: Request) => {
        let user = null
 
        // logic to salt and hash password
        const pwHash = await saltAndHashPassword(credentials.password as string)
 
        // logic to verify if the user exists
        user = await getUser(credentials.email as string)
 
        if (!user) {
          // No user found, so this is their first attempt to login
          // Optionally, this is also the place you could do a user registration
          throw new Error("Invalid credentials.")
        }
 
        // return user object with their profile data
        return user
      },
    }),
  ],
})