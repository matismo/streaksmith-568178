# StreakSmith Contracts

## Overview
StreakSmith is an ERC721 badge contract for streak-based retention on Base.

## Deploy
Set environment variables and deploy with Foundry:

```bash
export DEPLOYER=0xYourDeployerAddress
export BASE_URI="https://your-host/metadata/"
forge script contracts/script/DeployERC721.s.sol --rpc-url https://sepolia.base.org --broadcast
```

## Mint
Only the owner can mint new badges:

```bash
cast send <CONTRACT_ADDRESS> "mintNext(address)" <RECIPIENT> --private-key <KEY>
```

## Metadata
Token URIs are derived from the base URI plus tokenId. Host metadata JSON at your base URI.
