import { Link } from "react-router";

const MovieCard = (props) => {
  return (
    <section className="border border-zinc-700 p-4">
      {props.movie.poster_url && (
        <img
          src={props.movie.poster_url}
          alt={props.movie.title}
          className="mb-4 aspect-2/3 w-full object-cover"
        />
      )}
      <h2 className="text-xl font-semibold">
        <Link to={`/movies/${props.movie.id}`} className="hover:underline">
          {props.movie.title}
        </Link>
      </h2>
      <p className="mt-2 text-zinc-400">
        {props.movie.duration_minutes} minutes
      </p>
    </section>
  );
};

export default MovieCard;
