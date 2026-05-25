import heroImage from "../assets/hero.png";

export default function Hero({ onAddMovie }) {
  return (
    <section className="hero" id="discover">
      <div className="hero-copy">
        <p className="eyebrow">Your personal movie tracker</p>
        <h1>
          Track every story.
          <span> Never miss a scene.</span>
        </h1>
        <p className="hero-text">
          Build your watchlist, keep track of what you are watching, and rate
          the films that stay with you.
        </p>
        <button className="primary-button" onClick={onAddMovie}>
          <span>+</span> Add your first movie
        </button>
      </div>

      <div className="hero-art" aria-hidden="true">
        <div className="art-ring" />
        <img src={heroImage} alt="" />
        <div className="art-ticket">
          <span>NOW PLAYING</span>
          <strong>CINETRACK</strong>
        </div>
      </div>
    </section>
  );
}
