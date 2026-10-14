import { useState } from "react";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import PageLayout from "../components/PageLayout";
import {
  ArrowLeft,
  Eye,
  LockKeyholeIcon,
  LogInIcon,
  Mail,
  Ticket,
} from "lucide-react";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogin(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login failed.");
      }

      sessionStorage.setItem("token", result.data);
      navigate("/", { replace: true });
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

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
      <div className="mx-auto max-w-lg mt-8 sm:mt-12">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-sm text-gray-500">Welcome back</p>
        </div>

        <form
          className="mt-6 space-y-6 border-b pb-7 border-gray-600"
          onSubmit={handleLogin}
        >
          <div className="">
            <label htmlFor="email">Email</label>
            <div className="relative mt-2">
              <Mail
                className="h-5 w-5 top-1/2 -translate-y-1/2 left-3 absolute text-gray-500 pointer-events-none"
                aria-hidden="true"
              ></Mail>
              <input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 pl-12"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="">
            <label htmlFor="password">Password</label>
            <div className="relative mt-2">
              <LockKeyholeIcon
                className="h-5 w-5 absolute top-1/2 -translate-y-1/2 left-3 text-gray-500 pointer-events-none"
                aria-hidden="true"
              ></LockKeyholeIcon>
              <Eye
                className="h-5 w-5 absolute top-1/2 -translate-y-1/2 right-5 text-gray-500 pointer-events-none"
                aria-hidden="true"
              ></Eye>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                placeholder="Enter your password"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 pl-12 pr-15"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center gap-2 items-center font-bold rounded-lg bg-brand p-3 text-zinc-950 cursor-pointer hover:bg-brand/90"
            disabled={isSubmitting}
          >
            <LogInIcon
              className="w-5 h-5 text-black "
              aria-hidden="true"
            ></LogInIcon>
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
          {errorMessage && <p role="alert">{errorMessage}</p>}
        </form>
        <div className="flex gap-2 items-center justify-center text-xs mt-8">
          <span className="text-gray-400">New here?</span>
          <Link to="/register" className="text-sm hover:underline">
            <p className="text-brand font-semibold"> Create an account</p>
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}

export default LoginPage;
