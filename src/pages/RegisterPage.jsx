import { Link } from "react-router";
import { useState } from "react";
import PageLayout from "../components/PageLayout";
import {
  ArrowLeft,
  Eye,
  LockKeyholeIcon,
  Mail,
  Phone,
  Ticket,
  User,
  UserPlus,
} from "lucide-react";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    setErrorMessage("");
    setSuccessMessage("");

    if (name.trim() === "" || email.trim() === "" || password === "") {
      setErrorMessage("Please complete the required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          phone_number: phoneNumber.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to register.");
      }

      setSuccessMessage(result.message);
      setPassword("");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
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
      <div className="mx-auto max-w-lg mt-8 sm:mt-12">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-3xl font-bold">Create account</h1>
          <p className="text-sm text-gray-500">Welcome to Movies Ticketing</p>
        </div>
        <form
          className="mt-6 space-y-6 border-b pb-7 border-gray-600"
          onSubmit={handleRegister}
        >
          <div className="">
            <label htmlFor="name">Name</label>
            <div className="relative mt-2">
              <User
                className="h-5 w-5 left-3 top-1/2 absolute -translate-y-1/2  text-gray-500 pointer-events-none"
                aria-hidden="true"
              ></User>
              <input
                id="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 pl-12"
                placeholder="Your Name"
              />
            </div>
          </div>
          <div className="">
            <label htmlFor="email">Email</label>
            <div className="relative mt-2">
              <Mail
                className="h-5 w-5 left-3 top-1/2 absolute -translate-y-1/2  text-gray-500 pointer-events-none"
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
                className="h-5 w-5 left-3 top-1/2 absolute -translate-y-1/2  text-gray-500 pointer-events-none"
                aria-hidden="true"
              ></LockKeyholeIcon>
              <Eye
                className="h-5 w-5 absolute top-1/2 -translate-y-1/2 right-5 text-gray-500 pointer-events-none"
                aria-hidden="true"
              ></Eye>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                placeholder="Enter your password"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 pl-12 pr-15"
              />
            </div>
          </div>
          <div className="">
            <div className="flex items-center justify-between">
              <label htmlFor="phoneNumber">Phone Number</label>
              <span className="text-xs text-gray-400">Optional</span>
            </div>
            <div className="relative mt-2">
              <Phone
                className="h-5 w-5 left-3 top-1/2 absolute -translate-y-1/2  text-gray-500 pointer-events-none"
                aria-hidden="true"
              ></Phone>
              <input
                id="phoneNumber"
                type="tel"
                autoComplete="tel"
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 pl-12"
                placeholder="0812 3456 7890"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full flex justify-center gap-2 items-center font-bold rounded-lg bg-brand p-3 text-zinc-950 cursor-pointer hover:bg-brand/90"
            disabled={isSubmitting}
          >
            <UserPlus
              className="w-5 h-5 text-black "
              aria-hidden="true"
            ></UserPlus>
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>
        {errorMessage && (
          <p className="text-red-500" role="alert">
            {errorMessage}
          </p>
        )}
        {successMessage && (
          <p className="text-green-500" role="status">
            {successMessage}
          </p>
        )}
        <div className="flex gap-2 items-center justify-center text-sm mt-8">
          <span className="text-gray-400">Already have an account?</span>
          <Link to="/login" className="text-sm hover:underline">
            <p className="text-brand font-semibold">Login</p>
          </Link>
        </div>
      </div>
    </PageLayout>
  );
};

export default RegisterPage;
