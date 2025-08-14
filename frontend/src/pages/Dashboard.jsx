import React, { useEffect, useState } from "react";
import api from "../lib/api";

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [posts, setPosts] = useState([]);
  const [q, setQ] = useState("");

  async function load() {
    const j = await api.get("/jobs", { params: { q } });
    const p = await api.get("/feed");
    setJobs(j.data.jobs);
    setPosts(p.data.posts);
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card">
        <div className="flex gap-2 mb-3">
          <input placeholder="Search jobs" value={q} onChange={e=>setQ(e.target.value)} />
          <button onClick={load}>Search</button>
        </div>
        <h2 className="font-bold mb-2">Jobs</h2>
        <div className="space-y-3">
          {jobs.map(j => (
            <div key={j._id} className="border rounded p-3">
              <div className="font-semibold">{j.title}</div>
              <div className="text-sm">{j.description}</div>
              <div className="text-sm mt-1">Skills: {j.skills?.join(", ")}</div>
              <div className="text-sm">Budget: {j.budget || "-"}</div>
            </div>
          ))}
          {!jobs.length && <div>No jobs yet.</div>}
        </div>
      </div>
      <div className="card">
        <CreatePost onCreated={load} />
        <h2 className="font-bold mb-2 mt-4">Feed</h2>
        <div className="space-y-3">
          {posts.map(p => (
            <div key={p._id} className="border rounded p-3">
              <div>{p.content}</div>
              <div className="text-xs text-gray-500">{new Date(p.createdAt).toLocaleString()}</div>
            </div>
          ))}
          {!posts.length && <div>No posts yet.</div>}
        </div>
      </div>
    </div>
  );
}

function CreatePost({ onCreated }) {
  const [content, setContent] = useState("");
  async function submit() {
    try {
      await api.post("/feed", { content });
      setContent("");
      onCreated();
    } catch (e) {
      alert(e.response?.data?.error || "Error");
    }
  }
  return (
    <div>
      <textarea rows="3" placeholder="Share an update..." value={content} onChange={e=>setContent(e.target.value)} />
      <button className="mt-2" onClick={submit}>Post</button>
    </div>
  );
}
