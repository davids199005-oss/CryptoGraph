import { Box, Container, Typography, Stack, Link } from "@mui/material";
import { Copyright } from "@mui/icons-material";

export function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                px: 2,
                mt: 'auto',
                background: 'linear-gradient(180deg, rgba(10, 14, 39, 0.95) 0%, rgba(18, 22, 51, 0.98) 100%)',
                borderTop: '2px solid rgba(102, 126, 234, 0.3)',
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
                        <Copyright sx={{ fontSize: 18, color: 'primary.main' }} />
                        <Typography variant="body2" color="text.secondary">
                         Created By David Veryutin   {new Date().getFullYear()} CryptoGraph. All rights reserved.
                        </Typography>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
}
