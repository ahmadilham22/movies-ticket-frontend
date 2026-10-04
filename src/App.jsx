import { Routes, Route } from "react-router";
import MovieListPage from "./pages/MovieListPage";
import MovieDetailPage from "./pages/MovieDetailPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MovieListPage />} />
      <Route path="/movies/:id" element={<MovieDetailPage />} />
    </Routes>
  );
}

export default App;
