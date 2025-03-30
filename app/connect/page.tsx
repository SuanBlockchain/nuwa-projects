'use client';
import WalletConnect from "./WalletConnect";
import SendAdaButton from "./SendAdaButton";
import { theme } from "./theme";
import "@/app/globals.css";
import { useEffect, useState, useRef, useCallback } from "react";
// import { Lucid } from "@lucid-evolution/lucid";
import { Lucid } from "@/app/lib/lucid-client";
import { useWallet } from "./useWallet";
import LockGiftCard from "./lockGiftCard";
import TxOptions from "./TxOptions";

export default function Page() {
  const { isConnected, usedAddresses, initLucid } = useWallet();
  const hasLoggedAddress = useRef(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [lucidInstance, setLucidInstance] = useState<Awaited<
    ReturnType<typeof Lucid>
  > | null>(null);

  const initialize = useCallback(async () => {
    try {
      if (!hasLoggedAddress.current) {
        const instance = await initLucid();
        if (instance) {
          setLucidInstance(instance);
          if (usedAddresses?.[0] && usedAddresses[0] !== walletAddress) {
            setWalletAddress(usedAddresses[0]);
            if (!hasLoggedAddress.current) {
              console.log("Connected wallet address:", usedAddresses[0]);
              hasLoggedAddress.current = true;
            }
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
  }, [initialize, isConnected]);

  return (
    <div style={{ minHeight: "100vh", background: theme.gradients.background }}>
      <main style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
        {/* Wallet connect handle to connect the wallet */}
        <WalletConnect />

        {isConnected && walletAddress && (
          <div>

          
          <div style={{ marginTop: "2rem" }}>
            <TxOptions />
            <div
              style={{
                background: theme.colors.background.secondary,
                borderRadius: "12px",
                border: `1px solid ${theme.colors.border.secondary}`,
                padding: "1.5rem",
                marginBottom: "2rem",
              }}
            >
              {walletAddress && lucidInstance && (
                <LockGiftCard instance={lucidInstance} usedAddresses={usedAddresses} />
              )}

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
          </div>
        )}
      </main>
    </div>
  );
}
