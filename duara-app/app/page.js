"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useEffect } from "react";
import { useIsMiniPay } from "@/hooks/useIsMiniPay";
import { CreateCircle } from "./CreateCircle";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const isMiniPay = useIsMiniPay();

  useEffect(() => {
    if (isMiniPay && !isConnected && connectors[0]) {
      connect({ connector: connectors[0] });
    }
  }, [isMiniPay, isConnected, connectors, connect]);

  return (
    <main className="flex-1 flex flex-col items-center justify-start p-8 gap-6 text-center">
      <h1 className="text-3xl font-bold">Duara</h1>
      <p className="text-gray-500 max-w-md">
        Decentralized savings circles on Celo. Join a circle, contribute cUSD
        each cycle, and get paid out in turn — no admin, no trust required.
      </p>

      {isMiniPay ? (
        <p className="text-green-600 font-medium">
          MiniPay detected — connecting automatically...
        </p>
      ) : isConnected ? (
        <div className="flex flex-col items-center gap-2">
          <p className="font-mono text-sm">{address}</p>
          <button
            onClick={() => disconnect()}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={() => connect({ connector: connectors[0] })}
          className="px-6 py-3 rounded-lg bg-black text-white hover:bg-gray-800"
        >
          Connect Wallet
        </button>
      )}

      <CreateCircle />
    </main>
  );
}
