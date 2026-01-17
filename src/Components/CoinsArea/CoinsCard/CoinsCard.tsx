import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CoinsModel } from "../../../Models/CoinsModel";
import { coinsService } from "../../../Services/CoinsService";
import "./CoinsCard.css";


type CoinsCardProps = {
    coin: CoinsModel;
};

type Prices = {
    usd: number;
    eur: number;
    ils: number;
};

export function CoinsCard(props: CoinsCardProps) {
    const navigate = useNavigate();
    const [showPrices, setShowPrices] = useState(false);
    const [prices, setPrices] = useState<Prices | null>(null);
    const [loading, setLoading] = useState(false);

    function details() {
        navigate(`/coins/${props.coin.id}`);
    }

    async function handleShowPrices(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();

        if (showPrices) {
            setShowPrices(false);
            return;
        }

        setLoading(true);
        const coinPrices = await coinsService.getCoinPrices(props.coin.id || "");
        setLoading(false);

        if (coinPrices) {
            setPrices(coinPrices);
            setShowPrices(true);
        }
    }

    function formatPrice(price: number): string {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 6
        }).format(price);
    }

    return (
        <div className="CoinsCard" onClick={details}>
            <img src={props.coin.image} alt={props.coin.name} />
            <h3>{props.coin.name}</h3>
            <p>{props.coin.symbol}</p>

            <button onClick={handleShowPrices} disabled={loading}>
                {loading ? "Loading..." : showPrices ? "Hide Prices" : "Show Prices"}
            </button>

            {showPrices && prices && (
                <div className="price-info">
                    <div className="price-item">
                        <span className="price-label">USD</span>
                        <span className="price-value">
                            ${formatPrice(prices.usd)}
                        </span>
                    </div>
                    <div className="price-item">
                        <span className="price-label">EUR</span>
                        <span className="price-value">
                            €{formatPrice(prices.eur)}
                        </span>
                    </div>
                    <div className="price-item">
                        <span className="price-label">ILS</span>
                        <span className="price-value">
                            ₪{formatPrice(prices.ils)}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
