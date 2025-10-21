"use client";

import { useState } from "react";

export default function MintButton({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const onMint = async () => {
    setLoading(true);
    setMsg(null);
    try {
      const r = await fetch(`/projects/${projectId}/mint`, { method: "POST" });
      const data: { txHash?: string; onChain?: boolean; supplyTotal?: number; error?: string } = await r.json();
      if (!r.ok) throw new Error(data?.error || "Error al mintear");
      setMsg(`Mint OK. ${data.onChain ? "Tx: " + data.txHash : "Off-chain"} | Supply: ${data.supplyTotal}`);
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={onMint}
        disabled={loading}
        className="px-4 py-2 rounded-xl border hover:bg-gray-50 disabled:opacity-50"
      >
        {loading ? "Minteando..." : "Mintear"}
      </button>
      {msg && <p className="text-sm mt-2">{msg}</p>}
    </div>
  );
}
