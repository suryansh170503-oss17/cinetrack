const fallbackPoster = "https://placehold.co/320x470/161624/d3d1de?text=No+Poster";

export default function MovieCard({
  movie,
  removeMovie,
  moveMovie,
  updateRating,
  sections,
}) {
  return (
    <article className="movie-card">
      <img
        className="movie-poster"
        src={movie.Poster && movie.Poster !== "N/A" ? movie.Poster : fallbackPoster}
        alt={`${movie.Title} poster`}
      />

      <div className="movie-content">
        <div className="movie-heading">
          <h3>{movie.Title}</h3>
          <span>{movie.Year}</span>
        </div>

        <div className="rating" aria-label={`Your rating: ${movie.rating} out of 10`}>
          {Array.from({ length: 10 }, (_, index) => index + 1).map((score) => (
            <button
              className={score <= movie.rating ? "star selected" : "star"}
              key={score}
              onClick={() => updateRating(movie.id, score)}
              aria-label={`Rate ${score} out of 10`}
            >
              ★
            </button>
          ))}
        </div>

        <label className="move-label" htmlFor={`move-${movie.id}`}>
          Move to
        </label>
        <select
          id={`move-${movie.id}`}
          className="move-select"
          value={movie.section}
          onChange={(event) => moveMovie(movie.id, event.target.value)}
        >
          {sections.map((section) => (
            <option value={section.id} key={section.id}>
              {section.title}
            </option>
          ))}
        </select>

        <button className="remove-button" onClick={() => removeMovie(movie.id)}>
          Remove
        </button>
      </div>
    </article>
  );
}
