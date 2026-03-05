/**
 * Reports page: real-time line chart and report cards for selected coins.
 * Uses useReportsData for periodic price updates (CryptoCompare) and chart data.
 */
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    Chip,
    Stack,
    CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { TrendingUp, TrendingDown } from "@mui/icons-material";
import { AppState } from "../../../Redux/AppState";
import { PriceFormatter } from "../../../Utils/PriceFormatter";
import { useReportsData } from "../../../Hooks/useReportsData";

export function Reports() {
    const allCoins = useSelector((state: AppState) => state.coins);
    const selectedCoinIds = useSelector((state: AppState) => state.selectedCoins);

    const selectedCoins = useMemo(() => {
        return allCoins.filter(coin => coin.id && selectedCoinIds.includes(coin.id));
    }, [allCoins, selectedCoinIds]);

    const {
        coinReports,
        loading,
        lastUpdated,
        chartData,
        chartColors,
        selectedCoins: selectedCoinsFromHook,
    } = useReportsData(selectedCoinIds, selectedCoins);

    if (selectedCoinIds.length === 0) {
        return (
            <Container maxWidth="xl" sx={{ py: 8 }}>
                <Card>
                    <CardContent sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h4" gutterBottom>
                            No Coins Selected
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Please select coins on the Home page to view reports and charts.
                        </Typography>
                    </CardContent>
                </Card>
            </Container>
        );
    }

    return (
        <Box sx={{ py: 4 }}>
            <Container maxWidth="xl">
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h2" gutterBottom>
                        Coins Reports & Real-Time Chart
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                        {loading && (
                            <Chip
                                icon={<CircularProgress size={16} />}
                                label="Refreshing..."
                                color="primary"
                                variant="outlined"
                            />
                        )}
                        {lastUpdated && (
                            <Typography variant="body2" color="text.secondary">
                                Last updated: {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </Typography>
                        )}
                    </Stack>
                </Box>

                <Card sx={{ mb: 4 }}>
                    <CardContent>
                        <Typography variant="h4" gutterBottom>
                            Real-Time Line Chart
                        </Typography>
                        {selectedCoinIds.length > 0 && chartData.length > 0 ? (
                            <Box sx={{ mt: 3 }}>
                                <ResponsiveContainer width="100%" height={500}>
                                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 245, 255, 0.15)" />
                                        <XAxis
                                            dataKey="time"
                                            stroke="#ffffff"
                                            style={{ fontSize: '12px' }}
                                        />
                                        <YAxis
                                            stroke="#ffffff"
                                            style={{ fontSize: '12px' }}
                                            domain={['auto', 'auto']}
                                        />
                                        <Legend />
                                        {selectedCoinsFromHook.map((coin, index) => {
                                            if (!coin.symbol) return null;
                                            const color = chartColors[index % chartColors.length];
                                            return (
                                                <Line
                                                    key={coin.id}
                                                    type="monotone"
                                                    dataKey={coin.symbol.toUpperCase()}
                                                    stroke={color}
                                                    strokeWidth={3}
                                                    dot={false}
                                                    activeDot={{ r: 5 }}
                                                    name={coin.name || coin.symbol.toUpperCase()}
                                                />
                                            );
                                        })}
                                    </LineChart>
                                </ResponsiveContainer>
                            </Box>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 8 }}>
                                <CircularProgress />
                                <Typography variant="body1" sx={{ mt: 2 }}>Loading chart data...</Typography>
                            </Box>
                        )}
                    </CardContent>
                </Card>

                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" gutterBottom>
                        Coins Reports
                    </Typography>
                    <Grid container spacing={3}>
                        {coinReports.map((report) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={report.coin.id}>
                                <Card sx={{ height: '100%' }}>
                                    <CardContent>
                                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                                            {report.coin.image && (
                                                <Box
                                                    component="img"
                                                    src={report.coin.image}
                                                    alt={report.coin.name}
                                                    sx={{
                                                        width: 48,
                                                        height: 48,
                                                        borderRadius: '50%',
                                                        border: '2px solid',
                                                        borderColor: 'primary.main',
                                                    }}
                                                />
                                            )}
                                            <Box>
                                                <Typography variant="h6" sx={{ fontSize: '1rem' }}>
                                                    {report.coin.name}
                                                </Typography>
                                                <Chip
                                                    label={report.coin.symbol?.toUpperCase()}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: 'rgba(0, 245, 255, 0.15)',
                                                        color: 'primary.light',
                                                        fontWeight: 600,
                                                    }}
                                                />
                                            </Box>
                                        </Stack>

                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                Current Price
                                            </Typography>
                                            <Typography variant="h6" color="primary.light">
                                                {PriceFormatter.formatCurrency(report.currentPrice)}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                24h Change
                                            </Typography>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                {report.priceChange >= 0 ? (
                                                    <TrendingUp sx={{ color: 'success.main' }} />
                                                ) : (
                                                    <TrendingDown sx={{ color: 'error.main' }} />
                                                )}
                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        color: report.priceChange >= 0 ? 'success.main' : 'error.main',
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    {report.priceChange >= 0 ? "+" : ""}{report.priceChangePercent.toFixed(2)}%
                                                    ({PriceFormatter.formatCurrency(report.priceChange)})
                                                </Typography>
                                            </Stack>
                                        </Box>

                                        <Stack spacing={1}>
                                            {report.coin.market_cap && (
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography variant="body2" color="text.secondary">Market Cap:</Typography>
                                                    <Typography variant="body2" fontWeight={600}>
                                                        {PriceFormatter.formatCurrency(report.coin.market_cap)}
                                                    </Typography>
                                                </Box>
                                            )}
                                            {report.coin.total_volume && (
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography variant="body2" color="text.secondary">Volume:</Typography>
                                                    <Typography variant="body2" fontWeight={600}>
                                                        {PriceFormatter.formatCurrency(report.coin.total_volume)}
                                                    </Typography>
                                                </Box>
                                            )}
                                            {report.coin.market_cap_rank && (
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography variant="body2" color="text.secondary">Rank:</Typography>
                                                    <Typography variant="body2" fontWeight={600}>
                                                        #{report.coin.market_cap_rank}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
}
