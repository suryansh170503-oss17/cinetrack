export default function Stats({ movies }) {
  const completed = movies.filter((movie) => movie.section === "COMPLETED");
  const watching = movies.filter((movie) => movie.section === "WATCHING").length;
  const ratings = movies.filter((movie) => movie.rating > 0);
  const average =
    ratings.length > 0
      ? (
          ratings.reduce((sum, movie) => sum + movie.rating, 0) /
          ratings.length
        ).toFixed(1)
      : "0.0";

  const cards = [
    { icon: "▣", label: "Total films", value: movies.length },
    { icon: "▶", label: "Watching", value: watching },
    { icon: "✓", label: "Completed", value: completed.length },
    { icon: "★", label: "Avg. rating", value: average },
  ];

  return (
    <section className="stats" id="stats" aria-label="Movie statistics">
      {cards.map((card) => (
        <article className="stat-card" key={card.label}>
          <span className="stat-icon">{card.icon}</span>
          <div>
            <strong>{card.value}</strong>
            <p>{card.label}</p>
          </div>
        </article>
      ))}
    </section>
  );
}
