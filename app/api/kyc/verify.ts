import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { wallet } = req.body || {};
  if (!wallet) return res.status(400).json({ error: "wallet requerida" });

  const wl = await prisma.whitelist.upsert({
    where: { wallet },
    create: { wallet, approved: true },
    update: { approved: true },
  });
  res.json({ approved: wl.approved });
}
