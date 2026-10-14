import { useState } from "react";
import MovieCard from "../components/MovieCard";
import { useEffect } from "react";
import { Link } from "react-router";
import PageLayout from "../components/PageLayout";
import { Search, Ticket } from "lucide-react";

function MovieListPage() {
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

  const [hasToken, setHasToken] = useState(() =>
    Boolean(sessionStorage.getItem("token")),
  );

  function handleLogout() {
    sessionStorage.removeItem("token");
    setHasToken(false);
  }

  return (
    <PageLayout>
      <header
        className="flex flex-col gap-4 border-b border-zinc-800 pb-6
        sm:flex-row sm:items-center sm:justify-between"
      >
        <p className="text-lg font-semibold flex items-center gap-2">
          <Ticket className="h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
          Movies Ticketing
        </p>
        <nav aria-label="Account" className="flex flex-wrap items-center gap-4">
          {hasToken && (
            <Link
              to="/transactions"
              className="p-3 text-sm hover:underline cursor-pointer"
            >
              Transactions
            </Link>
          )}
          {hasToken ? (
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-md border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-zinc-800"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-md bg-brand px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-brand/90"
            >
              Login
            </Link>
          )}
        </nav>
      </header>
      <div className="mt-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Movies</h1>
        <p className="text-sm text-zinc-400">{filteredMovies.length} movies</p>
      </div>
      <div className="mt-6">
        <label htmlFor="movie-search" className="block text-sm font-medium">
          Search movies
        </label>
        <div className="relative mt-2">
          <Search
            className="absolute pointer-events-none left-3 top-1/2 -translate-y-1/2 text-zinc-400 h-5 w-5"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search movie"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 pl-10 pr-3 py-3
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            id="movie-search"
          />
        </div>
      </div>
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
    </PageLayout>
  );
}

export default MovieListPage;
