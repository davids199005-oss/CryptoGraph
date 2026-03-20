/**
 * Coin details page: full market data, supply, and ATH/ATL for a single coin.
 * Data is loaded from the store or fetched by ID via useCoinDetails; supports direct URL access.
 */
import { useNavigate, useParams } from "react-router-dom";
import {
    Container,
    Box,
    Button,
    Typography,
    Card,
    CardContent,
    Chip,
    Avatar,
    Divider,
    Stack,
    CircularProgress,
    useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { ArrowBack, TrendingUp, TrendingDown } from "@mui/icons-material";
import { PriceFormatter } from "../../Utils/PriceFormatter";
import { useCoinDetails } from "../../Hooks/useCoinDetails";

export function CoinsDetails() {
    const theme = useTheme();
    const params = useParams<{ coinId?: string }>();
    const navigate = useNavigate();
    const coinId = params.coinId;

    const { coin: displayCoin, loading: loadingDetail, error: errorDetail } = useCoinDetails(coinId);

    const formatPrice = (value: number | undefined | null): string => {
        if (value === undefined || value === null) return "N/A";
        return PriceFormatter.formatCurrency(value);
    };

    const formatNumber = (value: number | undefined | null): string => {
        if (value === undefined || value === null) return "N/A";
        return PriceFormatter.formatNumber(value);
    };

    const formatDate = (dateString: string): string => {
        return PriceFormatter.formatDate(dateString);
    };

    if (!coinId) {
        return (
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Card>
                    <CardContent sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h5" gutterBottom>Error: Coin ID is missing from URL</Typography>
                        <Button
                            variant="contained"
                            startIcon={<ArrowBack />}
                            onClick={() => navigate("/Home")}
                            sx={{ mt: 2 }}
                        >
                            Back to Home
                        </Button>
                    </CardContent>
                </Card>
            </Container>
        );
    }

    if (loadingDetail && !displayCoin) {
        return (
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Card>
                    <CardContent sx={{ textAlign: "center", py: 8 }}>
                        <CircularProgress size={48} sx={{ mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                            Loading coin details...
                        </Typography>
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBack />}
                            onClick={() => navigate("/Home")}
                            sx={{ mt: 3 }}
                        >
                            Back to Home
                        </Button>
                    </CardContent>
                </Card>
            </Container>
        );
    }

    if (errorDetail && !displayCoin) {
        return (
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Card>
                    <CardContent sx={{ textAlign: "center", py: 8 }}>
                        <Typography variant="h5" gutterBottom>
                            {errorDetail}
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<ArrowBack />}
                            onClick={() => navigate("/Home")}
                            sx={{ mt: 2 }}
                        >
                            Back to Home
                        </Button>
                    </CardContent>
                </Card>
            </Container>
        );
    }

    if (!displayCoin) {
        return null;
    }

    const priceChange24h = displayCoin.price_change_percentage_24h || 0;
    const isPositive = priceChange24h >= 0;

    return (
        <Box sx={{ py: 6 }}>
            <Container maxWidth="lg">
                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() => navigate("/Home")}
                    sx={{
                        mb: 3,
                        borderColor: 'primary.main',
                        color: 'primary.main',
                        '&:hover': {
                            borderColor: 'primary.light',
                            backgroundColor: 'rgba(0, 245, 255, 0.08)',
                        },
                    }}
                >
                    Back to Home
                </Button>

                <Card
                    sx={{
                        background: theme.custom.cardGradient,
                        border: `1px solid ${theme.custom.glassBorderStrong}`,
                    }}
                >
                    <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
                        <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: { xs: 3, md: 4 } }}>
                            <Avatar
                                src={displayCoin.image}
                                alt={displayCoin.name}
                                sx={{ width: 80, height: 80 }}
                            />
                            <Box>
                                <Typography variant="h3" component="h1" gutterBottom>
                                    {displayCoin.name}
                                </Typography>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Chip
                                        label={displayCoin.symbol?.toUpperCase()}
                                        color="primary"
                                        size="small"
                                    />
                                    {displayCoin.market_cap_rank && (
                                        <Chip
                                            label={`Rank #${displayCoin.market_cap_rank}`}
                                            variant="outlined"
                                            size="small"
                                        />
                                    )}
                                </Stack>
                            </Box>
                        </Stack>

                        <Divider sx={{ mb: { xs: 3, md: 4 }, borderColor: theme.custom.glassBorder }} />

                        <Box sx={{ mb: { xs: 3, md: 4 } }}>
                            <Typography variant="h4" gutterBottom sx={{ mb: 2.5, color: 'primary.main' }}>
                                Basic Information
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <InfoCard label="Name" value={displayCoin.name} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <InfoCard label="Symbol" value={displayCoin.symbol?.toUpperCase()} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <InfoCard label="ID" value={displayCoin.id} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <InfoCard
                                        label="Market Cap Rank"
                                        value={displayCoin.market_cap_rank ? `#${displayCoin.market_cap_rank}` : "N/A"}
                                    />
                                </Grid>
                                {displayCoin.last_updated && (
                                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                        <InfoCard
                                            label="Last Updated"
                                            value={formatDate(displayCoin.last_updated)}
                                        />
                                    </Grid>
                                )}
                            </Grid>
                        </Box>

                        <Divider sx={{ mb: { xs: 3, md: 4 }, borderColor: theme.custom.glassBorder }} />

                        <Box sx={{ mb: { xs: 3, md: 4 } }}>
                            <Typography variant="h4" gutterBottom sx={{ mb: 2.5, color: 'primary.main' }}>
                                Market Data
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <InfoCard
                                        label="Current Price (USD)"
                                        value={formatPrice(displayCoin.current_price)}
                                        highlight
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <InfoCard label="Market Cap" value={formatPrice(displayCoin.market_cap)} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <InfoCard
                                        label="Fully Diluted Valuation"
                                        value={formatPrice(displayCoin.fully_diluted_valuation)}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <InfoCard label="Total Volume" value={formatPrice(displayCoin.total_volume)} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <InfoCard label="24h High" value={formatPrice(displayCoin.high_24h)} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <InfoCard label="24h Low" value={formatPrice(displayCoin.low_24h)} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <ChangeInfoCard
                                        label="24h Change"
                                        value={
                                            displayCoin.price_change_24h !== undefined
                                                ? `${displayCoin.price_change_24h >= 0 ? "+" : ""}${displayCoin.price_change_24h.toFixed(2)}`
                                                : "N/A"
                                        }
                                        isPositive={isPositive}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <ChangeInfoCard
                                        label="24h Change %"
                                        value={
                                            priceChange24h !== undefined
                                                ? `${priceChange24h >= 0 ? "+" : ""}${priceChange24h.toFixed(2)}%`
                                                : "N/A"
                                        }
                                        isPositive={isPositive}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <InfoCard
                                        label="Market Cap Change 24h"
                                        value={
                                            displayCoin.market_cap_change_24h !== undefined
                                                ? `${displayCoin.market_cap_change_24h >= 0 ? "+" : ""}${formatPrice(displayCoin.market_cap_change_24h)}`
                                                : "N/A"
                                        }
                                        valueColor={(displayCoin.market_cap_change_24h || 0) >= 0 ? 'success.main' : 'error.main'}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <InfoCard
                                        label="Market Cap Change % 24h"
                                        value={
                                            displayCoin.market_cap_change_percentage_24h !== undefined
                                                ? `${displayCoin.market_cap_change_percentage_24h >= 0 ? "+" : ""}${displayCoin.market_cap_change_percentage_24h.toFixed(2)}%`
                                                : "N/A"
                                        }
                                        valueColor={(displayCoin.market_cap_change_percentage_24h || 0) >= 0 ? 'success.main' : 'error.main'}
                                    />
                                </Grid>
                            </Grid>
                        </Box>

                        <Divider sx={{ mb: { xs: 3, md: 4 }, borderColor: theme.custom.glassBorder }} />

                        <Box sx={{ mb: { xs: 3, md: 4 } }}>
                            <Typography variant="h4" gutterBottom sx={{ mb: 2.5, color: 'primary.main' }}>
                                Supply Information
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <InfoCard
                                        label="Circulating Supply"
                                        value={formatNumber(displayCoin.circulating_supply)}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <InfoCard label="Total Supply" value={formatNumber(displayCoin.total_supply)} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <InfoCard label="Max Supply" value={formatNumber(displayCoin.max_supply)} />
                                </Grid>
                            </Grid>
                        </Box>

                        <Divider sx={{ mb: { xs: 3, md: 4 }, borderColor: theme.custom.glassBorder }} />

                        <Box>
                            <Typography variant="h4" gutterBottom sx={{ mb: 2.5, color: 'primary.main' }}>
                                All Time Stats
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <InfoCard label="All Time High" value={formatPrice(displayCoin.ath)} />
                                </Grid>
                                {displayCoin.ath_date && (
                                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                        <InfoCard label="ATH Date" value={formatDate(displayCoin.ath_date)} />
                                    </Grid>
                                )}
                                {displayCoin.ath_change_percentage !== undefined && (
                                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                        <InfoCard
                                            label="ATH Change %"
                                            value={`${displayCoin.ath_change_percentage.toFixed(2)}%`}
                                        />
                                    </Grid>
                                )}
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <InfoCard label="All Time Low" value={formatPrice(displayCoin.atl)} />
                                </Grid>
                                {displayCoin.atl_date && (
                                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                        <InfoCard label="ATL Date" value={formatDate(displayCoin.atl_date)} />
                                    </Grid>
                                )}
                                {displayCoin.atl_change_percentage !== undefined && (
                                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                        <InfoCard
                                            label="ATL Change %"
                                            value={`${displayCoin.atl_change_percentage.toFixed(2)}%`}
                                        />
                                    </Grid>
                                )}
                            </Grid>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}

