import { Navigate, Route, Routes } from "react-router-dom";
import { Home } from "../../PageArea/Home/Home";
import { About } from "../../PageArea/About/About";
import { Reports } from "../../PageArea/Reports/Reports";
import { Recommendations } from "../../PageArea/Recommendations/Recommendations";
import { NotFoundPage } from "../../PageArea/NotFoundPage/NotFoundPage";
import { CoinsDetails } from "../../CoinsArea/CoinsDetails/CoinsDetails";

export function Routing() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Navigate to="/Home" />} />

                <Route path="/Home" element={<Home />} />
                <Route path="/coins/:coinId" element={<CoinsDetails />} />
                <Route path="/Reports" element={<Reports />} />
                <Route path="/Recommendations" element={<Recommendations />} />
                <Route path="/About" element={<About />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>

        </div>
    );
}
