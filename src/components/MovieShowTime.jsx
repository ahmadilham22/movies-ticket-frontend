import { Ticket } from "lucide-react";
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

      {isLoading && (
        <p role="status" className="mt-4 text-sm text-zinc-400">
          Loading showtimes...
        </p>
      )}
      {!isLoading && errorMessage && (
        <p role="alert" className="mt-4 text-sm text-red-400">
          {errorMessage}
        </p>
      )}
      {!isLoading && !errorMessage && (
        <div className="mt-4">
          {showTimes.length === 0 && (
            <p className="text-zinc-400">There is no available showtime.</p>
          )}

          <ul className="space-y-3">
            {showTimes.map((showtime) => (
              <li key={showtime.id} className="">
                <label
                  className={`flex items-start gap-3 rounded-md border p-4 ${selectedShowTime?.id === showtime.id ? "border-brand bg-brand/5" : " border-zinc-700 bg-zinc-900"} `}
                >
                  <input
                    type="radio"
                    name="showtime"
                    value={showtime.id}
                    checked={selectedShowTime?.id === showtime.id}
                    onChange={() => setSelectedShowTime(showtime)}
                    className="mt-1 h-4 w-4 shrink-0 accent-brand"
                    disabled={showtime.quota === 0 || isBuying}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">
                      {new Date(showtime.starts_at).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                        timeZone: "Asia/Jakarta",
                      })}{" "}
                      UTC +7
                    </span>

                    <span className="mt-1 block text-sm text-zinc-400">
                      Rp {showtime.price.toLocaleString("id-ID")}
                    </span>

                    <span className="mt-1 block text-sm text-zinc-400">
                      Quota available: {showtime.quota}
                    </span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
          {selectedShowTime && (
            <div className="mt-6 border-t border-zinc-800 pt-6">
              <label
                htmlFor="quantity"
                className="flex flex-wrap items-center justify-between gap-4"
              >
                <span className="text-sm font-medium">Quantity</span>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min={1}
                  max={selectedShowTime.quota}
                  step={1}
                  className="min-h-11 w-24 rounded-md border border-zinc-700 bg-zinc-900 text-sm text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50 px-3 py-2"
                  disabled={isBuying}
                />
              </label>
              <div className="mt-6 flex flex-col gap-4 border-t border-zinc-800 pt-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                {isQuantityValid && (
                  <p className="text-2xl font-semibold tabular-nums">
                    <span className="block text-sm font-normal text-zinc-400">
                      Total price
                    </span>
                    Rp.{" "}
                    {(selectedShowTime.price * Number(quantity)).toLocaleString(
                      "id-ID",
                    )}
                  </p>
                )}
                <button
                  type="button"
                  disabled={!isQuantityValid || isBuying}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-50 sm:ml-auto sm:w-auto"
                  onClick={handleBuy}
                >
                  <Ticket className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {isBuying ? "Buying..." : "Buy Ticket"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {buyError && (
        <p role="alert" className="mt-4 text-sm text-red-400">
          {buyError}
        </p>
      )}
      {buySuccess && <p role="status" className="mt-4 text-sm text-emerald-400">{buySuccess}</p>}
    </section>
  );
};

export default MovieShowTime;
