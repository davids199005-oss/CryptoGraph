/**
 * 404 page: shown for unknown routes. Offers a button to navigate back to Home.
 */
import { Box, Container, Typography, Button } from "@mui/material";
import { Home, SearchOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                minHeight: '60vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 6,
            }}
        >
            <Container maxWidth="sm">
                <Box
                    sx={{
                        textAlign: 'center',
                        p: 6,
                        borderRadius: 2,
                        background: 'linear-gradient(145deg, rgba(10, 14, 26, 0.95) 0%, rgba(5, 8, 16, 0.98) 100%)',
                        border: '1px solid rgba(0, 245, 255, 0.3)',
                        boxShadow: '0 0 60px rgba(0, 245, 255, 0.1)',
                    }}
                >
                    <SearchOff
                        sx={{
                            fontSize: 120,
                            color: '#00f5ff',
                            mb: 3,
                            filter: 'drop-shadow(0 0 20px rgba(0, 245, 255, 0.5))',
                        }}
                    />
                    <Typography
                        variant="h1"
                        gutterBottom
                        sx={{
                            fontSize: { xs: '3rem', md: '4rem' },
                            fontWeight: 800,
                            letterSpacing: '0.1em',
                            background: 'linear-gradient(135deg, #00f5ff 0%, #ff00aa 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            filter: 'drop-shadow(0 0 25px rgba(0, 245, 255, 0.6))',
                        }}
                    >
                        404
                    </Typography>
                    <Typography variant="h4" gutterBottom sx={{ mb: 2, letterSpacing: '0.05em', color: '#e0f7ff' }}>
                        PAGE NOT FOUND
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4, letterSpacing: '0.03em' }}>
                        Sorry, the page you're looking for doesn't exist or has been moved.
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<Home />}
                        onClick={() => navigate("/Home")}
                        sx={{
                            px: 4,
                            py: 1.5,
                            letterSpacing: '0.08em',
                            background: 'linear-gradient(135deg, #00f5ff 0%, #00b8c4 100%)',
                            color: '#050810',
                            boxShadow: '0 0 30px rgba(0, 245, 255, 0.5)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #66fff5 0%, #00f5ff 100%)',
                                boxShadow: '0 0 40px rgba(0, 245, 255, 0.6)',
                            },
                        }}
                    >
                        GO TO HOME
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}
