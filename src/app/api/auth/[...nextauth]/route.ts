import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoClient } from 'mongodb';
import { compare } from 'bcryptjs';

let client: MongoClient;

async function connectToDatabase() {
    if (!client) {
        client = await MongoClient.connect(process.env.MONGO_URI as string, {
            maxPoolSize: 10,
        });
    }
    return client.db();
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials): Promise<any | null> {
                console.log("Attempting to authorize:", credentials?.email);
                const db = await connectToDatabase();
                const usersCollection = db.collection('user');

                const user = await usersCollection.findOne({
                    email: credentials?.email,
                });

                console.log("User found:", user);

                if (!user) {
                    console.log("No user found with that email");
                    throw new Error('No user found with that email');
                }

                const isValid = await compare(credentials!.password, user.password);
                console.log("Password valid:", isValid);

                if (!isValid) {
                    console.log("Incorrect password");
                    throw new Error('Incorrect password');
                }

                return {
                    id: user._id.toString(),
                    email: user.email,
                    role: user.role,
                    name: user.username
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.role = token.role as string;
            session.user.id = token.id as string;
            return session;
        },
    },
    pages: {
        signIn: '/auth/signin',
    },
    session: {
        maxAge: 24 * 60 * 60,
        updateAge: 12 * 60 * 60,
    },
};

export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
