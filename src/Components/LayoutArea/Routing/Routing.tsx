import { Navigate, Route, Routes } from "react-router-dom";
import { Home } from "../../PageArea/Home/Home";
import "./Routing.css";
import { About } from "../../PageArea/About/About";
import { Reports } from "../../PageArea/Reports/Reports";
import { Recommendation } from "../../PageArea/Recommendations/Recommendations";
import { NotFoundPage } from "../../PageArea/NotFoundPage/NotFoundPage";

export function Routing() {
return (
<div className="Routing">

<Routes>
            <Route path="/" element={<Navigate to="/Home" />} />

            <Route path="/Home" element={<Home />} />
            <Route path="/Reports" element={<Reports />} />
            <Route path="/Recommendation" element={<Recommendation />} />
            <Route path="/About" element={<About />} />
            <Route path="*" element={<NotFoundPage />} />



</Routes>

</div>
);
}
