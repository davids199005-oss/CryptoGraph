import { useEffect, useRef, useState } from "react";
import { Box, Typography, alpha } from "@mui/material";

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
                    background: 'linear-gradient(180deg, rgba(10, 14, 39, 0.3) 0%, rgba(102, 126, 234, 0.2) 100%)',
                    zIndex: 1,
                },
            }}
        >
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
                        color: '#ffeb3b',
                        WebkitTextStroke: '2px #000',
                        fontSize: { xs: '2.5rem', sm: '3.5rem', md: '5rem' },
                        fontWeight: 700,
                        fontFamily: 'MainFont',
                        textShadow: '4px 4px 8px rgba(0, 0, 0, 0.8), 0 0 30px rgba(102, 126, 234, 0.5)',
                        letterSpacing: '0.2em',
                        mb: 2,
                        animation: 'fadeInUp 1s ease-out',
                    }}
                >
                    Crypto Graph
                </Typography>
                <Typography
                    variant="h5"
                    sx={{
                        color: alpha('#fff', 0.9),
                        fontWeight: 400,
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                        animation: 'fadeInUp 1s ease-out 0.2s both',
                    }}
                >
                    Real-Time Cryptocurrency Analytics
                </Typography>
            </Box>
        </Box>
    );
}
