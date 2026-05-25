const OMDB_KEY = "d69a682c";
const OMDB_URL = "https://www.omdbapi.com/";

async function request(params, signal) {
  const url = new URL(OMDB_URL);
  url.search = new URLSearchParams({ apikey: OMDB_KEY, ...params });

  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error("Movie service is unavailable.");
  }

  return response.json();
}

export async function searchMovies(query, signal) {
  const data = await request({ s: query }, signal);
  if (data.Response === "False") {
    return [];
  }

  return Promise.all(
    data.Search.slice(0, 6).map(async (movie) => {
      try {
        return await request({ i: movie.imdbID, plot: "short" }, signal);
      } catch (error) {
        if (error.name === "AbortError") {
          throw error;
        }

        return movie;
      }
    })
  );
}
