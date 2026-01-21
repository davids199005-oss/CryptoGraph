import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./CoinsList.css";
import { CoinsModel } from "../../../Models/CoinsModel";
import { coinsService } from "../../../Services/CoinsService";
import { CoinsCard } from "../CoinsCard/CoinsCard";
import { AppState } from "../../../Redux/AppState";
import { coinsSlice } from "../../../Redux/CoinsSlice";

export function CoinsList() {
    const dispatch = useDispatch();
    const coinsFromStore = useSelector((state: AppState) => state.coins);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        // If coins are already in store, don't fetch again
        if (coinsFromStore.length > 0) {
            return;
        }

        setIsLoading(true);
        coinsService.getCoinsList()
            .then((coins: CoinsModel[]) => {
                dispatch(coinsSlice.actions.initCoins(coins));
            })
            .catch((err: Error) => {
                console.error("Error loading coins:", err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [dispatch, coinsFromStore.length]);

    return (
        <div className="CoinsList">
            {isLoading && coinsFromStore.length === 0 && <p>Loading...</p>}
            {coinsFromStore.length === 0 && !isLoading && <p>No coins available</p>}
            {coinsFromStore.map(coin => (
                <CoinsCard key={coin.id} coin={coin} />
            ))}
        </div>
    );
}