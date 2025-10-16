"use client";
import { useState } from "react";

type Props = { projectId: string; maxAmount: number };

export default function BuyForm({ projectId, maxAmount }: Props) {
  const [wallet, setWallet] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const onBuy = async (): Promise<void> => {
    setLoading(true); setMsg(null);
    try {
      const r = await fetch(`/projects/${projectId}/buy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet, amount }),
      });
      const data: { ok?: boolean; error?: string; holdingId?: string; onChain?: boolean; txHash?: string } = await r.json();
      if (!r.ok || !data.ok) throw new Error(data?.error || "Error al comprar");
      setMsg(`Compra OK. Holding: ${data.holdingId} ${data.onChain ? "| Tx: " + data.txHash : ""}`);
    } catch (e) {
      const err = e as Error;
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-2xl p-4">
      <h2 className="text-lg font-semibold">Invertir</h2>
      <div className="mt-3 grid gap-2">
        <input
          className="border rounded-lg px-3 py-2 bg-transparent"
          placeholder="Wallet (0x...)"
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
        />
        <input
          className="border rounded-lg px-3 py-2 bg-transparent"
          placeholder={`Cantidad (max ${maxAmount})`}
          type="number"
          min={0}
          max={maxAmount}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <button disabled={loading} onClick={onBuy} className="px-3 py-1.5 rounded-xl border hover:bg-gray-50">
          {loading ? "Comprando…" : "Comprar"}
        </button>
        {msg && <span className="text-sm opacity-80">{msg}</span>}
      </div>
    </div>
  );
}
