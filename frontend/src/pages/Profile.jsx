import React, { useEffect, useState } from "react";
import api from "../lib/api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name:"", bio:"", linkedin:"", skills:[], walletAddress:"" });
  const [skillsText, setSkillsText] = useState("");

  async function load() {
    const { data } = await api.get("/user/me");
    setUser(data.user);
    setForm({
      name: data.user?.name || "",
      bio: data.user?.bio || "",
      linkedin: data.user?.linkedin || "",
      skills: data.user?.skills || [],
      walletAddress: data.user?.walletAddress || ""
    });
    setSkillsText((data.user?.skills || []).join(", "));
  }

  useEffect(() => { load(); }, []);

  async function save() {
    try {
      const payload = { ...form, skills: skillsText.split(",").map(s=>s.trim()).filter(Boolean) };
      const { data } = await api.put("/user/me", payload);
      setUser(data.user);
      alert("Saved");
    } catch (e) {
      alert(e.response?.data?.error || "Error");
    }
  }

  return (
    <div className="max-w-2xl card">
      <h1 className="text-xl font-bold mb-4">Profile</h1>
      <div className="space-y-3">
        <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
        <input placeholder="LinkedIn URL" value={form.linkedin} onChange={e=>setForm({...form, linkedin:e.target.value})} />
        <textarea rows="4" placeholder="Bio" value={form.bio} onChange={e=>setForm({...form, bio:e.target.value})} />
        <input placeholder="Skills (comma-separated)" value={skillsText} onChange={e=>setSkillsText(e.target.value)} />
        <input placeholder="Public Wallet Address (optional)" value={form.walletAddress} onChange={e=>setForm({...form, walletAddress:e.target.value})} />
        <button onClick={save}>Save</button>
      </div>
    </div>
  );
}
