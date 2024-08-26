import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import GoogleProvider from 'next-auth/providers/google';
const prisma = new PrismaClient();

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: { id: true, email: true, password: true, vehicles: true },
        });

        if (
          user &&
          user.password &&
          (await bcrypt.compare(credentials.password, user.password))
        ) {
          return { id: user.id, email: user.email };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        const email = user.email;

        if (email) {
          const existingUser = await prisma.user.findUnique({
            where: { email },
            include: {
              vehicles: true, // Include vehicles in the query
            },
          });

          if (!existingUser) {
            // Create a new user with an empty vehicles array
            const newUser = await prisma.user.create({
              data: {
                email: user.email,
                vehicles: {
                  create: [],
                },
              },
            });
            console.log('New Google user created with vehicles:', newUser);
          }
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      console.log('JWT Token:', token);
      if (user) {
        token.id = user.id || token.sub;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id && token.email) {
        session.user = {
          ...session.user,
          id: token.id as string,
          email: token.email as string,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    maxAge: 3600,
    updateAge: 600,
  },
});

export { handler as GET, handler as POST };
