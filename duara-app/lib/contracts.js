export const CIRCLE_SAVINGS_ADDRESS = process.env.NEXT_PUBLIC_CIRCLE_SAVINGS_ADDRESS;
export const CUSD_ADDRESS = process.env.NEXT_PUBLIC_CUSD_ADDRESS;

export const CIRCLE_SAVINGS_ABI = [
  {
    inputs: [
      { internalType: "address[]", name: "members", type: "address[]" },
      { internalType: "uint256", name: "contributionAmount", type: "uint256" },
      { internalType: "uint256", name: "cycleDuration", type: "uint256" },
    ],
    name: "createCircle",
    outputs: [{ internalType: "uint256", name: "circleId", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "circleId", type: "uint256" }],
    name: "contribute",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "circleId", type: "uint256" }],
    name: "triggerPayout",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "circles",
    outputs: [
      { internalType: "address", name: "creator", type: "address" },
      { internalType: "uint256", name: "contributionAmount", type: "uint256" },
      { internalType: "uint256", name: "cycleDuration", type: "uint256" },
      { internalType: "uint256", name: "currentRound", type: "uint256" },
      { internalType: "uint256", name: "roundStart", type: "uint256" },
      { internalType: "bool", name: "active", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "circleCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "circleId", type: "uint256" }],
    name: "getMembers",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "address", name: "", type: "address" },
    ],
    name: "contributed",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
];

export const ERC20_ABI = [
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];
