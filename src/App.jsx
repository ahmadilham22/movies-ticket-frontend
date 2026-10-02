import { useState } from "react";
import MovieCard from "./components/MovieCard";
import { useEffect } from "react";

function App() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadMovies() {
      setIsLoading(true);
      setErrorMessage("");
      try {
        const response = await fetch("/api/movies");

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();

        if (!ignore) {
          setMovies(result.data);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage("Failed to load movies.");
          console.error("Failed to load movies", error);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadMovies();

    return () => {
      ignore = true;
    };
  }, []);

  const normalizedSearch = search.trim().toLocaleLowerCase();

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(normalizedSearch),
  );

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-5xl p-6">
        <header className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Movies Ticketing</h1>
          <p className="text-zinc-400">{filteredMovies.length}</p>
        </header>
        <input
          type="search"
          aria-label="Search movie"
          placeholder="Search movie"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="mt-6 w-full border border-zinc-700 bg-zinc-900 p-3"
        />
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading && (
            <p
              role="status"
              className="col-span-full py-8 text-center text-zinc-400"
            >
              Loading movies...
            </p>
          )}
          {!isLoading && errorMessage && (
            <p
              role="alert"
              className="col-span-full py-8 text-center text-red-400"
            >
              {errorMessage}
            </p>
          )}
          {!isLoading && !errorMessage && filteredMovies.length === 0 && (
            <p className="col-span-full py-8 text-center text-zinc-400">
              No movies found
            </p>
          )}

          {!isLoading &&
            !errorMessage &&
            filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
        </div>
      </div>
    </main>
  );
}

export default App;
