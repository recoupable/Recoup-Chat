"use client";

import { PrivyProvider as Privy } from "@privy-io/react-auth";

export default function PrivyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Log the Privy App ID to confirm it's loaded
  console.log("Privy App ID:", process.env.NEXT_PUBLIC_PRIVY_APP_ID);

  return (
    <Privy
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
      config={{
        appearance: {
          theme: "light",
          accentColor: "#003199",
          logo: "/logo-light.svg",
        },
        loginMethods: ["email"],
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      {children}
    </Privy>
  );
}