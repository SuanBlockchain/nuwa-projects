"use client";
import { useEffect, useState, useRef } from "react";
import { LucidEvolution } from "@lucid-evolution/lucid";

export enum NetworkType {
  MAINNET = "mainnet",
  TESTNET = "testnet"
}

const isClient = typeof window !== "undefined";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let useCardano: any = () => ({
  isConnected: false,
  connect: () => {},
  disconnect: () => {},
  stakeAddress: null,
  accountBalance: null,
  installedExtensions: [],
  enabledWallet: null,
  usedAddresses: [],
});

// Ensure `useCardano` is only required on the client
if (isClient) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  useCardano = require("@cardano-foundation/cardano-connect-with-wallet").useCardano;
}

export const useWallet = () => {
  // ✅ Always call Hooks at the top level
  const [isClient, setIsClient] = useState(false);
  const network = NetworkType.TESTNET;
  const hasLogged = useRef(false);
  const lucidInstance = useRef<LucidEvolution | null>(null);
  const lastInitTime = useRef<number>(0);
  const REFRESH_INTERVAL = 120000; // 120 seconds

  // ✅ Always call this hook, even if `isClient` is false initially
  useEffect(() => {
    setIsClient(true);
  }, []);

  // ✅ Always call `useCardano`, even if `isClient` is false
  const {
    isConnected,
    connect,
    disconnect,
    stakeAddress,
    accountBalance,
    installedExtensions,
    enabledWallet,
    usedAddresses,
  } = useCardano({
    limitNetwork: network,
  });

  const initLucid = async () => {
    if (!isClient) return null;

    if (!isConnected || !enabledWallet || !usedAddresses?.length) {
      lucidInstance.current = null;
      return null;
    }

    const now = Date.now();
    if (lucidInstance.current && now - lastInitTime.current < REFRESH_INTERVAL) {
      return lucidInstance.current;
    }

    try {
      const { Lucid, Blockfrost } = await import("@lucid-evolution/lucid");

      const getBlockfrostApiKey = () => {
        if (typeof window === "undefined") return undefined;
        return process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY || undefined;
      };
      const blockfrostApiKey = getBlockfrostApiKey();

      const lucid = await Lucid(
        new Blockfrost(
          "https://cardano-preview.blockfrost.io/api/v0",
          blockfrostApiKey,
        ),
        "Preview",
      );

      if (isClient) {
        const api = await window.cardano[enabledWallet].enable();
        await lucid.selectWallet.fromAPI(api);
      }

      if (!hasLogged.current) {
        console.log("✅ Lucid initialized successfully");
        hasLogged.current = true;
      }

      lucidInstance.current = lucid;
      lastInitTime.current = now;
      return lucid;
    } catch (error) {
      console.error("❌ Lucid initialization error:", error);
      throw error;
    }
  };

  // ✅ Instead of returning early, return default values for SSR
  if (!isClient) {
    return {
      isConnected: false,
      connect: () => {},
      disconnect: () => {},
      stakeAddress: null,
      accountBalance: null,
      installedExtensions: [],
      enabledWallet: null,
      usedAddresses: [],
      network,
      initLucid: async () => null,
    };
  }

  return {
    isConnected,
    connect,
    disconnect,
    stakeAddress,
    accountBalance,
    installedExtensions,
    enabledWallet,
    usedAddresses,
    network,
    initLucid,
  };
};
