import { useEffect, useRef, useState, useCallback } from "react";
import { Box, Typography } from "@mui/material";

/**
 * Hero header with video background and parallax scroll effect. Uses a passive scroll
 * listener so scrolling stays smooth.
 */
export function Header() {
    const headerRef = useRef<HTMLDivElement>(null);
    const [scrollY, setScrollY] = useState(0);

    // Memoize scroll handler to prevent re-creating function on every render
    const handleScroll = useCallback(() => {
        setScrollY(window.scrollY);
    }, []);

    useEffect(() => {
        // Passive listener: doesn't block scrolling, better performance
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    // Calculate parallax offset (50% of scroll distance)
    const parallaxOffset = scrollY * 0.5;

    return (
        <Box
            ref={headerRef}
            sx={{
                position: 'relative',
                width: '100%',
                height: '60vh',
                minHeight: 400,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(180deg, rgba(5, 8, 16, 0.6) 0%, rgba(0, 245, 255, 0.06) 50%, rgba(5, 8, 16, 0.8) 100%)',
                    zIndex: 1,
                },
            }}
        >
            {/* Video background with parallax effect */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '-20%',
                    left: 0,
                    width: '100%',
                    height: '120%',
                    transform: `translateY(${parallaxOffset}px)`,
                    willChange: 'transform',
                    transition: 'transform 0.1s ease-out',
                    '& video': {
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    },
                }}
            >
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ display: 'block' }}
                >
                    <source src="/Images/animatedHeader.mp4" type="video/mp4" />
                </video>
            </Box>

            {/* Header content */}
            <Box
                sx={{
                    position: 'relative',
                    zIndex: 2,
                    textAlign: 'center',
                    p: 4,
                }}
            >
                <Typography
                    variant="h1"
                    sx={{
                        fontSize: { xs: '2.5rem', sm: '3.5rem', md: '5rem' },
                        fontWeight: 800,
                        fontFamily: "'Orbitron', sans-serif",
                        background: 'linear-gradient(135deg, #00f5ff 0%, #ff00aa 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        filter: 'drop-shadow(0 0 20px rgba(0, 245, 255, 0.5)) drop-shadow(0 0 40px rgba(255, 0, 170, 0.3))',
                        letterSpacing: '0.2em',
                        mb: 2,
                        animation: 'fadeInUp 1s ease-out',
                    }}
                >
                    CRYPTO GRAPH
                </Typography>
                <Typography
                    variant="h5"
                    sx={{
                        color: 'rgba(224, 247, 255, 0.9)',
                        fontWeight: 500,
                        fontFamily: "'Rajdhani', sans-serif",
                        letterSpacing: '0.25em',
                        textShadow: '0 0 30px rgba(0, 245, 255, 0.3)',
                        animation: 'fadeInUp 1s ease-out 0.2s both',
                    }}
                >
                    REAL-TIME CRYPTOCURRENCY ANALYTICS
                </Typography>
            </Box>
        </Box>
    );
}
