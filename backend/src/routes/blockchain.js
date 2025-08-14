import { Router } from "express";
import { ethers } from "ethers";
import { z } from "zod";
import PaymentLog from "../models/PaymentLog.js";
import User from "../models/User.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

const verifySchema = z.object({
  txHash: z.string(),
  fromAddress: z.string()
});

function toChecksum(address) {
  try { return ethers.getAddress(address); } catch { return null; }
}

router.post("/verify-payment", authRequired, async (req, res) => {
  const parsed = verifySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const providerUrl = process.env.ALCHEMY_RPC_URL;
  const adminAddr = toChecksum(process.env.ADMIN_WALLET_ADDRESS || "");
  const requiredWei = BigInt(process.env.REQUIRED_FEE_WEI || "10000000000000");
  const chainIdEnv = Number(process.env.CHAIN_ID || 11155111);

  if (!providerUrl || !adminAddr) {
    return res.status(500).json({ error: "Server payment config missing" });
  }
  const provider = new ethers.JsonRpcProvider(providerUrl);
  const receipt = await provider.getTransactionReceipt(parsed.data.txHash);
  if (!receipt || receipt.status !== 1) {
    return res.status(400).json({ error: "Transaction not found or failed" });
  }
  const tx = await provider.getTransaction(parsed.data.txHash);
  if (!tx) return res.status(400).json({ error: "Transaction not found" });

  const from = toChecksum(parsed.data.fromAddress);
  const to = toChecksum(tx.to);
  const value = BigInt(tx.value.toString());
  const net = await provider.getNetwork();
  const chainId = Number(net.chainId);

  if (chainId !== chainIdEnv) {
    return res.status(400).json({ error: "Wrong chain" });
  }
  if (to !== adminAddr) {
    return res.status(400).json({ error: "Payment not to admin wallet" });
  }
  if (from != toChecksum(tx.from)) {
    return res.status(400).json({ error: "From address mismatch" });
  }
  if (value < requiredWei) {
    return res.status(400).json({ error: "Insufficient fee amount" });
  }

  const existing = await PaymentLog.findOne({ txHash: parsed.data.txHash });
  if (existing) return res.status(400).json({ error: "Tx already used" });

  const log = await PaymentLog.create({
    user: req.userId,
    from,
    to: adminAddr,
    chainId,
    amountWei: value.toString(),
    txHash: parsed.data.txHash,
    confirmed: true
  });

  await User.findByIdAndUpdate(req.userId, { lastPaidAt: new Date() });

  res.json({ ok: true, log });
});

export default router;
