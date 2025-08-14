import React, { useState } from "react";
import api from "../lib/api";
import { connectWallet, sendPlatformFee } from "../lib/web3";

export default function PostJob() {
  const [form, setForm] = useState({ title:"", description:"", skills:"", location:"", tags:"", budget:"" });
  const [wallet, setWallet] = useState("");
  const [txHash, setTxHash] = useState("");
  const admin = import.meta.env.VITE_ADMIN_WALLET || "";
  const fee = import.meta.env.VITE_REQUIRED_FEE_ETH || "0.00001";

  async function payFee() {
    try {
      const addr = await connectWallet();
      setWallet(addr);
      const { txHash } = await sendPlatformFee(admin, fee);
      setTxHash(txHash);
      await api.post("/blockchain/verify-payment", { txHash, fromAddress: addr });
      alert("Payment verified. You can post a job now.");
    } catch (e) {
      alert(e.message || e.response?.data?.error || "Payment failed");
    }
  }

  async function submit() {
    try {
      const payload = {
        title: form.title,
        description: form.description,
        skills: form.skills.split(",").map(s=>s.trim()).filter(Boolean),
        location: form.location,
        tags: form.tags.split(",").map(s=>s.trim()).filter(Boolean),
        budget: form.budget
      };
      const { data } = await api.post("/jobs", payload);
      alert("Job posted");
      setForm({ title:"", description:"", skills:"", location:"", tags:"", budget:"" });
    } catch (e) {
      alert(e.response?.data?.error || "Error");
    }
  }

  return (
    <div className="max-w-2xl card">
      <h1 className="text-xl font-bold mb-4">Post a Job</h1>
      <div className="mb-4 p-3 border rounded bg-yellow-50">
        <div className="font-semibold">Step 1: Connect wallet & pay platform fee</div>
        <div className="text-sm">Admin wallet: {admin || "(set VITE_ADMIN_WALLET)"}</div>
        <button className="mt-2" onClick={payFee}>Pay {fee} ETH (Sepolia)</button>
        {txHash && <div className="text-xs mt-2 break-all">Tx: {txHash}</div>}
      </div>
      <div className="space-y-3">
        <input placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} />
        <textarea rows="5" placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
        <input placeholder="Skills (comma-separated)" value={form.skills} onChange={e=>setForm({...form, skills:e.target.value})} />
        <input placeholder="Location" value={form.location} onChange={e=>setForm({...form, location:e.target.value})} />
        <input placeholder="Tags (comma-separated)" value={form.tags} onChange={e=>setForm({...form, tags:e.target.value})} />
        <input placeholder="Budget / Salary" value={form.budget} onChange={e=>setForm({...form, budget:e.target.value})} />
        <button onClick={submit}>Submit Job</button>
      </div>
    </div>
  );
}
