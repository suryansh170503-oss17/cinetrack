import { useState, useEffect, useRef } from "react";

// ─── OMDB API ────────────────────────────────────────────────────────────────
const OMDB_KEY = "d69a682c";

// ─── SECTIONS ────────────────────────────────────────────────────────────────
const SECTIONS = [
  {
    id: "WATCHING",
    title: "Watching",
    emoji: "▶️",
    color: "#38bdf8",
  },
  {
    id: "PLANNING",
    title: "Planning",
    emoji: "🕐",
    color: "#a78bfa",
  },
  {
    id: "WAITING",
    title: "Waiting",
    emoji: "⏳",
    color: "#fb923c",
  },
  {
    id: "COMPLETED",
    title: "Completed",
    emoji: "✅",
    color: "#4ade80",
  },
];

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [movies, setMovies] = useState([]);
  const [showSearch, setShowSearch] =
    useState(false);

  useEffect(() => {
    const saved =
      localStorage.getItem("cine_movies");

    if (saved) {
      setMovies(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "cine_movies",
      JSON.stringify(movies)
    );
  }, [movies]);

  const addMovie = (movie, section) => {
    const exists = movies.find(
      (m) => m.imdbID === movie.imdbID
    );

    if (exists) return;

    setMovies([
      {
        ...movie,
        section,
        rating: 0,
        id: Date.now(),
      },
      ...movies,
    ]);
  };

  const removeMovie = (id) => {
    setMovies(
      movies.filter((m) => m.id !== id)
    );
  };

  const moveMovie = (id, section) => {
    setMovies(
      movies.map((m) =>
        m.id === id
          ? { ...m, section }
          : m
      )
    );
  };

  const updateRating = (id, rating) => {
    setMovies(
      movies.map((m) =>
        m.id === id
          ? { ...m, rating }
          : m
      )
    );
  };

  return (
    <div className="app">
      <style>{css}</style>

      <header className="header">
        <h1>🎬 CineTrack</h1>

        <button
          className="add-btn"
          onClick={() =>
            setShowSearch(true)
          }
        >
          + Add Movie
        </button>
      </header>

      <div className="sections">
        {SECTIONS.map((section) => {
          const items = movies.filter(
            (m) =>
              m.section === section.id
          );

          return (
            <FolderSection
              key={section.id}
              section={section}
              items={items}
              removeMovie={
                removeMovie
              }
              moveMovie={moveMovie}
              updateRating={
                updateRating
              }
            />
          );
        })}
      </div>

      {showSearch && (
        <SearchModal
          onClose={() =>
            setShowSearch(false)
          }
          addMovie={addMovie}
        />
      )}
    </div>
  );
}

