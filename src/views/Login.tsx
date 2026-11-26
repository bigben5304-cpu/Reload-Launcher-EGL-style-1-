import logo from "../assets/logo.png";
import { useState } from "react";
import { seasonImage, User } from "../store";

export default function Login({ onLogin, season }: { onLogin: (u: User) => void; season: number }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    // TODO: when ENABLE_LOGIN_API is on, POST to BACKEND_LOGIN_API from Rust first.
    onLogin({ email: email.trim(), name: email.split("@")[0] });
  };

  return (
    <div className="login" style={{ backgroundImage: `url(${seasonImage(season)})` }}>
      <div className="login-shade" />
      <form className="login-card" onSubmit={submit}>
        <img className="logo-img big" src={logo} alt="Horizon" />
        <h1>Sign In</h1>
        <label>Email Address</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn-primary wide" type="submit">SIGN IN</button>
        <p className="muted small">Your account is created on your Horizon backend.</p>
      </form>
    </div>
  );
}
