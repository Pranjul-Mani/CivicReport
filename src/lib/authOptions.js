import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "./dbConnect";
import User from "@/models/user";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await dbConnect();
        const { email, password } = credentials || {};
        if (!email || !password) return null;

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name || ""
        };
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
    
      if (user) {
        token.id = user.id || user?.sub || token?.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: "/auth/signin", 
  }
};

export default authOptions;
