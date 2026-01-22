import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    Container,
    Box,
    Button,
    Typography,
    Card,
    CardContent,
    Grid,
    Chip,
    Avatar,
    Divider,
    Stack,
} from "@mui/material";
import { ArrowBack, TrendingUp, TrendingDown } from "@mui/icons-material";
import { AppState } from "../../../Redux/AppState";
import { PriceFormatter } from "../../../Utils/PriceFormatter";

export function CoinsDetails() {
    const params = useParams<{ coinId?: string }>();
    const navigate = useNavigate();
    const coinId = params.coinId;

    const allCoins = useSelector((state: AppState) => state.coins);

    const coin = useMemo(() => {
        if (!coinId) return undefined;
        return allCoins.find(c => c.id === coinId);
    }, [coinId, allCoins]);

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

    if (!coin) {
        return (
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Card>
                    <CardContent sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h5" gutterBottom>Coin not found: {coinId}</Typography>
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

    const priceChange24h = coin.price_change_percentage_24h || 0;
    const isPositive = priceChange24h >= 0;

    return (
        <Box
            sx={{
                minHeight: '100vh',
                py: 6,
                background: 'linear-gradient(180deg, rgba(10, 14, 39, 0.9) 0%, rgba(18, 22, 51, 0.95) 100%)',
            }}
        >
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
                            backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        },
                    }}
                >
                    Back to Home
                </Button>

                <Card
                    sx={{
                        background: 'linear-gradient(145deg, rgba(18, 22, 51, 0.95) 0%, rgba(26, 31, 58, 0.95) 100%)',
                        border: '1px solid rgba(102, 126, 234, 0.3)',
                    }}
                >
                    <CardContent sx={{ p: 4 }}>
                        <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 4 }}>
                            <Avatar
                                src={coin.image}
                                alt={coin.name}
                                sx={{ width: 80, height: 80 }}
                            />
                            <Box>
                                <Typography variant="h3" component="h1" gutterBottom>
                                    {coin.name}
                                </Typography>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Chip
                                        label={coin.symbol?.toUpperCase()}
                                        color="primary"
                                        size="small"
                                    />
                                    {coin.market_cap_rank && (
                                        <Chip
                                            label={`Rank #${coin.market_cap_rank}`}
                                            variant="outlined"
                                            size="small"
                                        />
                                    )}
                                </Stack>
                            </Box>
                        </Stack>

                        <Divider sx={{ mb: 4, borderColor: 'rgba(102, 126, 234, 0.3)' }} />

                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h5" gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
                                Basic Information
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={4}>
                                    <InfoCard label="Name" value={coin.name} />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <InfoCard label="Symbol" value={coin.symbol?.toUpperCase()} />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <InfoCard label="ID" value={coin.id} />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <InfoCard
                                        label="Market Cap Rank"
                                        value={coin.market_cap_rank ? `#${coin.market_cap_rank}` : "N/A"}
                                    />
                                </Grid>
                                {coin.last_updated && (
                                    <Grid item xs={12} sm={6} md={4}>
                                        <InfoCard
                                            label="Last Updated"
                                            value={formatDate(coin.last_updated)}
                                        />
                                    </Grid>
                                )}
                            </Grid>
                        </Box>

                        <Divider sx={{ mb: 4, borderColor: 'rgba(102, 126, 234, 0.3)' }} />

                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h5" gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
                                Market Data
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={4}>
                                    <InfoCard
                                        label="Current Price (USD)"
                                        value={formatPrice(coin.current_price)}
                                        highlight
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <InfoCard label="Market Cap" value={formatPrice(coin.market_cap)} />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <InfoCard
                                        label="Fully Diluted Valuation"
                                        value={formatPrice(coin.fully_diluted_valuation)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <InfoCard label="Total Volume" value={formatPrice(coin.total_volume)} />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <InfoCard label="24h High" value={formatPrice(coin.high_24h)} />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <InfoCard label="24h Low" value={formatPrice(coin.low_24h)} />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            borderLeft: `3px solid ${isPositive ? '#10b981' : '#ef4444'}`,
                                        }}
                                    >
                                        <Typography variant="caption" color="text.secondary" gutterBottom>
                                            24h Change
                                        </Typography>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            {isPositive ? (
                                                <TrendingUp sx={{ color: '#10b981' }} />
                                            ) : (
                                                <TrendingDown sx={{ color: '#ef4444' }} />
                                            )}
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    color: isPositive ? '#10b981' : '#ef4444',
                                                }}
                                            >
                                                {coin.price_change_24h !== undefined
                                                    ? `${coin.price_change_24h >= 0 ? "+" : ""}${coin.price_change_24h.toFixed(2)}`
                                                    : "N/A"}
                                            </Typography>
                                        </Stack>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            borderLeft: `3px solid ${isPositive ? '#10b981' : '#ef4444'}`,
                                        }}
                                    >
                                        <Typography variant="caption" color="text.secondary" gutterBottom>
                                            24h Change %
                                        </Typography>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            {isPositive ? (
                                                <TrendingUp sx={{ color: '#10b981' }} />
                                            ) : (
                                                <TrendingDown sx={{ color: '#ef4444' }} />
                                            )}
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    color: isPositive ? '#10b981' : '#ef4444',
                                                }}
                                            >
                                                {priceChange24h !== undefined
                                                    ? `${priceChange24h >= 0 ? "+" : ""}${priceChange24h.toFixed(2)}%`
                                                    : "N/A"}
                                            </Typography>
                                        </Stack>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <InfoCard
                                        label="Market Cap Change 24h"
                                        value={
                                            coin.market_cap_change_24h !== undefined
                                                ? `${coin.market_cap_change_24h >= 0 ? "+" : ""}${formatPrice(coin.market_cap_change_24h)}`
                                                : "N/A"
                                        }
                                        valueColor={(coin.market_cap_change_24h || 0) >= 0 ? '#10b981' : '#ef4444'}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <InfoCard
                                        label="Market Cap Change % 24h"
                                        value={
                                            coin.market_cap_change_percentage_24h !== undefined
                                                ? `${coin.market_cap_change_percentage_24h >= 0 ? "+" : ""}${coin.market_cap_change_percentage_24h.toFixed(2)}%`
                                                : "N/A"
                                        }
                                        valueColor={(coin.market_cap_change_percentage_24h || 0) >= 0 ? '#10b981' : '#ef4444'}
                                    />
                                </Grid>
                            </Grid>
                        </Box>

                        <Divider sx={{ mb: 4, borderColor: 'rgba(102, 126, 234, 0.3)' }} />

                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h5" gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
                                Supply Information
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={4}>
                                    <InfoCard
                                        label="Circulating Supply"
                                        value={formatNumber(coin.circulating_supply)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <InfoCard label="Total Supply" value={formatNumber(coin.total_supply)} />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <InfoCard label="Max Supply" value={formatNumber(coin.max_supply)} />
                                </Grid>
                            </Grid>
                        </Box>

                        <Divider sx={{ mb: 4, borderColor: 'rgba(102, 126, 234, 0.3)' }} />

                        <Box>
                            <Typography variant="h5" gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
                                All Time Stats
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={4}>
                                    <InfoCard label="All Time High" value={formatPrice(coin.ath)} />
                                </Grid>
                                {coin.ath_date && (
                                    <Grid item xs={12} sm={6} md={4}>
                                        <InfoCard label="ATH Date" value={formatDate(coin.ath_date)} />
                                    </Grid>
                                )}
                                {coin.ath_change_percentage !== undefined && (
                                    <Grid item xs={12} sm={6} md={4}>
                                        <InfoCard
                                            label="ATH Change %"
                                            value={`${coin.ath_change_percentage.toFixed(2)}%`}
                                        />
                                    </Grid>
                                )}
                                <Grid item xs={12} sm={6} md={4}>
                                    <InfoCard label="All Time Low" value={formatPrice(coin.atl)} />
                                </Grid>
                                {coin.atl_date && (
                                    <Grid item xs={12} sm={6} md={4}>
                                        <InfoCard label="ATL Date" value={formatDate(coin.atl_date)} />
                                    </Grid>
                                )}
                                {coin.atl_change_percentage !== undefined && (
                                    <Grid item xs={12} sm={6} md={4}>
                                        <InfoCard
                                            label="ATL Change %"
                                            value={`${coin.atl_change_percentage.toFixed(2)}%`}
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
                    ? 'rgba(102, 126, 234, 0.1)'
                    : 'rgba(255, 255, 255, 0.05)',
                borderLeft: `3px solid ${highlight ? '#667eea' : 'rgba(102, 126, 234, 0.5)'}`,
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
