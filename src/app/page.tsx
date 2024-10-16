"use client";

import { useSession, signIn, signOut } from "next-auth/react";

const Home = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
      <div>
        {session ? (
            <div>
              <h1>Welcome, {session.user?.name}!</h1>
              <p>Email: {session.user?.email}</p>
              <button onClick={() => signOut()}>Sign out</button>
            </div>
        ) : (
            <div>
              <h1>You are not signed in</h1>
              <button onClick={() => signIn()}>Sign in</button>
            </div>
        )}
      </div>
  );
};

export default Home;
