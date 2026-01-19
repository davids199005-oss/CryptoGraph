import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppState } from "../../../Redux/AppState";
import "./CoinsDetails.css";

export function CoinsDetails() {
    const params = useParams<{ coinId?: string }>();
    const navigate = useNavigate();
    const coinId = params.coinId;
    
    const allCoins = useSelector((state: AppState) => state.coins);
    
    const coin = useMemo(() => {
        if (!coinId) return undefined;
        return allCoins.find(c => c.id === coinId);
    }, [coinId, allCoins]);

    if (!coinId) {
        return (
            <div className="CoinsDetails">
                <p>Error: Coin ID is missing from URL</p>
                <button onClick={() => navigate("/Home")}>Back to Home</button>
            </div>
        );
    }

    if (!coin) {
        return (
            <div className="CoinsDetails">
                <p>Coin not found: {coinId}</p>
                <button onClick={() => navigate("/Home")}>Back to Home</button>
            </div>
        );
    }

    const formatPrice = (price: number | undefined): string => {
        if (!price) return "N/A";
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 6
        }).format(price);
    };

    const formatNumber = (num: number | undefined): string => {
        if (!num) return "N/A";
        return new Intl.NumberFormat('en-US').format(num);
    };

    const formatDate = (dateString: string | undefined): string => {
        if (!dateString) return "N/A";
        try {
            return new Date(dateString).toLocaleDateString();
        } catch {
            return dateString;
        }
    };

    return (
        <div className="CoinsDetails">
            <div className="CoinsDetails-content">
                <div className="CoinsDetails-header">
                    <button onClick={() => navigate("/Home")}>← Back</button>
                    <h1>{coin.name} ({coin.symbol?.toUpperCase()})</h1>
                </div>

                {coin.image && (
                    <div className="CoinsDetails-image">
                        <img src={coin.image} alt={coin.name} />
                    </div>
                )}

                <div className="CoinsDetails-info">
                    <h2>Basic Information</h2>
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="info-label">Name:</span>
                            <span className="info-value">{coin.name}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Symbol:</span>
                            <span className="info-value">{coin.symbol?.toUpperCase()}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">ID:</span>
                            <span className="info-value">{coin.id}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Market Cap Rank:</span>
                            <span className="info-value">#{coin.market_cap_rank || "N/A"}</span>
                        </div>
                        {coin.last_updated && (
                            <div className="info-item">
                                <span className="info-label">Last Updated:</span>
                                <span className="info-value">{formatDate(coin.last_updated)}</span>
                            </div>
                        )}
                    </div>

                    <h2>Market Data</h2>
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="info-label">Current Price (USD):</span>
                            <span className="info-value">{formatPrice(coin.current_price)}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Market Cap:</span>
                            <span className="info-value">{formatPrice(coin.market_cap)}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Fully Diluted Valuation:</span>
                            <span className="info-value">{formatPrice(coin.fully_diluted_valuation)}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Total Volume:</span>
                            <span className="info-value">{formatPrice(coin.total_volume)}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">24h High:</span>
                            <span className="info-value">{formatPrice(coin.high_24h)}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">24h Low:</span>
                            <span className="info-value">{formatPrice(coin.low_24h)}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">24h Change:</span>
                            <span className="info-value" style={{
                                color: (coin.price_change_24h || 0) >= 0 ? "#16a34a" : "#dc2626"
                            }}>
                                {coin.price_change_24h !== undefined ? 
                                    `${coin.price_change_24h >= 0 ? "+" : ""}${coin.price_change_24h.toFixed(2)}` : 
                                    "N/A"}
                            </span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">24h Change %:</span>
                            <span className="info-value" style={{
                                color: (coin.price_change_percentage_24h || 0) >= 0 ? "#16a34a" : "#dc2626"
                            }}>
                                {coin.price_change_percentage_24h !== undefined ? 
                                    `${coin.price_change_percentage_24h >= 0 ? "+" : ""}${coin.price_change_percentage_24h.toFixed(2)}%` : 
                                    "N/A"}
                            </span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Market Cap Change 24h:</span>
                            <span className="info-value" style={{
                                color: (coin.market_cap_change_24h || 0) >= 0 ? "#16a34a" : "#dc2626"
                            }}>
                                {coin.market_cap_change_24h !== undefined ? 
                                    `${coin.market_cap_change_24h >= 0 ? "+" : ""}${formatPrice(coin.market_cap_change_24h)}` : 
                                    "N/A"}
                            </span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Market Cap Change % 24h:</span>
                            <span className="info-value" style={{
                                color: (coin.market_cap_change_percentage_24h || 0) >= 0 ? "#16a34a" : "#dc2626"
                            }}>
                                {coin.market_cap_change_percentage_24h !== undefined ? 
                                    `${coin.market_cap_change_percentage_24h >= 0 ? "+" : ""}${coin.market_cap_change_percentage_24h.toFixed(2)}%` : 
                                    "N/A"}
                            </span>
                        </div>
                    </div>

                    <h2>Supply Information</h2>
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="info-label">Circulating Supply:</span>
                            <span className="info-value">{formatNumber(coin.circulating_supply)}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Total Supply:</span>
                            <span className="info-value">{formatNumber(coin.total_supply)}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Max Supply:</span>
                            <span className="info-value">{formatNumber(coin.max_supply)}</span>
                        </div>
                    </div>

                    <h2>All Time Stats</h2>
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="info-label">All Time High:</span>
                            <span className="info-value">{formatPrice(coin.ath)}</span>
                        </div>
                        {coin.ath_date && (
                            <div className="info-item">
                                <span className="info-label">ATH Date:</span>
                                <span className="info-value">{formatDate(coin.ath_date)}</span>
                            </div>
                        )}
                        {coin.ath_change_percentage !== undefined && (
                            <div className="info-item">
                                <span className="info-label">ATH Change %:</span>
                                <span className="info-value">{coin.ath_change_percentage.toFixed(2)}%</span>
                            </div>
                        )}
                        <div className="info-item">
                            <span className="info-label">All Time Low:</span>
                            <span className="info-value">{formatPrice(coin.atl)}</span>
                        </div>
                        {coin.atl_date && (
                            <div className="info-item">
                                <span className="info-label">ATL Date:</span>
                                <span className="info-value">{formatDate(coin.atl_date)}</span>
                            </div>
                        )}
                        {coin.atl_change_percentage !== undefined && (
                            <div className="info-item">
                                <span className="info-label">ATL Change %:</span>
                                <span className="info-value">{coin.atl_change_percentage.toFixed(2)}%</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
