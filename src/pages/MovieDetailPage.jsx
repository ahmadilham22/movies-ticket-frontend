import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router";
import { useParams } from "react-router";

function MovieDetailPage() {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadMovie() {
      setIsLoading(true);
      setMovie(null);
      setErrorMessage("");
      try {
        const response = await fetch(`/api/movies/${id}`);

        if (response.status === 404) {
          if (!ignore) {
            setErrorMessage("Movie not found");
          }

          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();

        if (!ignore) setMovie(result.data);
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

    loadMovie();

    return () => {
      ignore = true;
    };
  }, [id]);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-5xl p-6">
        <Link
          to="/"
          className="mb-6 inline-block text-sm text-zinc-400 hover:underline"
        >
          Back to movies
        </Link>
        {isLoading && <p role="status">Loading movie...</p>}

        {!isLoading && errorMessage && <p role="alert">{errorMessage}</p>}

        {!isLoading && !errorMessage && movie && (
          <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3">
            <img
              src={movie.poster_url}
              alt={movie.title}
              className="aspect-2/3 w-full object-cover"
            />
            <div className="min-w-0 md:col-span-2">
              <h1 className="text-2xl font-bold">{movie.title}</h1>

              <p className="mt-2 text-zinc-400">
                {movie.duration_minutes} minutes | {movie.age_rating}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <li
                    key={genre.id}
                    className="border border-zinc-700 px-3 py-1 text-sm"
                  >
                    {genre.name}
                  </li>
                ))}
              </ul>
              <p className="mt-4 leading-relaxed text-zinc-300">
                {movie.synopsis}
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default MovieDetailPage;
