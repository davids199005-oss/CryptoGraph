import { useEffect, useRef, useState } from "react";
import "./Header.css";

export function Header() {
    const headerRef = useRef<HTMLDivElement>(null);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        function handleScroll() {
            setScrollY(window.scrollY);
        }

        window.addEventListener('scroll', handleScroll, { passive: true });
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const parallaxOffset = scrollY * 0.5;

    return (
        <div className="Header" ref={headerRef}>
            <div 
                className="Header-background" 
                style={{ transform: `translateY(${parallaxOffset}px)` }}
            >
            </div>
            <div className="Header-content">
                <p>Header Component</p>
            </div>
        </div>
    );
}
