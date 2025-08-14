import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const logout = () => { localStorage.removeItem("token"); navigate("/auth"); };
  return (
    <div>
      <nav className="bg-white shadow">
        <div className="container py-3 flex gap-4 items-center">
          <Link to="/dashboard" className="font-bold">Rize Portal</Link>
          <Link to="/dashboard">Feed & Jobs</Link>
          <Link to="/post-job">Post Job</Link>
          <Link to="/profile">Profile</Link>
          <div className="ml-auto flex gap-2">
            {!token ? <Link to="/auth">Login</Link> : <button onClick={logout}>Logout</button>}
          </div>
        </div>
      </nav>
      <main className="container py-6">
        <Outlet />
      </main>
    </div>
  );
}
