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
      const data = await r.json(); // <- ahora sí es JSON
      if (!r.ok || !data?.ok) throw new Error(data?.error || "Error al mintear");
      setMsg(`Mint OK. Supply: ${data.supplyTotal}${data.onChain && data.txHash ? " | Tx: " + data.txHash : ""}`);
    } catch (e) {
      const err = e as Error;
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={onMint}
        disabled={loading}
        className="px-3 py-1.5 rounded-xl border hover:bg-gray-50 disabled:opacity-50"
      >
        {loading ? "Minteando..." : "Mintear supply +1000"}
      </button>
      {msg && <div className="text-sm opacity-80">{msg}</div>}
    </div>
  );
}
