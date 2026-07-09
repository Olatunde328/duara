"use client";

import { useState } from "react";
import {
  useAccount,
  useReadContract,
  useReadContracts,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { formatEther, parseEther } from "viem";
import {
  CIRCLE_SAVINGS_ADDRESS,
  CIRCLE_SAVINGS_ABI,
  CUSD_ADDRESS,
  ERC20_ABI,
} from "@/lib/contracts";

export function ViewCircle() {
  const { address, isConnected } = useAccount();
  const [circleId, setCircleId] = useState("");
  const [submittedId, setSubmittedId] = useState(null);

  const { data: circle } = useReadContract({
    address: CIRCLE_SAVINGS_ADDRESS,
    abi: CIRCLE_SAVINGS_ABI,
    functionName: "circles",
    args: submittedId !== null ? [BigInt(submittedId)] : undefined,
    query: { enabled: submittedId !== null },
  });

  const { data: members } = useReadContract({
    address: CIRCLE_SAVINGS_ADDRESS,
    abi: CIRCLE_SAVINGS_ABI,
    functionName: "getMembers",
    args: submittedId !== null ? [BigInt(submittedId)] : undefined,
    query: { enabled: submittedId !== null },
  });

  const [creator, contributionAmount, cycleDuration, currentRound, roundStart, active] =
    circle || [];

  // Check each member's contribution status for the current round
  const { data: contributedStatus } = useReadContracts({
    contracts:
      members && submittedId !== null && currentRound !== undefined
        ? members.map((m) => ({
            address: CIRCLE_SAVINGS_ADDRESS,
            abi: CIRCLE_SAVINGS_ABI,
            functionName: "contributed",
            args: [BigInt(submittedId), currentRound, m],
          }))
        : [],
    query: { enabled: !!members && submittedId !== null && currentRound !== undefined },
  });

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const isMember =
    members && address && members.some((m) => m.toLowerCase() === address.toLowerCase());

  function handleLookup() {
    if (circleId === "") return;
    setSubmittedId(circleId);
  }

  function handleApprove() {
    if (!contributionAmount) return;
    writeContract({
      address: CUSD_ADDRESS,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [CIRCLE_SAVINGS_ADDRESS, contributionAmount],
    });
  }

  function handleContribute() {
    writeContract({
      address: CIRCLE_SAVINGS_ADDRESS,
      abi: CIRCLE_SAVINGS_ABI,
      functionName: "contribute",
      args: [BigInt(submittedId)],
    });
  }

  function handleTriggerPayout() {
    writeContract({
      address: CIRCLE_SAVINGS_ADDRESS,
      abi: CIRCLE_SAVINGS_ABI,
      functionName: "triggerPayout",
      args: [BigInt(submittedId)],
    });
  }

  if (!isConnected) return null;

  return (
    <div className="w-full max-w-md flex flex-col gap-3 rounded-xl p-6 text-left text-black">
      <h2 className="text-xl font-semibold">View / Join a Circle</h2>

      <label className="text-sm font-medium">Circle ID</label>
      <div className="flex gap-2">
        <input
          className="border rounded-lg p-2 text-sm flex-1"
          type="number"
          placeholder="0"
          value={circleId}
          onChange={(e) => setCircleId(e.target.value)}
        />
        <button
          onClick={handleLookup}
          className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm"
        >
          Look up
        </button>
      </div>

      {circle && creator && creator !== "0x0000000000000000000000000000000000000000" && (
        <div className="text-sm flex flex-col gap-1 mt-2 bg-gray-50 rounded-lg p-3">
          <p><span className="font-medium">Creator:</span> {creator}</p>
          <p><span className="font-medium">Contribution:</span> {formatEther(contributionAmount)} cUSD</p>
          <p><span className="font-medium">Cycle length:</span> {Number(cycleDuration) / 86400} day(s)</p>
          <p><span className="font-medium">Current round:</span> {String(currentRound)}</p>
          <p><span className="font-medium">Status:</span> {active ? "Active" : "Completed"}</p>

          {members && (
            <div className="mt-2">
              <p className="font-medium mb-1">Members this round:</p>
              <ul className="flex flex-col gap-1">
                {members.map((m, i) => {
                  const hasPaid = contributedStatus?.[i]?.result;
                  return (
                    <li key={m} className="font-mono text-xs flex items-center gap-2">
                      <span>{hasPaid ? "✅" : "⏳"}</span>
                      <span>{m}</span>
                      {m.toLowerCase() === address?.toLowerCase() && (
                        <span className="text-gray-400">(you)</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {!isMember && (
            <p className="text-amber-600 mt-2">
              Your connected wallet is not a member of this circle.
            </p>
          )}
        </div>
      )}

      {circle && active && isMember && (
        <div className="flex flex-col gap-2 mt-2">
          <button
            onClick={handleApprove}
            disabled={isPending || isConfirming}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-sm"
          >
            {isPending || isConfirming ? "Processing..." : "1. Approve cUSD"}
          </button>
          <button
            onClick={handleContribute}
            disabled={isPending || isConfirming}
            className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {isPending || isConfirming ? "Processing..." : "2. Contribute This Round"}
          </button>
          <button
            onClick={handleTriggerPayout}
            disabled={isPending || isConfirming}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-sm"
          >
            3. Trigger Payout (once everyone has paid)
          </button>
        </div>
      )}

      {error && (
        <p className="text-red-600 text-sm break-words">
          {error.shortMessage || error.message}
        </p>
      )}
      {isSuccess && (
        <p className="text-green-600 text-sm">Transaction confirmed!</p>
      )}
    </div>
  );
}
