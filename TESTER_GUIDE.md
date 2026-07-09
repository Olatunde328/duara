## 🧪 Tester Guide — What Duara Does & How to Try It (Safely)

### What Duara does
Duara is an on-chain version of a rotating savings circle (chama/ajo/esusu). A small group agrees to contribute a fixed amount of cUSD each cycle; the full pot is paid out to a different member each round, in order, until everyone has received a payout once. The smart contract enforces the rules — there is no admin holding the money.

### ✅ Safe to try right now (no real money needed)
- Connect your wallet
- **Create a circle**: enter at least 3 wallet addresses, a contribution amount, and a cycle length
- **Look up any circle by ID** and see its members, round, and status
- Explore the UI, try different inputs, get familiar with the flow

### ⚠️ Please read before clicking "Contribute"
"Contribute" sends **real cUSD** into the contract. Right now, Duara has **no refund function** — if the other members in a circle never contribute, your funds stay locked in the contract with no way to withdraw them.

**Only click "Approve" and "Contribute" if:**
- You are testing together with the other members of that specific circle, all ready to contribute in the same session, OR
- You're comfortable with the small test amount potentially being stuck if the group doesn't complete a full round

**Do not** contribute real cUSD to a circle where you're the only one actually participating (e.g. a circle where the other 3 addresses are just test wallets you don't control) — that cUSD will not come back right now.

### What you'll need to fully test contributing
- A Celo-compatible wallet (MetaMask + Celo Mainnet network, Valora, or MiniPay)
- A small amount of **CELO** (for gas — a few cents' worth is enough)
- A small amount of **cUSD** matching the circle's contribution amount

### Known limitations (being upgraded next)
- No refund mechanism yet if a circle doesn't complete (planned: time-locked auto-refund)
- Circle membership is fixed at creation — no self-service "accept invite" yet
- No way to browse/discover circles you're part of — you need the exact Circle ID
- No automated reminders for whose turn it is to contribute

Feedback on any of this is genuinely welcome — this is an active build.
