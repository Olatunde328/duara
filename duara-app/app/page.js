"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useEffect } from "react";
import { useIsMiniPay } from "@/hooks/useIsMiniPay";
import { CreateCircle } from "./CreateCircle";
import { ViewCircle } from "./ViewCircle";

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

  const guideUrl = "https://github.com/Olatunde328/duara/blob/main/TESTER_GUIDE.md";

  return (
    <main className="flex-1 flex flex-col items-center justify-start p-8 gap-6 text-center text-black bg-gradient-to-b from-sky-100 via-white to-emerald-50 min-h-screen">
      <h1 className="text-4xl font-extrabold tracking-tight text-emerald-700">
        Duara
      </h1>
      <p className="text-gray-700 max-w-md">
        Decentralized savings circles on Celo. Join a circle, contribute cUSD each cycle, and get paid out in turn, no admin, no trust required.
      </p>

      {isMiniPay ? (
        <p className="text-emerald-600 font-medium">
          MiniPay detected, connecting automatically...
        </p>
      ) : isConnected ? (
        <div className="flex flex-col items-center gap-2">
          <p className="font-mono text-sm text-black">{address}</p>
          <button
            onClick={() => disconnect()}
            className="px-4 py-2 rounded-lg bg-sky-100 hover:bg-sky-200 text-black border border-sky-300"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={() => connect({ connector: connectors[0] })}
          className="px-6 py-3 rounded-lg font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/30"
        >
          Connect Wallet
        </button>
      )}

      <div className="w-full flex flex-col items-center gap-4">
        <div className="w-full max-w-md bg-white border border-sky-200 rounded-2xl shadow-sm">
          <CreateCircle />
        </div>
        <div className="w-full max-w-md bg-white border border-sky-200 rounded-2xl shadow-sm">
          <ViewCircle />
        </div>

        <details className="w-full max-w-md bg-white border border-sky-200 rounded-2xl shadow-sm p-4 text-left text-black">
          <summary className="cursor-pointer font-semibold text-emerald-700">
            How It Works and Tester Guide (read before contributing)
          </summary>
          <div className="mt-3 flex flex-col gap-2 text-sm text-gray-700">
            <p>
              Duara is an on-chain rotating savings circle. A group contributes a fixed amount of cUSD each cycle, and the full pot is paid out to a different member each round. No admin, no trust required.
            </p>
            <p className="font-medium text-black">Safe to try:</p>
            <p>Connect your wallet, create a circle, or look up any circle by ID.</p>
            <p className="font-medium text-amber-700">Before clicking Contribute:</p>
            <p>
              Contributing sends real cUSD into the contract. There is currently no refund function. Only contribute if the other members in your circle are ready to contribute too, in the same session.
            </p>
            <p>
              <a href={guideUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline">
                Read the full Tester Guide
              </a>
            </p>
          </div>
        </details>
      </div>
    </main>
  );
}
