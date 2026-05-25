import { useState } from "react";
import MovieCard from "./MovieCard";

export default function FolderSection({
  section,
  items,
  removeMovie,
  moveMovie,
  updateRating,
  sections,
}) {
  const [open, setOpen] = useState(true);

  return (
    <section
      className="folder"
      style={{ "--section-color": section.color }}
      id={section.id.toLowerCase()}
    >
      <button
        className="folder-header"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
      >
        <span className="folder-title">
          <span className="folder-symbol">{section.emoji}</span>
          <span>
            <strong>{section.title}</strong>
            <small>{section.description}</small>
          </span>
        </span>
        <span className="folder-count">{items.length}</span>
      </button>

      {open && (
        <div className="movie-list">
          {items.length === 0 ? (
            <div className="empty">
              <span>+</span>
              <p>No movies here yet</p>
            </div>
          ) : (
            items.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                removeMovie={removeMovie}
                moveMovie={moveMovie}
                updateRating={updateRating}
                sections={sections}
              />
            ))
          )}
        </div>
      )}
    </section>
  );
}
