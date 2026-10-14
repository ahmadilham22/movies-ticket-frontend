import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import PageLayout from "../components/PageLayout";
import { ArrowLeft, CircleCheck, CircleX, Ticket, X } from "lucide-react";

const TransactionListPage = () => {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [cancellingCode, setCancellingCode] = useState(null);
  const [cancelError, setCancelError] = useState("");
  const [cancelSuccess, setCancelSuccess] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    const loadTransactions = async () => {
      const token = sessionStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch("/api/transactions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (ignore) {
          return;
        }

        if (response.status === 401) {
          sessionStorage.removeItem("token");
          navigate("/login");
          return;
        }

        const result = await response.json();

        if (ignore) {
          return;
        }

        if (!response.ok) {
          throw new Error(result.message || "Failed to load transactions");
        }

        if (!ignore) {
          setTransactions(result.data);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error.message);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadTransactions();

    return () => {
      ignore = true;
    };
  }, [navigate, reloadKey]);

  const handleCancel = async (transaction) => {
    if (cancellingCode !== null || transaction.status !== "SUCCESS") {
      return;
    }

    const token = sessionStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setCancellingCode(transaction.booking_code);
    setCancelError("");
    setCancelSuccess("");

    try {
      const response = await fetch(
        `/api/transactions/${transaction.booking_code}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 401) {
        sessionStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to cancel transaction");
      }

      setCancelSuccess(result.message);
      setReloadKey((previous) => previous + 1);
    } catch (error) {
      setCancelError(error.message);
    } finally {
      setCancellingCode(null);
    }
  };

  return (
    <PageLayout>
      <header
        className="flex flex-col justify-between items-center gap-4 border-b border-zinc-800 pb-6
        sm:flex-row sm:items-center sm:justify-between"
      >
        <p className="text-lg font-semibold flex items-center gap-2">
          <Ticket className="h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
          Movies Ticketing
        </p>
        <Link
          to="/"
          className="flex items-center gap-3 text-sm text-zinc-400 hover:underline"
        >
          <ArrowLeft className="h-5 w-5 shrink-0"></ArrowLeft>
          Back to movies
        </Link>
      </header>
      <div className="flex justify-between items-center mt-6">
        <h1 className="text-2xl font-bold">My Transactions</h1>
        <p className="text-gray-500">{transactions.length} transactions</p>
      </div>
      <div className="">
        {/* Loading */}
        {isLoading && (
          <p
            role="status"
            className="col-span-full py-8 text-center text-zinc-400"
          >
            Loading transactions...
          </p>
        )}

        {/* Error */}
        {!isLoading && errorMessage && (
          <p
            role="alert"
            className="col-span-full py-8 text-center text-red-400"
          >
            {errorMessage}
          </p>
        )}

        {/* Transactions empty */}
        {!isLoading && !errorMessage && transactions.length === 0 && (
          <p
            role="status"
            className="col-span-full py-8 text-center text-zinc-400"
          >
            No transactions found.
          </p>
        )}

        {/* Transactions */}
        {!isLoading && !errorMessage && (
          <ul className="mt-6 divide-y divide-zinc-800">
            {transactions.map((transaction) => (
              <li
                key={transaction.id}
                className="py-4 grid grid-cols-2 md:grid-cols-5 gap-4"
              >
                <p className="flex flex-col gap-2 col-span-2 md:col-span-1">
                  <span className="text-gray-400 text-sm">Booking code</span>

                  <span>{transaction.booking_code}</span>
                </p>
                <p className="flex flex-col gap-2">
                  <span className="text-gray-400 text-sm">Status: </span>
                  <span
                    className={`w-fit inline-flex items-center gap-2 rounded px-2 py-1 text-xs ${
                      transaction.status === "SUCCESS"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {transaction.status === "SUCCESS" ? (
                      <CircleCheck
                        className="h-4 w-4 shrink-0"
                        aria-hidden="true"
                      />
                    ) : (
                      <CircleX
                        className="h-4 w-4 shrink-0"
                        aria-hidden="true"
                      />
                    )}
                    {transaction.status === "SUCCESS" ? "SUCCESS" : "CANCELLED"}
                  </span>
                </p>
                <p className="flex flex-col gap-2">
                  <span className="text-gray-400 text-sm">Quantity:</span>
                  <span>{transaction.quantity}</span>
                </p>
                <p className="flex flex-col gap-2">
                  <span className="text-gray-400 text-sm">Total:</span>
                  <span className="font-semibold text-xl">
                    Rp. {transaction.total_price.toLocaleString("id-ID")}
                  </span>
                </p>
                {transaction.status === "SUCCESS" && (
                  <button
                    type="button"
                    className="self-center min-h-11 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 border border-red-400 px-3 py-2 text-red-400"
                    disabled={cancellingCode !== null}
                    onClick={() => handleCancel(transaction)}
                  >
                    <X className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {cancellingCode === transaction.booking_code
                      ? "Cancelling..."
                      : "Cancel"}
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
        {cancelError && (
          <p className="text-red-500" role="alert">
            {cancelError}
          </p>
        )}
        {cancelSuccess && (
          <p className="text-green-500" role="status">
            {cancelSuccess}
          </p>
        )}
      </div>
    </PageLayout>
  );
};

export default TransactionListPage;
