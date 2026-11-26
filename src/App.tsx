import logo from "./assets/logo.png";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
import "./App.css";
import { Build, User, useLocalState } from "./store";
import Login from "./views/Login";
import Home from "./views/Home";
import Library from "./views/Library";
import Settings from "./views/Settings";

type Tab = "home" | "library" | "settings";
type AppConfig = { backend_url: string; season: number };

const inTauri = "__TAURI_INTERNALS__" in window;

function TitleBar() {
  const w = inTauri ? getCurrentWindow() : null;
  return (
    <div className="titlebar" data-tauri-drag-region>
      <div className="titlebar-btns">
        <button onClick={() => w?.minimize()} aria-label="Minimize">&#8211;</button>
        <button onClick={() => w?.toggleMaximize()} aria-label="Maximize">&#9633;</button>
        <button className="close" onClick={() => w?.close()} aria-label="Close">&#10005;</button>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useLocalState<User | null>("user", null);
  const [builds, setBuilds] = useLocalState<Build[]>("builds", []);
  const [selectedId, setSelectedId] = useLocalState<string>("selected", "");
  const [rpc, setRpc] = useLocalState("rpc", true);
  const [closeOnLaunch, setCloseOnLaunch] = useLocalState("closeOnLaunch", false);
  const [tab, setTab] = useState<Tab>("home");
  const [online, setOnline] = useState<boolean | null>(null);
  const [config, setConfig] = useState<AppConfig>({ backend_url: "http://127.0.0.1:3551", season: 10 });
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!inTauri) { setOnline(false); return; }
    invoke<AppConfig>("app_config").then(setConfig).catch(() => {});
    const check = () => invoke<boolean>("backend_status").then(setOnline).catch(() => setOnline(false));
    check();
    const t = setInterval(check, 15000);
    return () => clearInterval(t);
  }, []);

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(""), 4000); };
  const season = config.season > 0 ? config.season : 10;
  const selected = builds.find((b) => b.id === selectedId) ?? builds[0];

  const launch = async (b: Build) => {
    if (!inTauri) return flash("Launching only works in the desktop app.");
    try {
      await invoke("launch_game", { path: b.path });
      flash(`Launching ${b.name}…`);
      if (closeOnLaunch) getCurrentWindow().close();
    } catch (e) {
      flash(String(e));
    }
  };

  const addBuild = (b: Omit<Build, "id">) => {
    const nb = { ...b, id: crypto.randomUUID() };
    setBuilds([...builds, nb]);
    if (!selected) setSelectedId(nb.id);
  };

  if (!user) {
    return (<div className="shell"><TitleBar /><Login season={season} onLogin={setUser} /></div>);
  }

  const nav: { id: Tab; label: string }[] = [
    { id: "home", label: "HOME" },
    { id: "library", label: "LIBRARY" },
    { id: "settings", label: "SETTINGS" },
  ];

  return (
    <div className="shell">
      <TitleBar />
      <div className="body">
        <aside className="sidebar">
          <div className="brand"><img className="logo-img" src={logo} alt="Horizon" /></div>
          <nav>
            {nav.map((n) => (
              <button key={n.id} className={tab === n.id ? "active" : ""} onClick={() => setTab(n.id)}>{n.label}</button>
            ))}
          </nav>
          <div className="user">
            <div className="avatar">{user.name[0]?.toUpperCase()}</div>
            <div>
              <div className="uname">{user.name}</div>
              <div className={`ustatus ${online ? "on" : ""}`}>{online ? "Online" : "Offline"}</div>
            </div>
          </div>
        </aside>

        <main className="content">
          {tab === "home" && (
            <Home builds={builds} selected={selected} online={online} season={season}
              onSelect={setSelectedId} onLaunch={launch} goLibrary={() => setTab("library")} />
          )}
          {tab === "library" && (
            <Library builds={builds} onAdd={addBuild} onLaunch={launch}
              onRemove={(id) => setBuilds(builds.filter((b) => b.id !== id))} />
          )}
          {tab === "settings" && (
            <Settings user={user} backend={config.backend_url} rpc={rpc} closeOnLaunch={closeOnLaunch}
              setRpc={setRpc} setCloseOnLaunch={setCloseOnLaunch} onLogout={() => setUser(null)} />
          )}
        </main>
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
