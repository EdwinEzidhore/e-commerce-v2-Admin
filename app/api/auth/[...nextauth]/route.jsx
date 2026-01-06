import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Admin from "@/lib/modals/Admin.js";
import connect from "@/lib/db";
import bcrypt from "bcrypt"
import { throwError } from "@/helper/errorHandler";


export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "email", type: 'email' },
        password: { label: "password", type: "password" },
        
      },
      async authorize(credentials) {
        

        
        try {

          await connect();
          console.log("checking user!");
          const user = await Admin.findOne({ email: credentials.email });
          if (!user) {
            throwError("user not found!")
          }
          if (user) {
            const isPassword_valid = await bcrypt.compare(
              credentials.password,
              user.password,
            )
            if (isPassword_valid) {
              return user;
            } else {
              throw new Error("Incorrect Password!");
            }
          }
        } catch (error) {
          throw error
        }
      }
    
    })
  ],
  pages: {
    signIn :'/'
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },
  callbacks: {
    async jwt({token, user}){
      if (user) {
        token.id = user._id;
        token.email = user.email;
      }
      return token;
    },
    async session ({ session, token, user }) {
      session.user = {
        name: token.name,
        email:token.email,
      };
      return session;
     
    }
  }
}

export const handler = NextAuth(authOptions);
export  {handler as GET,handler as POST }