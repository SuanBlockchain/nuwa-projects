'use client';
import WalletConnect from "./WalletConnect";
import SendAdaButton from "./SendAdaButton";
import { theme } from "./theme";
import "@/app/globals.css";
import { useEffect, useState, useRef, useCallback } from "react";
import { Lucid } from "@lucid-evolution/lucid";
import { useWallet } from "./useWallet";

export default function Page() {
  const { isConnected, usedAddresses, initLucid } = useWallet();
  const hasLoggedAddress = useRef(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [lucidInstance, setLucidInstance] = useState<Awaited<
    ReturnType<typeof Lucid>
  > | null>(null);
  const [showCopied, setShowCopied] = useState(false);

  const handleCopy = async () => {
    if (typeof window !== "undefined" && walletAddress) {
      await navigator.clipboard.writeText(walletAddress);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }
  };

  const initialize = useCallback(async () => {
    try {
      const instance = await initLucid();
      if (instance) {
        setLucidInstance(instance);
        if (usedAddresses?.[0] && usedAddresses[0] !== walletAddress) {
          setWalletAddress(usedAddresses[0]);
          console.log("useADdress", walletAddress);
          if (!hasLoggedAddress.current) {
            console.log("Connected wallet address:", usedAddresses[0]);
            hasLoggedAddress.current = true;
          }
        }
      }
    } catch (error) {
      console.error("Error initializing Lucid:", error);
    }
  }, [initLucid, usedAddresses, walletAddress]);

  useEffect(() => {
    if (isConnected) {
      initialize();
    } else {
      setWalletAddress(null);
      setLucidInstance(null);
      hasLoggedAddress.current = false;
    }
  }, [isConnected, initialize]);

  return (

    <div style={{   minHeight: "100vh",   background: theme.gradients.background, }}>
      <main style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>

        {/* Wallet connect handle to connect the wallet */}
        <WalletConnect />
        
        {isConnected && walletAddress && (
          <div style={{ marginTop: "2rem" }}>
            <div
              style={{
                background: theme.colors.background.secondary,
                borderRadius: "12px",
                border: `1px solid ${theme.colors.border.secondary}`,
                padding: "1.5rem",
                marginBottom: "2rem",
              }}
            >
              <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>

                <span style={{color: theme.colors.text.secondary, fontSize: "0.875rem"}}>
                  Account
                </span>
                <div style={{display: "flex", alignItems: "center", gap: "0.5rem"}}>

                  <span style={{color: theme.colors.text.primary, fontSize: "0.875rem", fontFamily: "inherit", background: theme.colors.background.secondary, padding: "0.5rem 0.75rem", borderRadius: "6px", border: `1px solid ${theme.colors.border.secondary}`}}>
                    {walletAddress.slice(0, 20)}...{walletAddress.slice(-20)}
                  </span>
                  {walletAddress && (
                    <button
                    onClick={handleCopy}
                    style={{
                      background: theme.colors.background.secondary,
                      border: `1px solid ${theme.colors.border.secondary}`,
                      borderRadius: "6px",
                      width: "32px",
                      height: "32px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: showCopied
                      ? theme.colors.primary
                      : theme.colors.text.secondary,
                      fontSize: "0.75rem",
                      transition: "all 0.2s ease",
                      position: "relative",
                      }}
                      title="Copy address"
                    >
                      {showCopied ? "✓" : "⎘"}
                    </button>
                    )}
                </div>
                

              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: theme.colors.background.card,
                  padding: "0.75rem 1rem",
                  borderRadius: "8px",
                  border: `1px solid ${theme.colors.border.primary}`,
                  maxWidth: "100%",
                  overflow: "hidden",
                }}
              >


                  <div>
                    <SendAdaButton lucidInstance={lucidInstance} />
                </div>
              </div>
            </div>

          </div>
        )}
      </main>

    </div>


  );
}
