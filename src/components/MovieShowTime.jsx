import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";

const MovieShowTime = ({ movieId }) => {
  const navigate = useNavigate();

  const [showTimes, setShowTimes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedShowTime, setSelectedShowTime] = useState(null);
  const [quantity, setQuantity] = useState("1");
  const [isBuying, setIsBuying] = useState(false);
  const [buyError, setBuyError] = useState("");
  const [buySuccess, setBuySuccess] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

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
  }, [movieId, reloadKey]);

  const numericQuantity = Number(quantity);

  const isQuantityValid =
    selectedShowTime !== null &&
    Number.isInteger(numericQuantity) &&
    numericQuantity > 0 &&
    numericQuantity <= selectedShowTime.quota;

  const handleBuy = async () => {
    if (isBuying || !isQuantityValid) return;

    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setIsBuying(true);
    setBuyError("");
    setBuySuccess("");
    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ticket_id: selectedShowTime.id,
          quantity: numericQuantity,
        }),
      });

      const result = await response.json();

      if (response.status === 401) {
        sessionStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        if (response.status === 409) {
          setSelectedShowTime(null);
          setQuantity("1");
          setReloadKey((previous) => previous + 1);
        }
        throw new Error(result.message || "Failed to buy ticket");
      }

      setBuySuccess(result.message);
      setReloadKey((previous) => previous + 1);
      setSelectedShowTime(null);
      setQuantity("1");
    } catch (error) {
      setBuyError(error.message);
    } finally {
      setIsBuying(false);
    }
  };

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
                <label>
                  <input
                    type="radio"
                    name="showtime"
                    value={showtime.id}
                    checked={selectedShowTime?.id === showtime.id}
                    onChange={() => setSelectedShowTime(showtime)}
                    className=""
                    disabled={showtime.quota === 0 || isBuying}
                  />
                  Choose showtime
                </label>
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
          {selectedShowTime && (
            <div>
              <label htmlFor="quantity">
                <span>Quantity</span>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min={1}
                  max={selectedShowTime.quota}
                  step={1}
                  className="block mt-2 w-24 border border-zinc-900 p-2 text-white"
                  disabled={isBuying}
                />
              </label>
              {isQuantityValid && (
                <p>
                  Total : Rp.{" "}
                  {(selectedShowTime.price * Number(quantity)).toLocaleString(
                    "id-ID",
                  )}
                </p>
              )}
              <button
                type="button"
                disabled={!isQuantityValid || isBuying}
                className="mt-4 bg-white px-4 py-2 text-zinc-950 disabled:opacity-50"
                onClick={handleBuy}
              >
                {isBuying ? "Buying..." : "Buy Ticket"}
              </button>
            </div>
          )}
        </div>
      )}
      {buyError && <p role="alert">{buyError}</p>}
      {buySuccess && <p role="status">{buySuccess}</p>}
    </section>
  );
};

export default MovieShowTime;
