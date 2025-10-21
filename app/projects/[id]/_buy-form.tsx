"use client";

import { useState } from "react";

type Props = {
  projectId: string;
  maxAmount: number;
};

export default function BuyForm({ projectId, maxAmount }: Props) {
  const [wallet, setWallet] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const onBuy = async () => {
    setLoading(true);
    setMsg(null);
    try {
      const r = await fetch(`/projects/${projectId}/buy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet, amount }),
      });
      const data: { holdingId?: string; txHash?: string; error?: string } = await r.json();
      if (!r.ok) throw new Error(data?.error || "Error al comprar");
      setMsg(`Compra OK. Holding: ${data.holdingId}${data.txHash ? " | Tx: " + data.txHash : ""}`);
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid gap-2">
        <label className="text-sm">Wallet</label>
        <input
          className="border rounded px-3 py-2"
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
          placeholder="0x..."
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm">Cantidad (máx. {maxAmount.toLocaleString()})</label>
        <input
          type="number"
          className="border rounded px-3 py-2"
          value={Number.isFinite(amount) ? amount : 0}
          min={0}
          max={maxAmount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </div>

      <button
        onClick={onBuy}
        disabled={loading || !wallet || amount <= 0 || amount > maxAmount}
        className="px-4 py-2 rounded-xl border hover:bg-gray-50 disabled:opacity-50"
      >
        {loading ? "Comprando..." : "Comprar"}
      </button>

      {msg && <p className="text-sm mt-2">{msg}</p>}
    </div>
  );
}
