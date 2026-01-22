import { useDispatch, useSelector } from "react-redux";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Typography,
    Box,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { AppState } from "../../../Redux/AppState";
import { selectedCoinsSliceActions } from "../../../Redux/CoinsSlice";

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
        <Dialog
            open={true}
            onClose={props.onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    background: 'linear-gradient(145deg, rgba(18, 22, 51, 0.98) 0%, rgba(26, 31, 58, 0.98) 100%)',
                    border: '1px solid rgba(102, 126, 234, 0.3)',
                },
            }}
        >
            <DialogTitle>
                <Typography variant="h5" component="div">
                    Select Coin to Remove
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    You've reached the maximum of 5 coins. Please select a coin to remove:
                </Typography>
            </DialogTitle>
            <DialogContent>
                <List>
                    {selectedCoins.map(coin => (
                        <ListItem
                            key={coin.id}
                            button
                            onClick={() => handleRemoveCoin(coin.id || "")}
                            sx={{
                                borderRadius: 2,
                                mb: 1,
                                border: '1px solid rgba(102, 126, 234, 0.2)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                                    borderColor: 'primary.main',
                                    transform: 'translateX(8px)',
                                },
                            }}
                        >
                            <ListItemAvatar>
                                <Avatar
                                    src={coin.image}
                                    alt={coin.name}
                                    sx={{ width: 48, height: 48 }}
                                />
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Typography variant="h6">
                                        {coin.name}
                                    </Typography>
                                }
                                secondary={
                                    <Typography variant="body2" color="text.secondary">
                                        {coin.symbol?.toUpperCase()}
                                    </Typography>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button
                    onClick={props.onClose}
                    variant="outlined"
                    startIcon={<Close />}
                    fullWidth
                    sx={{
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        '&:hover': {
                            borderColor: 'rgba(255, 255, 255, 0.5)',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        },
                    }}
                >
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
}
