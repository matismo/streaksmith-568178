# StreakSmith

## Overview
StreakSmith is a Base dapp that turns daily usage into onchain streak badges. It gives builders a simple retention primitive when activity cools and onboarding is bursty.

## Why it exists
Base saw a short‑term dip in daily actives and new wallets. That’s a classic signal to focus on retention loops rather than only acquisition.

## What shipped
- A Next.js 16 dapp with wallet connect
- Streak tracking and reset logic
- Onchain streak badge minting
- Cohort view for new vs returning users
- Lightweight activity feed

## How it works
Connect your wallet on Base Sepolia, track your daily streak, and mint a badge when you hit a milestone. The UI reads your streak state onchain and updates after each action.

## Contract
- Network: Base Sepolia
- Address: 0x9Be286c48445acacADC282d6c283C3F5d5Ff97cE
- Explorer: https://sepolia.basescan.org/address/0x9Be286c48445acacADC282d6c283C3F5d5Ff97cE

## Local development
```bash
pnpm install
pnpm dev
```

## Deploy
```bash
pnpm build
pnpm start
```

## Links
- Repo: https://github.com/matismo/streaksmith-568178

## License
MIT
- Web: https://streaksmith-568178.vercel.app
