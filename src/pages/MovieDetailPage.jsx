import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router";
import { useParams } from "react-router";
import MovieShowTime from "../components/MovieShowTime";
import PageLayout from "../components/PageLayout";

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
    <PageLayout>
      <Link
        to="/"
        className="mb-6 inline-block text-sm text-zinc-400 hover:underline"
      >
        Back to movies
      </Link>
      {isLoading && <p role="status">Loading movie...</p>}

      {!isLoading && errorMessage && <p role="alert">{errorMessage}</p>}

      {!isLoading && !errorMessage && movie && (
        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[280px_minmax(0,1fr)] md:gap-10">
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="mx-auto aspect-2/3 w-full max-w-70 rounded-md object-cover"
          />
          <div className="min-w-0">
            <h1 className="text-3xl font-bold wrap-break-word">
              {movie.title}
            </h1>

            <p className="mt-3 text-sm text-zinc-400">
              {movie.duration_minutes} minutes | {movie.age_rating}
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <li
                  key={genre.id}
                  className="rounded border border-zinc-700 px-2 py-1 text-xs"
                >
                  {genre.name}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm leading-relaxed text-zinc-300">
              {movie.synopsis}
            </p>

            <MovieShowTime movieId={movie.id} />
          </div>
        </div>
      )}
    </PageLayout>
  );
}

export default MovieDetailPage;