/** Reusable label-value block for the details page (e.g. Market Cap, ATH). */
function InfoCard({
    label,
    value,
    highlight,
    valueColor,
}: {
    label: string;
    value: string | undefined;
    highlight?: boolean;
    valueColor?: string;
}) {
    return (
        <Box
            sx={{
                p: 2,
                borderRadius: 2,
                background: highlight
                    ? 'rgba(0, 245, 255, 0.1)'
                    : 'rgba(255, 255, 255, 0.05)',
                borderLeft: '3px solid',
                borderLeftColor: highlight ? 'primary.main' : 'rgba(0, 245, 255, 0.5)',
            }}
        >
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                {label}
            </Typography>
            <Typography
                variant="h6"
                sx={{
                    color: valueColor || 'text.primary',
                    fontWeight: highlight ? 600 : 500,
                }}
            >
                {value || "N/A"}
            </Typography>
        </Box>
    );
}

function ChangeInfoCard({
    label,
    value,
    isPositive,
}: {
    label: string;
    value: string;
    isPositive: boolean;
}) {
    return (
        <Box
            sx={{
                p: 2,
                borderRadius: 2,
                background: 'rgba(255, 255, 255, 0.05)',
                borderLeft: '3px solid',
                borderLeftColor: isPositive ? 'success.main' : 'error.main',
            }}
        >
            <Typography variant="caption" color="text.secondary" gutterBottom>
                {label}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
                {isPositive ? (
                    <TrendingUp sx={{ color: 'success.main' }} />
                ) : (
                    <TrendingDown sx={{ color: 'error.main' }} />
                )}
                <Typography
                    variant="h6"
                    sx={{
                        color: isPositive ? 'success.main' : 'error.main',
                    }}
                >
                    {value}
                </Typography>
            </Stack>
        </Box>
    );
}