// ─── FOLDER SECTION ──────────────────────────────────────────────────────────
function FolderSection({
  section,
  items,
  removeMovie,
  moveMovie,
  updateRating,
}) {
  const [open, setOpen] =
    useState(true);

  return (
    <div className="folder">
      <div
        className="folder-header"
        onClick={() =>
          setOpen(!open)
        }
      >
        <div className="folder-left">
          <span
            className="folder-color"
            style={{
              background:
                section.color,
            }}
          />

          <span className="folder-emoji">
            {section.emoji}
          </span>

          <h2>{section.title}</h2>
        </div>

        <div className="folder-count">
          {items.length}
        </div>
      </div>

      {open && (
        <div className="movie-list">
          {items.length === 0 ? (
            <div className="empty">
              No movies
            </div>
          ) : (
            items.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                removeMovie={
                  removeMovie
                }
                moveMovie={
                  moveMovie
                }
                updateRating={
                  updateRating
                }
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── SEARCH MODAL ────────────────────────────────────────────────────────────
function SearchModal({
  onClose,
  addMovie,
}) {
  const [query, setQuery] =
    useState("");

  const [results, setResults] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [hovered, setHovered] =
    useState(null);

  const debounce = useRef(null);

  useEffect(() => {
    clearTimeout(debounce.current);

    debounce.current = setTimeout(
      async () => {
        if (!query.trim()) {
          setResults([]);
          return;
        }

        setLoading(true);

        try {
          const response =
            await fetch(
              `https://www.omdbapi.com/?apikey=${OMDB_KEY}&s=${encodeURIComponent(
                query
              )}`
            );

          const data =
            await response.json();

          if (
            data.Response === "False"
          ) {
            setResults([]);
            setLoading(false);
            return;
          }

          const detailed =
            await Promise.all(
              data.Search.map(
                async (movie) => {
                  try {
                    const detailRes =
                      await fetch(
                        `https://www.omdbapi.com/?apikey=${OMDB_KEY}&i=${movie.imdbID}&plot=short`
                      );

                    return await detailRes.json();
                  } catch {
                    return movie;
                  }
                }
              )
            );

          setResults(detailed);
        } catch {
          setResults([]);
        }

        setLoading(false);
      },
      500
    );

    return () =>
      clearTimeout(debounce.current);
  }, [query]);

  return (
    <div
      className="overlay"
      onClick={(e) =>
        e.target === e.currentTarget &&
        onClose()
      }
    >
      <div className="modal">
        <div className="modal-head">
          <h2>Search Movies</h2>

          <button onClick={onClose}>
            ✕
          </button>
        </div>

        <input
          className="search-input"
          placeholder="Search movie..."
          value={query}
          onChange={(e) =>
            setQuery(e.target.value)
          }
        />

        {loading && (
          <p className="loading">
            Loading...
          </p>
        )}

        <div className="results">
          {results.map((movie) => (
            <div
              className="result-card"
              key={movie.imdbID}
              onMouseEnter={() =>
                setHovered(movie.imdbID)
              }
              onMouseLeave={() =>
                setHovered(null)
              }
            >
              <img
                src={
                  movie.Poster !== "N/A"
                    ? movie.Poster
                    : "https://placehold.co/100x150?text=No+Poster"
                }
                className="poster"
              />

              <div className="result-info">
                <h3>{movie.Title}</h3>

                <p>{movie.Year}</p>

                {hovered ===
                  movie.imdbID && (
                  <div className="synopsis">
                    <strong>
                      Synopsis
                    </strong>

                    <p>
                      {movie.Plot &&
                      movie.Plot !==
                        "N/A"
                        ? movie.Plot
                        : "No synopsis available."}
                    </p>

                    {movie.imdbRating &&
                      movie.imdbRating !==
                        "N/A" && (
                        <div className="hover-rating">
                          ⭐ IMDb:
                          {" "}
                          {
                            movie.imdbRating
                          }
                          /10
                        </div>
                      )}
                  </div>
                )}

                <div className="buttons">
                  {SECTIONS.map(
                    (section) => (
                      <button
                        key={section.id}
                        style={{
                          background:
                            section.color,
                        }}
                        onClick={() =>
                          addMovie(
                            movie,
                            section.id
                          )
                        }
                      >
                        {section.emoji}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MOVIE CARD ──────────────────────────────────────────────────────────────
function MovieCard({
  movie,
  removeMovie,
  moveMovie,
  updateRating,
}) {
  return (
    <div className="movie-card">
      <img
        src={
          movie.Poster !== "N/A"
            ? movie.Poster
            : "https://placehold.co/300x450?text=No+Poster"
        }
        className="poster"
      />

      <div className="movie-info">
        <h3>{movie.Title}</h3>

        <p>{movie.Year}</p>

        <div className="rating">
          {[1,2,3,4,5,6,7,8,9,10].map(
            (num) => (
              <button
                key={num}
                className={
                  num <= movie.rating
                    ? "star active"
                    : "star"
                }
                onClick={() =>
                  updateRating(
                    movie.id,
                    num
                  )
                }
              >
                ★
              </button>
            )
          )}
        </div>

        <div className="rating-text">
          Rating: {movie.rating}/10
        </div>

        <div className="move-buttons">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              style={{
                background:
                  section.color,
              }}
              onClick={() =>
                moveMovie(
                  movie.id,
                  section.id
                )
              }
            >
              {section.emoji}
            </button>
          ))}
        </div>

        <button
          className="remove-btn"
          onClick={() =>
            removeMovie(movie.id)
          }
        >
          Remove
        </button>
      </div>
    </div>
  );
}

// ─── CSS ─────────────────────────────────────────────────────────────────────
const css = `
*{
margin:0;
padding:0;
box-sizing:border-box;
}

body{
background:#0f172a;
font-family:sans-serif;
}

.app{
padding:20px;
color:white;
min-height:100vh;
}

.header{
display:flex;
justify-content:space-between;
align-items:center;
margin-bottom:25px;
}

.add-btn{
background:#6366f1;
border:none;
padding:12px 20px;
border-radius:10px;
color:white;
cursor:pointer;
font-size:15px;
}

.sections{
display:flex;
flex-direction:column;
gap:20px;
}

.folder{
background:#111827;
border-radius:16px;
padding:15px;
}

.folder-header{
display:flex;
justify-content:space-between;
align-items:center;
cursor:pointer;
padding:12px;
background:#1e293b;
border-radius:12px;
}

.folder-left{
display:flex;
align-items:center;
gap:10px;
}

.folder-color{
width:6px;
height:28px;
border-radius:20px;
}

.folder-count{
background:#334155;
padding:5px 12px;
border-radius:20px;
}

.movie-list{
margin-top:15px;
display:grid;
grid-template-columns:repeat(auto-fill,minmax(220px,1fr));
gap:20px;
}

.movie-card{
background:#1e293b;
border-radius:14px;
overflow:hidden;
}

.poster{
width:100%;
height:320px;
object-fit:cover;
}

.movie-info{
padding:15px;
}

.movie-info h3{
font-size:18px;
margin-bottom:5px;
}

.movie-info p{
color:#94a3b8;
margin-bottom:10px;
}

.rating{
display:flex;
flex-wrap:wrap;
gap:3px;
margin-bottom:8px;
}

.star{
background:none;
border:none;
font-size:18px;
cursor:pointer;
color:#475569;
}

.star.active{
color:#facc15;
}

.rating-text{
font-size:14px;
margin-bottom:10px;
color:#cbd5e1;
}

.move-buttons{
display:flex;
gap:6px;
margin-bottom:10px;
flex-wrap:wrap;
}

.move-buttons button{
border:none;
padding:8px;
border-radius:8px;
cursor:pointer;
}

.remove-btn{
width:100%;
background:#ef4444;
border:none;
padding:10px;
border-radius:8px;
color:white;
cursor:pointer;
}

.overlay{
position:fixed;
inset:0;
background:rgba(0,0,0,0.7);
display:flex;
justify-content:center;
align-items:center;
padding:20px;
z-index:100;
}

.modal{
background:#111827;
width:100%;
max-width:700px;
border-radius:16px;
padding:20px;
max-height:90vh;
overflow:auto;
}

.modal-head{
display:flex;
justify-content:space-between;
align-items:center;
margin-bottom:20px;
}

.search-input{
width:100%;
padding:12px;
border:none;
border-radius:10px;
margin-bottom:20px;
font-size:15px;
}

.results{
display:flex;
flex-direction:column;
gap:15px;
}

.result-card{
display:flex;
gap:15px;
background:#1e293b;
padding:10px;
border-radius:12px;
}

.result-card .poster{
width:100px;
height:150px;
border-radius:10px;
}

.result-info{
flex:1;
}

.buttons{
display:flex;
gap:8px;
flex-wrap:wrap;
margin-top:10px;
}

.buttons button{
border:none;
padding:10px;
border-radius:8px;
cursor:pointer;
}

.synopsis{
margin-top:10px;
background:#0f172a;
padding:12px;
border-radius:10px;
border:1px solid #334155;
animation:fadeIn 0.2s ease;
}

.synopsis strong{
display:block;
margin-bottom:6px;
font-size:15px;
color:white;
}

.synopsis p{
font-size:14px;
line-height:1.5;
color:#cbd5e1;
margin-bottom:8px;
}

.hover-rating{
font-size:14px;
color:#facc15;
font-weight:bold;
}

.loading{
text-align:center;
margin-bottom:15px;
}

.empty{
color:#94a3b8;
text-align:center;
padding:20px;
}

@keyframes fadeIn{
from{
opacity:0;
transform:translateY(5px);
}
to{
opacity:1;
transform:translateY(0);
}
}
`;
