// /api/auth/[...nextauth]


import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoClient } from 'mongodb';
import { compare } from 'bcryptjs';

let client: MongoClient;

async function connectToDatabase() {
    if (!client) {
        client = await MongoClient.connect('mongodb+srv://root:rpassword@cluster0.rz8bd.mongodb.net/e-commerce?retryWrites=true&w=majority', {
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
                console.log("==== Authorization Start ====");
                console.log("Attempting to authorize:", credentials?.email);
                try {
                    const db = await connectToDatabase();
                    console.log("Database connected:", db.databaseName);
                    const usersCollection = db.collection('user');

                    const user = await usersCollection.findOne({
                        email: credentials?.email,
                    });
                    console.log("User found:", user ? "Yes" : "No");

                    if (!user) {
                        console.log("No user found with that email");
                        throw new Error('USER_NOT_FOUND');
                    }

                    console.log("Comparing passwords...");
                    const isValid = await compare(credentials!.password, user.password);
                    console.log("Password comparison result:", isValid);

                    if (!isValid) {
                        console.log("Incorrect password");
                        throw new Error('INCORRECT_PASSWORD');
                    }

                    console.log("==== Authorization Success ====");
                    return {
                        id: user._id.toString(),
                        email: user.email,
                        role: user.role,
                        name: user.username
                    };
                } catch (error) {
                    console.error("==== Authorization Error ====");
                    console.error(error.message);
                    if (error.message === 'USER_NOT_FOUND' || error.message === 'INCORRECT_PASSWORD') {
                        throw new Error(error.message); // Rethrow to pass the error message back to the client.
                    }
                    return null;
                }
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