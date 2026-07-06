import { useEffect, useState } from "react";

/**
 * useIsMiniPay - detects whether the dApp is running inside the MiniPay
 * in-app browser (Opera Mini / MTN / Opera wallet webview) so the UI can:
 *  - auto-connect the injected wallet without showing a wallet picker
 *  - hide gas fee explanations (MiniPay abstracts gas in cUSD already)
 *  - default all amounts to cUSD
 *
 * This satisfies Celo's "Build for MiniPay" requirement: apps must detect
 * MiniPay and adapt at least one piece of behavior for it.
 */
export function useIsMiniPay() {
  const [isMiniPay, setIsMiniPay] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ethereum = window.ethereum;
    // MiniPay injects window.ethereum.isMiniPay = true
    if (ethereum && ethereum.isMiniPay) {
      setIsMiniPay(true);
    }
  }, []);

  return isMiniPay;
}

/**
 * Example usage in a page/component:
 *
 * import { useIsMiniPay } from "../hooks/useIsMiniPay";
 * import { useConnect } from "wagmi";
 *
 * function ConnectButton() {
 *   const isMiniPay = useIsMiniPay();
 *   const { connect, connectors } = useConnect();
 *
 *   useEffect(() => {
 *     if (isMiniPay) {
 *       // auto-connect to the injected MiniPay wallet, skip the modal
 *       connect({ connector: connectors[0] });
 *     }
 *   }, [isMiniPay]);
 *
 *   if (isMiniPay) return null; // no need to show a connect button at all
 *   return <button onClick={() => connect({ connector: connectors[0] })}>Connect Wallet</button>;
 * }
 */
