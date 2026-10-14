import { ArrowRight, Clock } from "lucide-react";
import { Link } from "react-router";

const MovieCard = (props) => {
  return (
    <section className="flex flex-col overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
      <div className="shrink-0 aspect-2/3 w-full bg-zinc-800 flex items-center justify-center">
        {props.movie.poster_url ? (
          <img
            src={props.movie.poster_url}
            alt={props.movie.title}
            className="block h-full w-full object-cover"
          />
        ) : (
          <p className="text-sm text-zinc-400">Poster Unavailable</p>
        )}
      </div>
      <div className="min-w-0 flex flex-1 flex-col p-4">
        <h2 className="text-lg font-semibold wrap-break-word">
          <Link to={`/movies/${props.movie.id}`} className="hover:underline">
            {props.movie.title}
          </Link>
        </h2>
        <div className="mt-auto pt-3 flex items-center justify-between gap-3 text-sm text-zinc-400">
          <p className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
            {props.movie.duration_minutes} minutes
          </p>
          <span className="shrink-0 rounded border border-zinc-700 px-2 py-0.5 text-xs">
            {props.movie.age_rating}
          </span>
        </div>
        <Link
          to={`/movies/${props.movie.id}`}
          className="mt-4 flex items-center justify-between rounded-md border border-zinc-700 px-3 py-2 text-sm font-medium hover:border-brand hover:text-brand"
        >
          View details
          <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
};

export default MovieCard;
