"use client";

import { useEffect, useState } from "react";

/**
 * useIsMiniPay - detects whether the dApp is running inside the MiniPay
 * in-app browser so the UI can auto-connect and simplify the experience.
 */
export function useIsMiniPay() {
  const [isMiniPay, setIsMiniPay] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.ethereum && window.ethereum.isMiniPay) {
      setIsMiniPay(true);
    }
  }, []);

  return isMiniPay;
}
