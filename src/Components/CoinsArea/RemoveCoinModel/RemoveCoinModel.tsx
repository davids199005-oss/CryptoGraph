import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../../Redux/AppState";
import { selectedCoinsSliceActions } from "../../../Redux/CoinsSlice";
import "./RemoveCoinModel.css";

type RemoveCoinModelProps = {
    onClose: () => void;
    onCoinRemoved?: () => void;
};

export function RemoveCoinModel(props: RemoveCoinModelProps) {
    const dispatch = useDispatch();
    const selectedCoinIds = useSelector((state: AppState) => state.selectedCoins);
    const allCoins = useSelector((state: AppState) => state.coins);

    const selectedCoins = allCoins.filter(coin =>
        coin.id && selectedCoinIds.includes(coin.id)
    );

    const handleRemoveCoin = (coinId: string) => {
        dispatch(selectedCoinsSliceActions.removeCoin(coinId));
        props.onClose();
        if (props.onCoinRemoved) {
            props.onCoinRemoved();
        }
    };

    return (
        <div className="RemoveCoinModel-overlay" onClick={props.onClose}>
            <div className="RemoveCoinModel-content" onClick={(e) => e.stopPropagation()}>
                <h2>Выберите монету для удаления</h2>
                <p className="RemoveCoinModel-description">
                    Вы достигли максимума в 5 монет. Пожалуйста, выберите монету для удаления:
                </p>
                <div className="RemoveCoinModel-coins-list">
                    {selectedCoins.map(coin => (
                        <div
                            key={coin.id}
                            className="RemoveCoinModel-coin-item"
                            onClick={() => handleRemoveCoin(coin.id || "")}
                        >
                            <img src={coin.image} alt={coin.name} />
                            <div className="RemoveCoinModel-coin-info">
                                <h3>{coin.name}</h3>
                                <p>{coin.symbol}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <button
                    className="RemoveCoinModel-cancel"
                    onClick={props.onClose}
                >
                    Отмена
                </button>
            </div>
        </div>
    );
}
