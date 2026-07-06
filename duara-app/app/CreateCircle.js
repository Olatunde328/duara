"use client";

import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import {
  CIRCLE_SAVINGS_ADDRESS,
  CIRCLE_SAVINGS_ABI,
  CUSD_ADDRESS,
  ERC20_ABI,
} from "@/lib/contracts";

export function CreateCircle() {
  const { address, isConnected } = useAccount();
  const [members, setMembers] = useState("");
  const [amount, setAmount] = useState("10");
  const [days, setDays] = useState("1");

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  function handleCreate() {
    const memberList = members
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean);

    if (memberList.length < 3) {
      alert("Add at least 3 wallet addresses, separated by commas.");
      return;
    }

    writeContract({
      address: CIRCLE_SAVINGS_ADDRESS,
      abi: CIRCLE_SAVINGS_ABI,
      functionName: "createCircle",
      args: [memberList, parseEther(amount), BigInt(Number(days) * 86400)],
    });
  }

  if (!isConnected) return null;

  return (
    <div className="w-full max-w-md flex flex-col gap-3 border rounded-xl p-6 mt-6 text-left">
      <h2 className="text-xl font-semibold">Create a Savings Circle</h2>

      <label className="text-sm font-medium">
        Member wallet addresses (comma-separated, min 3)
      </label>
      <textarea
        className="border rounded-lg p-2 text-sm font-mono"
        rows={3}
        placeholder="0xabc..., 0xdef..., 0x123..."
        value={members}
        onChange={(e) => setMembers(e.target.value)}
      />

      <label className="text-sm font-medium">Contribution amount (cUSD)</label>
      <input
        className="border rounded-lg p-2 text-sm"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <label className="text-sm font-medium">Cycle length (days)</label>
      <input
        className="border rounded-lg p-2 text-sm"
        type="number"
        value={days}
        onChange={(e) => setDays(e.target.value)}
      />

      <button
        onClick={handleCreate}
        disabled={isPending || isConfirming}
        className="mt-2 px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 disabled:opacity-50"
      >
        {isPending || isConfirming ? "Creating..." : "Create Circle"}
      </button>

      {error && (
        <p className="text-red-600 text-sm break-words">{error.shortMessage || error.message}</p>
      )}
      {isSuccess && (
        <p className="text-green-600 text-sm">Circle created successfully!</p>
      )}
    </div>
  );
}
