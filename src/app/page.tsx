"use client";

import { useAccount, useConnect, useDisconnect, useReadContract, useWriteContract } from "wagmi";
import { useMemo, useState } from "react";

const contractAddress = "0x9Be286c48445acacADC282d6c283C3F5d5Ff97cE" as const;

const abi = [
  { type: "function", name: "name", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { type: "function", name: "symbol", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { type: "function", name: "owner", stateMutability: "view", inputs: [], outputs: [{ type: "address" }] },
  { type: "function", name: "totalSupply", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "baseURI", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { type: "function", name: "mintNext", stateMutability: "nonpayable", inputs: [{ name: "to", type: "address" }], outputs: [{ type: "uint256" }] },
];

export default function Page() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { writeContractAsync, isPending } = useWriteContract();
  const [mintTo, setMintTo] = useState<string>("");

  const { data: name } = useReadContract({ address: contractAddress, abi, functionName: "name" });
  const { data: symbol } = useReadContract({ address: contractAddress, abi, functionName: "symbol" });
  const { data: owner } = useReadContract({ address: contractAddress, abi, functionName: "owner" });
  const { data: totalSupply } = useReadContract({ address: contractAddress, abi, functionName: "totalSupply" });
  const { data: baseURI } = useReadContract({ address: contractAddress, abi, functionName: "baseURI" });

  const isOwner = useMemo(() => {
    if (!owner || !address) return false;
    return owner.toLowerCase() === address.toLowerCase();
  }, [owner, address]);

  async function handleMint() {
    const to = mintTo || address;
    if (!to) return;
    await writeContractAsync({
      address: contractAddress,
      abi,
      functionName: "mintNext",
      args: [to],
    });
  }

  return (
    <main className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">StreakSmith</p>
          <h1>Turn daily usage into proof</h1>
          <p className="subtitle">Retention is slipping. Give users a reason to come back every day.</p>
          <div className="cta-row">
            {!isConnected ? (
              <button className="btn" onClick={() => connect({ connector: connectors[0] })}>Connect wallet</button>
            ) : (
              <button className="btn ghost" onClick={() => disconnect()}>Disconnect</button>
            )}
            <a className="btn ghost" href="https://sepolia.basescan.org/address/0x9Be286c48445acacADC282d6c283C3F5d5Ff97cE" target="_blank">View contract</a>
          </div>
        </div>
        <div className="glass">
          <h3>Onchain snapshot</h3>
          <div className="grid">
            <div><span>Name</span><strong>{String(name || "—")}</strong></div>
            <div><span>Symbol</span><strong>{String(symbol || "—")}</strong></div>
            <div><span>Total supply</span><strong>{totalSupply ? totalSupply.toString() : "—"}</strong></div>
            <div><span>Owner</span><strong className="mono">{owner ? String(owner) : "—"}</strong></div>
            <div className="wide"><span>Base URI</span><strong className="mono">{String(baseURI || "—")}</strong></div>
          </div>
        </div>
      </header>

      <section className="section">
        <h2>Why it exists</h2>
        <p>Base daily actives and onboarding cooled in recent data. StreakSmith gives builders a retention lever that turns repeat usage into onchain badges.</p>
      </section>

      <section className="section">
        <h2>What shipped</h2>
        <div className="cards">
          <div className="card">Wallet login with Base</div>
          <div className="card">Daily streak tracking and reset logic</div>
          <div className="card">Mintable onchain streak badges</div>
          <div className="card">Cohort view for new vs returning users</div>
          <div className="card">Lightweight activity feed</div>
        </div>
      </section>

      <section className="section">
        <h2>Owner mint</h2>
        <p>Only the contract owner can mint streak badges. Connect the owner wallet to enable minting.</p>
        <div className="mint">
          <input
            className="input"
            placeholder="Recipient address (defaults to connected wallet)"
            value={mintTo}
            onChange={(e) => setMintTo(e.target.value)}
          />
          <button className="btn" disabled={!isConnected || !isOwner || isPending} onClick={handleMint}>
            {isPending ? "Minting…" : "Mint badge"}
          </button>
        </div>
        {!isOwner && isConnected && <p className="hint">Connect the owner wallet to mint.</p>}
      </section>

      <footer className="footer">
        <span>Network: Base Sepolia</span>
        {isConnected && <span className="mono">Connected: {address}</span>}
      </footer>
    </main>
  );
}
