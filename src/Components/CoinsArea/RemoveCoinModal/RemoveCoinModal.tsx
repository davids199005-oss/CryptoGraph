import { CoinsModel } from "../../../Models/CoinsModel";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../../Redux/AppState";
import { selectedCoinsSliceActions } from "../../../Redux/CoinsSlice";
import "./RemoveCoinModal.css";

type RemoveCoinModalProps = {
    onClose: () => void;
    onCoinRemoved?: () => void;
};

export function RemoveCoinModal(props: RemoveCoinModalProps) {
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
        <div className="RemoveCoinModal-overlay" onClick={props.onClose}>
            <div className="RemoveCoinModal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Выберите монету для удаления</h2>
                <p className="RemoveCoinModal-description">
                    Вы достигли максимума в 5 монет. Пожалуйста, выберите монету для удаления:
                </p>
                <div className="RemoveCoinModal-coins-list">
                    {selectedCoins.map(coin => (
                        <div 
                            key={coin.id} 
                            className="RemoveCoinModal-coin-item"
                            onClick={() => handleRemoveCoin(coin.id || "")}
                        >
                            <img src={coin.image} alt={coin.name} />
                            <div className="RemoveCoinModal-coin-info">
                                <h3>{coin.name}</h3>
                                <p>{coin.symbol}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <button 
                    className="RemoveCoinModal-cancel" 
                    onClick={props.onClose}
                >
                    Отмена
                </button>
            </div>
        </div>
    );
}
