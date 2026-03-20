import { Navigate, Route, Routes } from "react-router-dom";
import { Home } from "../Pages/Home/Home";
import { About } from "../Pages/About/About";
import { Reports } from "../Pages/Reports/Reports";
import { Recommendations } from "../Pages/Recommendations/Recommendations";
import { NotFoundPage } from "../Pages/NotFoundPage/NotFoundPage";
import { CoinsDetails } from "../Pages/CoinsDetails/CoinsDetails";

/**
 * Application routing configuration. Maps URL paths to page components;
 * root path redirects to /Home, unknown paths render NotFoundPage.
 */
export function Routing() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/Home" />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/coins/:coinId" element={<CoinsDetails />} />
      <Route path="/Reports" element={<Reports />} />
      <Route path="/Recommendations" element={<Recommendations />} />
      <Route path="/About" element={<About />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
