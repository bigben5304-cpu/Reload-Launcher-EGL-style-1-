import { User } from "../store";

type Props = {
  user: User;
  backend: string;
  rpc: boolean;
  closeOnLaunch: boolean;
  setRpc: (v: boolean) => void;
  setCloseOnLaunch: (v: boolean) => void;
  onLogout: () => void;
};

export default function Settings({ user, backend, rpc, closeOnLaunch, setRpc, setCloseOnLaunch, onLogout }: Props) {
  return (
    <div className="page narrow">
      <div className="page-head"><h2>Settings</h2></div>

      <h3 className="section-title">Account</h3>
      <div className="panel">
        <div className="row-between">
          <div><strong>{user.name}</strong><div className="muted">{user.email}</div></div>
          <button className="btn-ghost" onClick={onLogout}>SIGN OUT</button>
        </div>
      </div>

      <h3 className="section-title">General</h3>
      <div className="panel">
        <Toggle label="Discord Rich Presence" checked={rpc} onChange={setRpc} />
        <Toggle label="Close launcher when game starts" checked={closeOnLaunch} onChange={setCloseOnLaunch} />
      </div>

      <h3 className="section-title">Backend</h3>
      <div className="panel">
        <div className="muted small">Set in src-tauri/src/utils/config.rs</div>
        <code>{backend}</code>
      </div>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="toggle">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <i />
    </label>
  );
}
