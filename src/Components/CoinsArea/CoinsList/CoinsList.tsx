import { useEffect, useState } from "react";
import "./CoinsList.css";
import { CoinsModel } from "../../../Models/CoinsModel";
import { coinsService } from "../../../Services/CoinsService";
import { CoinsCard } from "../CoinsCard/CoinsCard";

export function CoinsList() {


const [coins, setCoins] = useState<CoinsModel[]>([]);

useEffect(() => {
    coinsService.get100CoinsList()
    .then (coins => setCoins(coins))
    .catch (err => console.error(err));
}, []);

    return (
        <div className="CoinsList">

			{coins.length === 0 && <p>Loading...</p>}
            {coins.map(coin => <CoinsCard key={coin.id} coin={coin} />)}

        </div>
    );
}