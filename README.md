# Sample Hardhat 3 Project (`node:test` and `viem`)
## 🌀 How Duara Works

Duara brings the trust of traditional rotating savings circles (chama/ajo/esusu) on-chain — no admin, no trust required, just smart contract rules.

### Try it live
👉 **[Launch Duara](https://duara.vercel.app)**

### What you'll need
- A Celo-compatible wallet (MetaMask, Valora, or MiniPay)
- A small amount of **CELO** (for gas fees)
- A small amount of **cUSD** (to contribute to a circle)

### Steps to try it
1. **Connect your wallet** — make sure it's set to **Celo Mainnet**
2. **Create a circle** — enter at least 3 member wallet addresses (comma-separated), a contribution amount in cUSD, and a cycle length in days
3. **Contribute** — each member sends their fixed cUSD share for the round
4. **Automatic payout** — once everyone in the circle has contributed, the contract automatically sends the full pot to the next member in rotation
5. Repeat each cycle until every member has received a payout once

### Verified Contracts (Celo Mainnet)
- **CircleSavings:** [`0x132d8a34dA9957E4B1aF5D3e1D5e475D49fC4D5F`](https://celoscan.io/address/0x132d8a34dA9957E4B1aF5D3e1D5e475D49fC4D5F#code)
- **ReputationBadge:** [`0xecCb91BF566CEf2d29F630c04A38Efe49331a9Cc`](https://celoscan.io/address/0xecCb91BF566CEf2d29F630c04A38Efe49331a9Cc#code)

Built for [Celo Proof of Ship](https://www.celopg.eco/proof-of-ship) 🚢

This project showcases a Hardhat 3 project using the native Node.js test runner (`node:test`) and the `viem` library for Ethereum interactions.

To learn more about Hardhat 3, please visit the [Getting Started guide](https://hardhat.org/docs/getting-started#getting-started-with-hardhat-3). To share your feedback, join our [Hardhat 3](https://hardhat.org/hardhat3-telegram-group) Telegram group or [open an issue](https://github.com/NomicFoundation/hardhat/issues/new) in our GitHub issue tracker.

## Project Overview

This example project includes:

- A simple Hardhat configuration file.
- Foundry-compatible Solidity unit tests.
- TypeScript integration tests using [`node:test`](nodejs.org/api/test.html), the new Node.js native test runner, and [`viem`](https://viem.sh/).
- Examples demonstrating how to connect to different types of networks, including locally simulating OP mainnet.

## Usage

### Running Tests

To run all the tests in the project, execute the following command:

```shell
npx hardhat test
```

You can also selectively run the Solidity or `node:test` tests:

```shell
npx hardhat test solidity
npx hardhat test nodejs
```

### Make a deployment to Sepolia

This project includes an example Ignition module to deploy the contract. You can deploy this module to a locally simulated chain or to Sepolia.

To run the deployment to a local chain:

```shell
npx hardhat ignition deploy ignition/modules/Counter.ts
```

To run the deployment to Sepolia, you need an account with funds to send the transaction. The provided Hardhat configuration includes a Configuration Variable called `SEPOLIA_PRIVATE_KEY`, which you can use to set the private key of the account you want to use.

You can set the `SEPOLIA_PRIVATE_KEY` variable using the `hardhat-keystore` plugin or by setting it as an environment variable.

To set the `SEPOLIA_PRIVATE_KEY` config variable using `hardhat-keystore`:

```shell
npx hardhat keystore set SEPOLIA_PRIVATE_KEY
```

After setting the variable, you can run the deployment with the Sepolia network:

```shell
npx hardhat ignition deploy --network sepolia ignition/modules/Counter.ts
```
