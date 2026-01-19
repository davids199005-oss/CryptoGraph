import { useEffect, useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";
import { CoinsModel } from "../../../Models/CoinsModel";
import { OhlcCandle, coinsService } from "../../../Services/CoinsService";
import "./CoinChart.css";

const REFRESH_INTERVAL_MS = 300_000; // 5 minutes

const palette = [
    "#0d9488",
    "#f59e0b",
    "#3b82f6",
    "#ef4444",
    "#8b5cf6",
    "#f97316",
];

type CoinChartProps = {
    selectedCoins: CoinsModel[];
};

type SeriesData = Record<string, OhlcCandle[]>;

type LoadState = "idle" | "loading" | "ready" | "error";

export function CoinChart({ selectedCoins }: CoinChartProps) {
    const [seriesData, setSeriesData] = useState<SeriesData>({});
    const [state, setState] = useState<LoadState>("idle");
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const coinIds = useMemo(
        () => selectedCoins.map((coin) => coin.id || "").filter(Boolean),
        [selectedCoins]
    );

    const idToLabel = useMemo(
        () =>
            Object.fromEntries(
                selectedCoins
                    .filter((coin) => coin.id)
                    .map((coin) => [
                        coin.id as string,
                        (coin.symbol || coin.name || coin.id || "").toUpperCase(),
                    ])
            ),
        [selectedCoins]
    );

    useEffect(() => {
        if (coinIds.length === 0) {
            setSeriesData({});
            setState("idle");
            setError(null);
            return;
        }

        let isCancelled = false;

        async function loadOhlc() {
            setState((prev) => (prev === "ready" ? "ready" : "loading"));
            setError(null);

            try {
                const entries = await Promise.all(
                    coinIds.map(async (coinId) => {
                        const candles = await coinsService.getCoinOhlc(coinId, 1);
                        return [coinId, candles] as const;
                    })
                );

                if (!isCancelled) {
                    setSeriesData(Object.fromEntries(entries));
                    setState("ready");
                    setLastUpdated(new Date());
                }
            } catch (err) {
                if (!isCancelled) {
                    setState("error");
                    setError("Unable to load chart data right now.");
                    console.error(err);
                }
            }
        }

        loadOhlc();
        const intervalId = window.setInterval(loadOhlc, REFRESH_INTERVAL_MS);

        return () => {
            isCancelled = true;
            window.clearInterval(intervalId);
        };
    }, [coinIds.join(",")]);

    const xAxisTimestamps = useMemo(() => {
        if (coinIds.length === 0) return [] as number[];
        const firstCoin = coinIds[0];
        return (seriesData[firstCoin] || []).map((item) => item.time);
    }, [coinIds, seriesData]);

    const chartSeries = useMemo(() => {
        return coinIds.map((coinId, idx) => {
            const candles = seriesData[coinId] || [];
            return {
                name: idToLabel[coinId] || coinId,
                type: "candlestick" as const,
                data: candles.map((candle) => [
                    candle.open,
                    candle.close,
                    candle.low,
                    candle.high,
                ]),
                itemStyle: {
                    color: palette[idx % palette.length],
                    color0: "#0f172a",
                    borderColor: palette[idx % palette.length],
                    borderColor0: "#1e293b",
                },
                emphasis: {
                    itemStyle: {
                        color: palette[idx % palette.length],
                        color0: "#0f172a",
                        borderColor: palette[idx % palette.length],
                        borderColor0: "#1e293b",
                    },
                },
            };
        });
    }, [coinIds, idToLabel, seriesData]);

    const chartOptions = useMemo(() => {
        const formattedXAxis = xAxisTimestamps.map((ts) => {
            const date = new Date(ts);
            return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            })}`;
        });

        return {
            backgroundColor: "transparent",
            animation: true,
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "cross",
                },
                valueFormatter: (value: number) => `$${value.toFixed(4)}`,
            },
            legend: {
                top: 0,
                textStyle: {
                    color: "#0f172a",
                },
            },
            grid: {
                top: 50,
                left: 30,
                right: 20,
                bottom: 60,
            },
            xAxis: {
                type: "category",
                data: formattedXAxis,
                boundaryGap: true,
                axisLine: { lineStyle: { color: "#cbd5e1" } },
                axisLabel: { color: "#475569" },
            },
            yAxis: {
                scale: true,
                axisLine: { lineStyle: { color: "#cbd5e1" } },
                axisLabel: {
                    color: "#475569",
                    formatter: (value: number) => `$${value.toFixed(2)}`,
                },
                splitLine: { lineStyle: { color: "#e2e8f0" } },
            },
            dataZoom: [
                {
                    type: "inside",
                    start: 30,
                    end: 100,
                },
                {
                    start: 30,
                    end: 100,
                    height: 20,
                    bottom: 15,
                    handleStyle: { color: "#0d9488" },
                    textStyle: { color: "#475569" },
                    borderColor: "#cbd5e1",
                },
            ],
            series: chartSeries,
        };
    }, [chartSeries, xAxisTimestamps]);

    if (coinIds.length === 0) {
        return (
            <div className="CoinChart empty">
                <p>Select coins to see their intraday candlesticks.</p>
            </div>
        );
    }

    return (
        <div className="CoinChart">
            <div className="CoinChart-heading">
                <div>
                    <p className="eyebrow">Intraday candlesticks · USD</p>
                    <h3>24h view for selected coins</h3>
                </div>
                <div className="CoinChart-meta">
                    {state === "loading" && <span className="pill">Refreshing…</span>}
                    {state === "ready" && lastUpdated && (
                        <span className="pill neutral">
                            Updated {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                    )}
                    {state === "error" && <span className="pill danger">Failed to refresh</span>}
                </div>
            </div>

            {error && <p className="CoinChart-error">{error}</p>}

            <ReactECharts
                option={chartOptions}
                style={{ width: "100%", height: "480px" }}
                notMerge
                lazyUpdate
            />
        </div>
    );
}
