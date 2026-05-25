import { useEffect, useState } from "react";
import { searchMovies } from "../utils/omdb";

const fallbackPoster = "https://placehold.co/160x235/161624/d3d1de?text=No+Poster";

export default function SearchModal({ addMovie, onClose, sections }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const searchTerm = query.trim();
    if (!searchTerm) {
      return undefined;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        setResults(await searchMovies(searchTerm, controller.signal));
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setResults([]);
          setError("Could not search movies right now.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 350);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleQueryChange = (event) => {
    const nextQuery = event.target.value;
    setQuery(nextQuery);

    if (!nextQuery.trim()) {
      setResults([]);
      setLoading(false);
      setError("");
    }
  };

  return (
    <div
      className="overlay"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section className="modal" aria-modal="true" role="dialog" aria-label="Add a movie">
        <div className="modal-head">
          <div>
            <p className="eyebrow">Discover</p>
            <h2>Add a movie</h2>
          </div>
          <button className="close-button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <label className="search">
          <span aria-hidden="true">⌕</span>
          <input
            autoFocus
            placeholder="Search by movie title..."
            value={query}
            onChange={handleQueryChange}
          />
        </label>

        {loading && <p className="message">Searching...</p>}
        {error && <p className="message error">{error}</p>}

        <div className="results">
          {results.map((movie) => (
            <article className="result-card" key={movie.imdbID}>
              <img
                src={movie.Poster !== "N/A" ? movie.Poster : fallbackPoster}
                alt={`${movie.Title} poster`}
              />
              <div className="result-content">
                <h3>{movie.Title}</h3>
                <p className="movie-meta">
                  {movie.Year}
                  {movie.imdbRating && movie.imdbRating !== "N/A"
                    ? `  •  IMDb ${movie.imdbRating}`
                    : ""}
                </p>
                <p className="plot">
                  {movie.Plot && movie.Plot !== "N/A"
                    ? movie.Plot
                    : "No synopsis available."}
                </p>
                <div className="add-actions">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => addMovie(movie, section.id)}
                      style={{ "--section-color": section.color }}
                    >
                      {section.emoji} {section.title}
                    </button>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
