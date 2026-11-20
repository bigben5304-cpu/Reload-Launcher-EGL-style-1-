import { useState } from "react";
import { Build, seasonImage } from "../store";

type Props = {
  builds: Build[];
  onAdd: (b: Omit<Build, "id">) => void;
  onRemove: (id: string) => void;
  onLaunch: (b: Build) => void;
};

export default function Library({ builds, onAdd, onRemove, onLaunch }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [path, setPath] = useState("");
  const [season, setSeason] = useState(10);
  const [version, setVersion] = useState("");

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!path.trim()) return;
    onAdd({ name: name.trim() || `Fortnite Season ${season}`, path: path.trim(), season, version: version.trim() });
    setOpen(false); setName(""); setPath(""); setVersion("");
  };

  return (
    <div className="page">
      <div className="page-head">
        <h2>Library</h2>
        <span className="muted">{builds.length} {builds.length === 1 ? "build" : "builds"}</span>
      </div>

      <div className="grid">
        {builds.map((b) => (
          <div key={b.id} className="tile">
            <div className="tile-art" style={{ backgroundImage: `url(${seasonImage(b.season)})` }}>
              <div className="tile-hover">
                <button className="btn-primary" onClick={() => onLaunch(b)}>LAUNCH</button>
                <button className="link" onClick={() => onRemove(b.id)}>Remove</button>
              </div>
            </div>
            <div className="tile-name">{b.name}</div>
            <div className="tile-sub">Season {b.season}{b.version && ` · ${b.version}`}</div>
          </div>
        ))}
        <button className="tile add" onClick={() => setOpen(true)}>
          <div className="tile-art"><span>+</span></div>
          <div className="tile-name">Add build</div>
        </button>
      </div>

      {open && (
        <div className="modal-bg" onClick={() => setOpen(false)}>
          <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={save}>
            <h3>Add Build</h3>
            <label>Display name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Fortnite 10.40" />
            <label>Build folder</label>
            <input value={path} onChange={(e) => setPath(e.target.value)} placeholder="C:\Builds\Fortnite-10.40" />
            <div className="row2">
              <div>
                <label>Season</label>
                <select value={season} onChange={(e) => setSeason(+e.target.value)}>
                  {Array.from({ length: 42 }, (_, i) => i + 1).map((s) => <option key={s} value={s}>Season {s}</option>)}
                </select>
              </div>
              <div>
                <label>Version</label>
                <input value={version} onChange={(e) => setVersion(e.target.value)} placeholder="10.40" />
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-ghost" onClick={() => setOpen(false)}>CANCEL</button>
              <button type="submit" className="btn-primary">ADD</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
