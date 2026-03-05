import { Box, Container, Typography, Stack } from "@mui/material";
import { Copyright } from "@mui/icons-material";

/** Footer with copyright, author link, and API attribution (CoinGecko). */
export function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                px: 2,
                mt: 'auto',
                background: 'rgba(5, 8, 16, 0.9)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                borderTop: '1px solid rgba(0, 245, 255, 0.25)',
                boxShadow: '0 0 40px rgba(0, 245, 255, 0.04)',
            }}
        >
            <Container maxWidth="lg">
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}
                >
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Copyright sx={{ fontSize: 18, color: '#00f5ff' }} />
                        <Typography variant="body2" color="text.secondary">
                            Created By <a href="https://github.com/davids199005-oss" target="_blank" rel="noopener noreferrer">David Veryutin</a>  {new Date().getFullYear()} CryptoGraph. All rights reserved. Powered By CoinGecko API.
                        </Typography>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
}
