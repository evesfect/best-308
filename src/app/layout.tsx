"use client"; // Enable client-side rendering for layout

import './fonts/global.css'; // Adjust path if needed


import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Wrap your app with SessionProvider for auth context */}
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
