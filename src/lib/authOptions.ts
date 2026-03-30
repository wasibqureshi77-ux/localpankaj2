import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        phone: { label: "Phone", type: "text" },
        otp: { label: "OTP", type: "text" },
        name: { label: "Name", type: "text" },
        isOtp: { label: "IsOtp", type: "boolean" }
      },
      async authorize(credentials) {
        await connectDB();
        
        // Handle OTP Login/Registration
        if (credentials?.isOtp === "true" && credentials?.phone && credentials?.otp) {
          const Otp = (await import("@/models/Otp")).default;
          
          // 1. Verify OTP
          const record = await Otp.findOne({ phone: credentials.phone, otp: credentials.otp });
          if (!record || record.expiresAt < new Date()) {
            throw new Error("Invalid or Expired OTP");
          }

          // 2. Clear OTP
          await Otp.deleteOne({ _id: record._id });

          // 3. Find or Create User
          let user = await User.findOne({ phone: credentials.phone });
          if (!user) {
             const autoPass = Math.random().toString(36).slice(-10);
             const hashedPassword = await bcrypt.hash(autoPass, 10);
             user = await User.create({
                name: credentials.name || "Member",
                phone: credentials.phone,
                email: credentials.email || `${credentials.phone}@localpankaj.com`,
                password: hashedPassword,
                role: "USER"
             });
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
          } as any;
        }

        // Standard Email/Phone + Password
        const identifier = credentials?.email;
        if (!identifier || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const user = await User.findOne({
           $or: [
              { email: identifier },
              { phone: identifier }
           ]
        });
        
        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isPasswordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordMatch) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.phone = user.phone;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.phone = token.phone;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth-error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
