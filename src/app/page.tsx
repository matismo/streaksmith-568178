"use client";

import { useAccount, useConnect, useDisconnect, useReadContract, useWriteContract } from "wagmi";
import { useMemo, useState, type CSSProperties } from "react";
import { isAddress } from "viem";

const contractAddress = "0x9Be286c48445acacADC282d6c283C3F5d5Ff97cE" as const;
const contractUrl = `https://sepolia.basescan.org/address/${contractAddress}`;

const abi = [
  { type: "function", name: "name", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { type: "function", name: "symbol", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { type: "function", name: "owner", stateMutability: "view", inputs: [], outputs: [{ type: "address" }] },
  { type: "function", name: "totalSupply", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "baseURI", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { type: "function", name: "mintNext", stateMutability: "nonpayable", inputs: [{ name: "to", type: "address" }], outputs: [{ type: "uint256" }] },
] as const;

const features = [
  {
    title: "Base-ready auth",
    description: "Connect with an injected wallet and read contract data instantly.",
  },
  {
    title: "Onchain badge supply",
    description: "Track the live supply and metadata anchors for streak badges.",
  },
  {
    title: "Owner-gated minting",
    description: "Only the contract owner can mint new streak proof tokens.",
  },
  {
    title: "Explorer transparency",
    description: "Every badge and transaction links directly to BaseScan.",
  },
];

const steps = [
  {
    title: "Connect your wallet",
    description: "Use a Base Sepolia wallet to authenticate and unlock owner actions.",
  },
  {
    title: "Review the contract",
    description: "Confirm the name, symbol, supply, and metadata endpoint before minting.",
  },
  {
    title: "Mint the next badge",
    description: "Owners can mint the next streak badge to any recipient address.",
  },
];

const heroDelay = { "--delay": "0.05s" } as CSSProperties;
const featureDelay = { "--delay": "0.12s" } as CSSProperties;
const stepsDelay = { "--delay": "0.2s" } as CSSProperties;
const mintDelay = { "--delay": "0.28s" } as CSSProperties;
const footerDelay = { "--delay": "0.36s" } as CSSProperties;

const formatAddress = (value?: string) => {
  if (!value) return "-";
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
};

export default function Page() {
  const { address, isConnected, connector } = useAccount();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { writeContractAsync, isPending: isMinting } = useWriteContract();
  const [mintTo, setMintTo] = useState("");
  const [mintError, setMintError] = useState<string | null>(null);

  const { data: name } = useReadContract({ address: contractAddress, abi, functionName: "name" });
  const { data: symbol } = useReadContract({ address: contractAddress, abi, functionName: "symbol" });
  const { data: owner } = useReadContract({ address: contractAddress, abi, functionName: "owner" });
  const { data: totalSupply } = useReadContract({ address: contractAddress, abi, functionName: "totalSupply" });
  const { data: baseURI } = useReadContract({ address: contractAddress, abi, functionName: "baseURI" });

  const ownerAddress = typeof owner === "string" ? owner : undefined;
  const isOwner = useMemo(() => {
    if (!ownerAddress || !address) return false;
    return ownerAddress.toLowerCase() === address.toLowerCase();
  }, [ownerAddress, address]);

  const displayName = typeof name === "string" ? name : "-";
  const displaySymbol = typeof symbol === "string" ? symbol : "-";
  const displaySupply = typeof totalSupply === "bigint" ? totalSupply.toString() : "-";
  const displayBaseUri = typeof baseURI === "string" && baseURI.length > 0 ? baseURI : "-";

  const primaryConnector = connectors[0];
  const recipient = mintTo.trim() || address || "";
  const isValidRecipient = recipient ? isAddress(recipient) : false;
  const canMint = isConnected && isOwner && isValidRecipient && !isMinting;
  const showRecipientError = Boolean(mintTo.trim()) && !isValidRecipient;
  const connectDisabled = !primaryConnector || isConnecting;
  const connectLabel = primaryConnector
    ? isConnecting
      ? "Connecting..."
      : "Connect wallet"
    : "No wallet detected";

  async function handleMint() {
    if (!recipient || !isValidRecipient) return;
    setMintError(null);
    try {
      await writeContractAsync({
        address: contractAddress,
        abi,
        functionName: "mintNext",
        args: [recipient],
      });
    } catch (error) {
      setMintError("Mint failed. Check your wallet for details.");
    }
  }

  return (
    <main className="page">
      <header className="hero reveal" style={heroDelay}>
        <div className="hero-copy">
          <p className="eyebrow">StreakSmith</p>
          <h1 className="hero-title">Make daily usage feel collectible.</h1>
          <p className="subtitle">
            Turn repeat product usage into verifiable streak badges on Base Sepolia.
          </p>
          <div className="cta-row">
            {!isConnected ? (
              <button className="btn primary" type="button" onClick={() => primaryConnector && connect({ connector: primaryConnector })} disabled={connectDisabled}>
                {connectLabel}
              </button>
            ) : (
              <button className="btn secondary" type="button" onClick={() => disconnect()}>
                Disconnect
              </button>
            )}
            <a className="btn ghost" href={contractUrl} target="_blank" rel="noreferrer">
              View contract
            </a>
          </div>
          <div className="meta-row">
            <span className="pill">Base Sepolia</span>
            <span className={`pill ${isConnected ? "pill-live" : "pill-muted"}`}>
              {isConnected ? "Wallet connected" : "Wallet not connected"}
            </span>
          </div>
        </div>
        <div className="panel hero-panel">
          <div className="panel-header">
            <h3>Contract snapshot</h3>
            <span className={`status${isOwner ? "" : " status-warn"}`}>
              {isOwner ? "Owner access" : "Owner locked"}
            </span>
          </div>
          <dl className="stat-grid">
            <div>
              <dt>Name</dt>
              <dd>{displayName}</dd>
            </div>
            <div>
              <dt>Symbol</dt>
              <dd>{displaySymbol}</dd>
            </div>
            <div>
              <dt>Total supply</dt>
              <dd>{displaySupply}</dd>
            </div>
            <div>
              <dt>Owner</dt>
              <dd className="mono" title={ownerAddress || undefined}>{formatAddress(ownerAddress)}</dd>
            </div>
            <div className="stat-wide">
              <dt>Base URI</dt>
              <dd className="mono" title={displayBaseUri}>{displayBaseUri}</dd>
            </div>
          </dl>
          <div className="divider" />
          <div className="wallet-summary">
            <div>
              <p className="label">Active wallet</p>
              <p className="value">{isConnected ? formatAddress(address) : "Not connected"}</p>
            </div>
            <div>
              <p className="label">Connector</p>
              <p className="value">{connector?.name || primaryConnector?.name || "None detected"}</p>
            </div>
          </div>
          {address && (
            <p className="mono muted-text" title={address}>
              {address}
            </p>
          )}
        </div>
      </header>

      <section className="section reveal" style={featureDelay}>
        <div className="section-header">
          <h2>Retention toolkit</h2>
          <p>Give builders a clear, onchain signal that daily use is worth showing off.</p>
        </div>
        <div className="feature-grid">
          {features.map((feature) => (
            <div className="feature-card" key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section reveal" style={stepsDelay}>
        <div className="section-header">
          <h2>How it works</h2>
          <p>Connect, verify, and mint the next badge in a few quick steps.</p>
        </div>
        <ol className="steps">
          {steps.map((step) => (
            <li key={step.title}>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="section reveal" style={mintDelay}>
        <div className="section-header">
          <h2>Owner mint</h2>
          <p>Only the contract owner can mint streak badges. Connect the owner wallet to enable minting.</p>
        </div>
        <div className="panel mint-panel">
          <div className="mint-row">
            <label className="label" htmlFor="mintTo">Recipient address</label>
            <div className="mint-controls">
              <input
                id="mintTo"
                className="input"
                placeholder="Defaults to connected wallet"
                value={mintTo}
                onChange={(event) => setMintTo(event.target.value)}
              />
              <button className="btn primary" type="button" disabled={!canMint} onClick={handleMint}>
                {isMinting ? "Minting..." : "Mint badge"}
              </button>
            </div>
          </div>
          <div className="mint-meta">
            <span className="helper">
              {isConnected ? "Minting is enabled only for the owner address." : "Connect your wallet to continue."}
            </span>
            {showRecipientError && <span className="error">Enter a valid recipient address.</span>}
            {mintError && <span className="error">{mintError}</span>}
          </div>
        </div>
      </section>

      <footer className="footer reveal" style={footerDelay}>
        <div>
          <p className="footer-title">StreakSmith</p>
          <p className="muted-text">Retention badges on Base Sepolia.</p>
        </div>
        <div className="footer-meta">
          <span className="mono" title={contractAddress}>Contract: {formatAddress(contractAddress)}</span>
          {isConnected && address && <span className="mono" title={address}>Wallet: {formatAddress(address)}</span>}
        </div>
      </footer>
    </main>
  );
}
