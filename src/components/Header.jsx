export default function Header({ onAddMovie }) {
  return (
    <header className="topbar">
      <a className="brand" href="/" aria-label="CineTrack home">
        <span className="brand-icon">C</span>
        <span>
          Cine<span>Track</span>
        </span>
      </a>

      <nav className="nav" aria-label="Main navigation">
        <a className="active" href="#library">
          Library
        </a>
        <a href="#discover">Discover</a>
        <a href="#stats">Stats</a>
      </nav>

      <button className="primary-button compact" onClick={onAddMovie}>
        <span>+</span> Add movie
      </button>
    </header>
  );
}
