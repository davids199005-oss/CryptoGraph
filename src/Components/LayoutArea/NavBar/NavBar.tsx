import { NavLink } from "react-router-dom";
import "./NavBar.css";

export function NavBar() {
    return (
        <div className="NavBar">
            <NavLink to="/Home">Home</NavLink>

            <NavLink to="/About">About</NavLink>

            <NavLink to="/Reports">Reports</NavLink>
            
            <NavLink to="/Recommendations">Recommendations</NavLink>


        </div>
    );
}
