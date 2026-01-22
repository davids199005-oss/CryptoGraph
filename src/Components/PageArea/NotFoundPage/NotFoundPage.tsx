import { Box, Container, Typography, Button } from "@mui/material";
import { Home, SearchOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(180deg, rgba(10, 14, 39, 0.9) 0%, rgba(18, 22, 51, 0.95) 100%)',
            }}
        >
            <Container maxWidth="sm">
                <Box
                    sx={{
                        textAlign: 'center',
                        p: 6,
                        borderRadius: 4,
                        background: 'linear-gradient(145deg, rgba(18, 22, 51, 0.95) 0%, rgba(26, 31, 58, 0.95) 100%)',
                        border: '1px solid rgba(102, 126, 234, 0.3)',
                    }}
                >
                    <SearchOff
                        sx={{
                            fontSize: 120,
                            color: 'primary.main',
                            mb: 3,
                        }}
                    />
                    <Typography
                        variant="h1"
                        gutterBottom
                        sx={{
                            fontSize: { xs: '3rem', md: '4rem' },
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        404
                    </Typography>
                    <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
                        Page Not Found
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
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
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #5568d3 0%, #66408e 100%)',
                            },
                        }}
                    >
                        Go to Home
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}
