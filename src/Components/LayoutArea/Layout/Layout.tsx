import { Footer } from "../Footer/Footer";
import { Header } from "../Header/Header";
import { NavBar } from "../NavBar/NavBar";
import { Routing } from "../Routing/Routing";
import "./Layout.css";

export function Layout() {
    return (
        <div className="Layout">



            <nav><NavBar /></nav>
			<header><Header /></header>
            <main><Routing /></main>
            <footer><Footer /></footer>
        

        </div>
    );
}
