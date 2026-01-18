import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CoinsModel } from "../../../Models/CoinsModel";
import { coinsService } from "../../../Services/CoinsService";
import { AppState } from "../../../Redux/AppState";
import { selectedCoinsSliceActions } from "../../../Redux/CoinsSlice";
import { RemoveCoinModal } from "../RemoveCoinModal/RemoveCoinModal";
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
    const dispatch = useDispatch();
    const selectedCoinIds = useSelector((state: AppState) => state.selectedCoins);
    const [showPrices, setShowPrices] = useState(false);
    const [prices, setPrices] = useState<Prices | null>(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    
    const isSelected = props.coin.id ? selectedCoinIds.includes(props.coin.id) : false;
    
    const handleCoinRemovedFromModal = () => {
        if (props.coin.id) {
            dispatch(selectedCoinsSliceActions.toggleCoin(props.coin.id));
        }
    };

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

    function handleToggleSelect(e: React.MouseEvent<HTMLDivElement> | React.ChangeEvent<HTMLInputElement>) {
        e.stopPropagation();
        
        if (!props.coin.id) return;

        if (isSelected) {
            dispatch(selectedCoinsSliceActions.toggleCoin(props.coin.id));
        } else {
            if (selectedCoinIds.length >= 5) {
                setShowModal(true);
            } else {
                dispatch(selectedCoinsSliceActions.toggleCoin(props.coin.id));
            }
        }
    }

    return (
        <>
        <div className={`CoinsCard ${isSelected ? 'selected' : ''}`} onClick={details}>
            <div className="CoinsCard-select-switch">
                <label className="coin-switch" onClick={(e) => e.stopPropagation()}>
                    <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={handleToggleSelect}
                    />
                    <span className="coin-switch-slider"></span>
                </label>
                <span 
                    className="CoinsCard-switch-label"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleToggleSelect(e as any);
                    }}
                >
                    {isSelected ? "Выбрано" : "Выбрать"}
                </span>
            </div>
            <img src={props.coin.image} alt={props.coin.name} />
            <h3>{props.coin.name}</h3>
            <p>{props.coin.symbol}</p>

            <button 
                className={`price-toggle-btn ${showPrices ? 'active' : ''}`}
                onClick={handleShowPrices} 
                disabled={loading}
            >
                {loading ? "Loading..." : showPrices ? "Hide Prices" : "Show Price"}
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
        {showModal && (
            <RemoveCoinModal 
                onClose={() => setShowModal(false)} 
                onCoinRemoved={handleCoinRemovedFromModal}
            />
        )}
        </>
    );
}
