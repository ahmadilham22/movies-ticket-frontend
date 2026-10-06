import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router";

const TransactionListPage = () => {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

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
  }, [navigate]);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-5xl p-6">
        <Link to="/">Back to movies</Link>
        <h1 className="mt-6 text-2xl font-bold">My Transactions</h1>
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
                <li key={transaction.id} className="py-4">
                  <p>Booking Code: {transaction.booking_code}</p>
                  <p>Status: {transaction.status}</p>
                  <p>Quantity: {transaction.quantity}</p>
                  <p>
                    Total: Rp. {transaction.total_price.toLocaleString("id-ID")}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
};

export default TransactionListPage;
