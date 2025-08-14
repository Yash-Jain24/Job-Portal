import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      if (isLogin) {
        const { data } = await api.post("/auth/login", { email, password });
        localStorage.setItem("token", data.token);
      } else {
        const { data } = await api.post("/auth/register", { name, email, password });
        localStorage.setItem("token", data.token);
      }
      navigate("/dashboard");
    } catch (e) {
      alert(e.response?.data?.error || "Error");
    }
  }

  return (
    <div className="max-w-md mx-auto card">
      <h1 className="text-xl font-bold mb-4">{isLogin ? "Login" : "Register"}</h1>
      <form className="space-y-3" onSubmit={submit}>
        {!isLogin && (
          <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        )}
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit">{isLogin ? "Login" : "Register"}</button>
      </form>
      <button className="mt-3" onClick={()=>setIsLogin(!isLogin)}>
        {isLogin ? "Need an account? Register" : "Have an account? Login"}
      </button>
    </div>
  );
}
