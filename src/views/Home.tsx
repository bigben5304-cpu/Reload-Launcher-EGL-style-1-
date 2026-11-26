import { Build, seasonImage } from "../store";

const NEWS = [
  { tag: "UPDATE", title: "Backend v1.2 is live", body: "Matchmaking improvements and faster lobby loading." },
  { tag: "EVENT", title: "Weekend playlist rotation", body: "Solos, Duos and Squads return all weekend long." },
  { tag: "COMMUNITY", title: "Join the Discord", body: "Find lobbies, report bugs and meet other players." },
];

type Props = {
  builds: Build[];
  selected?: Build;
  online: boolean | null;
  season: number;
  onSelect: (id: string) => void;
  onLaunch: (b: Build) => void;
  goLibrary: () => void;
};

export default function Home({ builds, selected, online, season, onSelect, onLaunch, goLibrary }: Props) {
  const heroSeason = selected?.season ?? season;
  return (
    <div className="page">
      <section className="hero" style={{ backgroundImage: `url(${seasonImage(heroSeason)})` }}>
        <div className="hero-shade" />
        <div className="hero-body">
          <span className={`pill ${online ? "on" : online === false ? "off" : ""}`}>
            <i /> {online === null ? "CHECKING…" : online ? "SERVERS ONLINE" : "SERVERS OFFLINE"}
          </span>
          <h2>{selected ? selected.name : "Welcome to Horizon"}</h2>
          <p>{selected ? `Season ${selected.season} · Build ${selected.version || "unknown"}` : "Add a build to your library to start playing."}</p>
          <div className="hero-actions">
            {selected ? (
              <>
                <button className="btn-primary" onClick={() => onLaunch(selected)}>LAUNCH</button>
                {builds.length > 1 && (
                  <select value={selected.id} onChange={(e) => onSelect(e.target.value)}>
                    {builds.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                )}
              </>
            ) : (
              <button className="btn-primary" onClick={goLibrary}>ADD A BUILD</button>
            )}
          </div>
        </div>
      </section>

      <h3 className="section-title">News</h3>
      <div className="news">
        {NEWS.map((n, i) => (
          <article key={n.title} className="news-card" style={{ backgroundImage: `url(${seasonImage(season + i * 3)})` }}>
            <div className="news-shade" />
            <div className="news-text">
              <small>{n.tag}</small>
              <h4>{n.title}</h4>
              <p>{n.body}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
