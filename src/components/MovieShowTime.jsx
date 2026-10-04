import { useEffect } from "react";
import { useState } from "react";

const MovieShowTime = ({ movieId }) => {
  const [showTimes, setShowTimes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadShowTimes() {
      setIsLoading(true);
      setShowTimes([]);
      setErrorMessage("");
      try {
        const response = await fetch(`/api/tickets`);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();

        const now = Date.now();

        const upComingShowTimes = result.data.filter((showtime) => {
          const matchesMovie = showtime.movie_id === movieId;
          const isUpcoming = new Date(showtime.starts_at).getTime() > now;

          return matchesMovie && isUpcoming;
        });

        if (!ignore) {
          setShowTimes(upComingShowTimes);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage("Failed to load show times.");
          console.error("Failed to load show times", error);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }
    loadShowTimes();
    return () => {
      ignore = true;
    };
  }, [movieId]);

  return (
    <section className="mt-6 border-t border-zinc-800 pt-6">
      <h2 className="text-xl font-semibold">Showtimes</h2>

      {isLoading && <p role="status">Loading showtimes...</p>}
      {!isLoading && errorMessage && <p role="alert">{errorMessage}</p>}
      {!isLoading && !errorMessage && (
        <div className="mt-4">
          {showTimes.length === 0 && (
            <p className="text-zinc-400">There is no available showtime.</p>
          )}

          <ul className="divide-y divide-zinc-800">
            {showTimes.map((showtime) => (
              <li key={showtime.id} className="py-4">
                <p>
                  {new Date(showtime.starts_at).toLocaleString("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "short",
                    timeZone: "Asia/Jakarta",
                  })}{" "}
                  UTC +7
                </p>

                <p className="mt-1 text-zinc-400">
                  Rp {showtime.price.toLocaleString("id-ID")}
                </p>

                <p className="mt-1 text-zinc-400">
                  Quota available: {showtime.quota}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default MovieShowTime;
