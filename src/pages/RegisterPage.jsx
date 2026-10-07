import { Link } from "react-router";
import { useState } from "react";

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
    <main className="min-h-screen bg-zinc-900 text-white">
      <div className="mx-auto max-w-sm p-6">
        <h1 className="text-2xl font-bold">Create account</h1>
        <form className="mt-6 space-y-4" onSubmit={handleRegister}>
          <div className="">
            <label htmlFor="name">
              <span className="text-sm">Name</span>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full border border-zinc-700 bg-zinc-950 p-3"
                autoComplete="name"
                required
              />
            </label>
          </div>
          <div className="">
            <label htmlFor="email">
              <span className="text-sm">Email</span>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full border border-zinc-700 bg-zinc-950 p-3"
                autoComplete="email"
                required
              />
            </label>
          </div>
          <div className="">
            <label htmlFor="password">
              <span className="text-sm">Password</span>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full border border-zinc-700 bg-zinc-950 p-3"
                autoComplete="new-password"
                required
              />
            </label>
          </div>
          <div className="">
            <label htmlFor="phoneNumber">
              <span className="text-sm">Phone Number</span>
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-2 w-full border border-zinc-700 bg-zinc-950 p-3"
                autoComplete="tel"
              />
            </label>
          </div>
          <div className="">
            <button
              type="submit"
              className="w-full bg-white p-3 text-zinc-950 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </div>
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
        <Link to="/login" className="text-sm hover:underline cursor-pointer">
          Already have an account? Log in
        </Link>
      </div>
    </main>
  );
};

export default RegisterPage;
