import { useEffect, useState } from "react";
import "./App.css";
import FolderSection from "./components/FolderSection";
import Header from "./components/Header";
import Hero from "./components/Hero";
import SearchModal from "./components/SearchModal";
import Stats from "./components/Stats";
import { sections } from "./data/sections";

const STORAGE_KEY = "cine_movies";

function readStoredMovies() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const movies = saved ? JSON.parse(saved) : [];

    return Array.isArray(movies) ? movies : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [movies, setMovies] = useState(readStoredMovies);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
  }, [movies]);

  const addMovie = (movie, section) => {
    setMovies((currentMovies) => {
      if (currentMovies.some((item) => item.imdbID === movie.imdbID)) {
        return currentMovies;
      }

      return [
        {
          ...movie,
          id: movie.imdbID,
          rating: 0,
          section,
        },
        ...currentMovies,
      ];
    });
  };

  const removeMovie = (id) => {
    setMovies((currentMovies) =>
      currentMovies.filter((movie) => movie.id !== id)
    );
  };

  const moveMovie = (id, section) => {
    setMovies((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === id ? { ...movie, section } : movie
      )
    );
  };

  const updateRating = (id, rating) => {
    setMovies((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === id ? { ...movie, rating } : movie
      )
    );
  };

  return (
    <div className="app">
      <Header onAddMovie={() => setShowSearch(true)} />

      <main className="dashboard">
        <Hero onAddMovie={() => setShowSearch(true)} />
        <Stats movies={movies} />

        <section className="library" id="library" aria-label="Your movie library">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Library</p>
              <h2>Your collections</h2>
            </div>
            <p className="section-caption">
              Organize films from discovery to final credits.
            </p>
          </div>

          <div className="folders">
            {sections.map((section) => (
              <FolderSection
                key={section.id}
                section={section}
                items={movies.filter((movie) => movie.section === section.id)}
                removeMovie={removeMovie}
                moveMovie={moveMovie}
                updateRating={updateRating}
                sections={sections}
              />
            ))}
          </div>
        </section>
      </main>

      {showSearch && (
        <SearchModal
          addMovie={addMovie}
          onClose={() => setShowSearch(false)}
          sections={sections}
        />
      )}
    </div>
  );
}
