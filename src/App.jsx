import { Routes, Route } from "react-router";
import MovieListPage from "./pages/MovieListPage";
import MovieDetailPage from "./pages/MovieDetailPage";
import LoginPage from "./pages/LoginPage";
import TransactionListPage from "./pages/TransactionListPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MovieListPage />} />
      <Route path="/movies/:id" element={<MovieDetailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/transactions" element={<TransactionListPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}

export default App;
