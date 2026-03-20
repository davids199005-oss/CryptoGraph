import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  Typography,
  Button,
  Box,
  Switch,
  Chip,
  CircularProgress,
  Stack,
  useTheme,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { CoinsModel } from "../../../Models/coinsModel";
import { coinsService } from "../../../Services/CoinsService";
import { AppState } from "../../../Redux/AppState";
import { selectedCoinsSliceActions } from "../../../Redux/CoinsSlice";
import { RemoveCoinModal } from "../RemoveCoinModal/RemoveCoinModal";
import { PriceFormatter } from "../../../Utils/PriceFormatter";

/** Price data in USD, EUR, and ILS for the card's "Show prices" section. */
type Prices = {
  usd: number;
  eur: number;
  ils: number;
};

type CoinsCardProps = {
  coin: CoinsModel;
};

/**
 * Single cryptocurrency card: image, name, symbol, 24h change, optional multi-currency
 * prices (USD/EUR/ILS on demand), selection switch (max 5 coins), and link to coin details.
 */
export function CoinsCard(props: CoinsCardProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedCoinIds = useSelector((state: AppState) => state.selectedCoins);

  // Component state
  const [showPrices, setShowPrices] = useState(false);
  const [prices, setPrices] = useState<Prices | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Check if this coin is currently selected (memoized for performance)
  const isSelected = useMemo(
    () => (props.coin.id ? selectedCoinIds.includes(props.coin.id) : false),
    [props.coin.id, selectedCoinIds],
  );

  // Calculate price change indicator
  const priceChange24h = props.coin.price_change_percentage_24h || 0;
  const isPositive = priceChange24h >= 0;

  /**
   * Navigate to coin details page
   */
  const handleViewDetails = useCallback(() => {
    if (!props.coin.id) {
      console.error("Coin ID is missing");
      return;
    }
    const coinId = props.coin.id.trim();
    if (!coinId) {
      console.error("Coin ID is empty after trim");
      return;
    }
    navigate(`/coins/${coinId}`);
  }, [props.coin.id, navigate]);

  /**
   * Toggle price visibility and fetch prices if needed
   */
  const handleShowPrices = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const coinId = props.coin.id?.trim();
      if (!coinId) {
        console.warn("Cannot load prices: coin id is missing");
        return;
      }

      if (showPrices) {
        setShowPrices(false);
        setPrices(null);
        return;
      }

      try {
        setLoading(true);
        const coinPrices = await coinsService.getCoinPrices(coinId);

        if (coinPrices) {
          setPrices(coinPrices);
          setShowPrices(true);
        }
      } catch (error) {
        console.error("Error loading prices:", error);
      } finally {
        setLoading(false);
      }
    },
    [props.coin.id, showPrices],
  );

  /**
   * Handle coin selection with limit enforcement
   * Shows modal if user tries to select more than 5 coins
   */
  const handleToggleSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.stopPropagation();

      if (!props.coin.id) return;

      if (isSelected) {
        dispatch(selectedCoinsSliceActions.toggleCoin(props.coin.id));
      } else {
        // Enforce 5-coin maximum
        if (selectedCoinIds.length >= 5) {
          setShowModal(true);
        } else {
          dispatch(selectedCoinsSliceActions.toggleCoin(props.coin.id));
        }
      }
    },
    [props.coin.id, isSelected, selectedCoinIds.length, dispatch],
  );

  /**
   * Handle coin removal triggered from RemoveCoinModal
   */
  const handleCoinRemovedFromModal = useCallback(() => {
    if (props.coin.id) {
      dispatch(selectedCoinsSliceActions.toggleCoin(props.coin.id));
    }
  }, [props.coin.id, dispatch]);

  return (
    <>
      <Card
        sx={{
          cursor: "pointer",
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          border: isSelected ? "2px solid" : "1px solid",
          borderColor: isSelected
            ? "primary.main"
            : theme.custom.glassBorder,
          background: isSelected
            ? theme.custom.selectedCardGradient
            : theme.custom.cardGradient,
          boxShadow: isSelected
            ? theme.custom.selectedCardGlow
            : undefined,
          "&:focus-visible": {
            outline: "2px solid",
            outlineColor: "primary.main",
            outlineOffset: 2,
          },
        }}
        onClick={handleViewDetails}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleViewDetails();
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={`Open details for ${props.coin.name}`}
      >
        {/* Selection Toggle */}
        <Box
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 10,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Switch
            checked={isSelected}
            onChange={handleToggleSelect}
            inputProps={{
              "aria-label": `Select ${props.coin.name}`,
            }}
            sx={{
              width: 52,
              height: 28,
              padding: 0,
              "& .MuiSwitch-switchBase": {
                padding: 0,
                margin: "2px",
                transitionDuration: "300ms",
                "&.Mui-checked": {
                  transform: "translateX(24px)",
                  "& + .MuiSwitch-track": {
                    opacity: 1,
                    border: 0,
                  },
                },
              },
              "&:hover": {
                "& .MuiSwitch-thumb": {
                  transform: "scale(1.15)",
                },
              },
              "& .MuiSwitch-thumb": {
                boxSizing: "border-box",
                width: 24,
                height: 24,
                transition: "all 0.3s ease",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.4)",
              },
              "& .MuiSwitch-track": {
                borderRadius: 28 / 2,
                opacity: 1,
                transition: "all 0.3s ease",
              },
            }}
          />
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
            p: 2,
          }}
        >
          {/* Fixed-height top section so button aligns across all cards */}
          <Box
            sx={{
              minHeight: 200,
              display: "flex",
              flexDirection: "column",
              flex: "0 0 auto",
            }}
          >
            {/* Coin Image */}
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <Box
                component="img"
                src={props.coin.image}
                alt={props.coin.name}
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  boxShadow: "0 0 20px rgba(0, 245, 255, 0.3)",
                  border: "2px solid",
                  borderColor: "primary.main",
                }}
              />
            </Box>

            {/* Coin Name & Symbol */}
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
              {props.coin.name}
            </Typography>
            <Chip
              label={props.coin.symbol?.toUpperCase()}
              size="small"
              sx={{
                backgroundColor: "rgba(0, 245, 255, 0.12)",
                color: "primary.main",
                fontWeight: 600,
                mb: 2,
                border: `1px solid ${theme.custom.glassBorderStrong}`,
              }}
            />

            {/* Price Change 24h - always render same-height block for consistent layout */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.5,
                mb: 2,
                minHeight: 28,
              }}
            >
              {props.coin.price_change_percentage_24h !== undefined ? (
                <>
                  {isPositive ? (
                    <TrendingUp sx={{ color: "success.main", fontSize: 20 }} />
                  ) : (
                    <TrendingDown sx={{ color: "error.main", fontSize: 20 }} />
                  )}
                  <Typography
                    variant="body2"
                    sx={{
                      color: isPositive ? "success.main" : "error.main",
                      fontWeight: 600,
                    }}
                  >
                    {isPositive ? "+" : ""}
                    {priceChange24h.toFixed(2)}%
                  </Typography>
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  —
                </Typography>
              )}
            </Box>

            {/* Show/Hide Prices Button - always at same position */}
            <Button
              variant="outlined"
              fullWidth
              onClick={handleShowPrices}
              disabled={loading}
              startIcon={
                loading ? (
                  <CircularProgress size={16} />
                ) : showPrices ? (
                  <VisibilityOff />
                ) : (
                  <Visibility />
                )
              }
              sx={{
                mb: showPrices ? 2 : 0,
                minWidth: 144,
                borderColor: "primary.main",
                color: "primary.main",
                "& .MuiButton-startIcon svg": {
                  color: "primary.main",
                },
                "&:hover": {
                  borderColor: "primary.light",
                  backgroundColor: "rgba(0, 245, 255, 0.08)",
                  boxShadow: `0 0 20px ${theme.custom.glowCyan}`,
                },
              }}
            >
              {loading
                ? "Loading..."
                : showPrices
                  ? "Hide Prices"
                  : "Show Prices"}
            </Button>
          </Box>

          {/* Price Info Section */}
          {showPrices && prices && (
            <Stack spacing={1.5} sx={{ mt: 2 }}>
              <PriceDisplayBox currency="USD" symbol="$" price={prices.usd} />
              <PriceDisplayBox currency="EUR" symbol="€" price={prices.eur} />
              <PriceDisplayBox currency="ILS" symbol="₪" price={prices.ils} />
            </Stack>
          )}
        </Box>
      </Card>

      {/* Modal for coin removal when selection limit reached */}
      {showModal && (
        <RemoveCoinModal
          onClose={() => setShowModal(false)}
          onCoinRemoved={handleCoinRemovedFromModal}
        />
      )}
    </>
  );
}

/** Inline box that shows a single currency label and formatted price. */
function PriceDisplayBox({
  currency,
  symbol,
  price,
}: {
  currency: string;
  symbol: string;
  price: number;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: 1.5,
        borderRadius: 1,
        background: "rgba(0, 245, 255, 0.06)",
        border: "1px solid rgba(0, 245, 255, 0.25)",
      }}
    >
      <Typography variant="body2" color="text.secondary" fontWeight={600}>
        {currency}
      </Typography>
      <Typography variant="body1" fontWeight={700} sx={{ color: "primary.main" }}>
        {symbol}
        {PriceFormatter.formatPrice(price)}
      </Typography>
    </Box>
  );
}
