import { NextResponse } from "next/server";
import { JsonRpcProvider, Contract, formatUnits, getAddress } from "ethers";
import abi from "../../../../erc20.json";

const RPC_URL = process.env.RPC_URL!;
const TOKEN_ADDRESS = getAddress(process.env.TOKEN_ADDRESS!);

type BalanceRow = { address: string; raw: string; formatted: string };

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const raw = (searchParams.get("holders") || "").trim();
    const addrs = raw
      ? raw.split(",").map(s => s.trim()).filter(s => /^0x[a-fA-F0-9]{40}$/.test(s))
      : [];

    const provider = new JsonRpcProvider(RPC_URL);
    const token = new Contract(TOKEN_ADDRESS, abi, provider);

    const [network, symbol, decimals, totalSupply] = await Promise.all([
      provider.getNetwork(),
      token.symbol(),
      token.decimals(),
      token.totalSupply()
    ]);

    const balances: BalanceRow[] = [];
    for (const a of addrs) {
      const checksum = getAddress(a);
      const rawBal = await token.balanceOf(checksum);
      balances.push({
        address: checksum,
        raw: rawBal.toString(),
        formatted: formatUnits(rawBal, Number(decimals))
      });
    }

    return NextResponse.json({
      ok: true,
      network: network.chainId.toString(),
      token: {
        address: TOKEN_ADDRESS,
        symbol,
        decimals: Number(decimals),
        totalSupply: formatUnits(totalSupply, Number(decimals))
      },
      balances
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
}
