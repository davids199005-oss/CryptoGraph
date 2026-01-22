import { ChangeEvent, useCallback } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppBar, Toolbar, Button, Container, TextField, InputAdornment, Box } from "@mui/material";
import { TrendingUp, Assessment, Recommend, Info, Search } from "@mui/icons-material";
import { AppState } from "../../../Redux/AppState";
import { searchSliceActions } from "../../../Redux/SearchSlice";

/**
 * Navigation Bar Component
 * Displays navigation buttons and global search field
 * - Sticky positioning for persistent visibility
 * - Active route highlighting
 * - Real-time coin search functionality
 */
export function NavBar() {
	const location = useLocation();
	const dispatch = useDispatch();
	const searchQuery = useSelector((state: AppState) => state.searchQuery);

	// Memoize search handler to prevent unnecessary re-renders
	const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		dispatch(searchSliceActions.setSearchQuery(event.target.value));
	}, [dispatch]);

	// Memoize button style calculation
	const navButtonSx = useCallback((isActive: boolean) => ({
		color: '#ffffff',
		fontWeight: 600,
		textTransform: 'none' as const,
		fontSize: '1rem',
		px: 2,
		py: 1,
		borderRadius: 2,
		textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6), 0 0 12px rgba(106, 102, 234, 0.44)',
		'& .MuiButton-startIcon': {
			color: '#ffffff',
			filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.6))',
		},
		backgroundColor: 'rgba(6, 8, 22, 0.95)',
		...(isActive && {
			backgroundColor: 'rgba(102, 126, 234, 0.35)',
			boxShadow: '0 0 15px rgba(102, 126, 234, 1), 0 0 30px rgba(102, 126, 234, 0.9), 0 0 50px rgba(102, 126, 234, 0.7), 0 0 70px rgba(102, 126, 234, 0.5), 0 4px 15px rgba(102, 126, 234, 0.6), inset 0 0 35px rgba(102, 126, 234, 0.4)',
			borderBottom: '3px solid #667eea',
			transform: 'translateY(-1px)',
			textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6), 0 0 25px rgba(102, 126, 234, 1), 0 0 40px rgba(102, 126, 234, 0.8)',
			'& .MuiButton-startIcon': {
				color: '#ffffff',
				filter: 'drop-shadow(0 0 10px rgba(102, 126, 234, 1)) drop-shadow(0 0 20px rgba(102, 126, 234, 0.9)) drop-shadow(0 0 30px rgba(102, 126, 234, 0.7))',
			},
		}),
		'&:hover': {
			backgroundColor: 'rgba(16, 20, 48, 0.98)',
			transform: 'translateY(-2px)',
			textShadow: '2px 2px 6px rgba(0, 0, 0, 0.7), 0 0 20px rgba(102, 126, 234, 0.5)',
		},
		'&:active': {
			transform: 'translateY(0)',
			boxShadow: '0 2px 6px rgba(102, 126, 234, 0.3), inset 0 0 15px rgba(102, 126, 234, 0.2)',
		},
		transition: 'all 0.3s ease',
	}), []);

	return (
		<AppBar
			position="sticky"
			sx={{
				background: 'linear-gradient(180deg, rgba(10, 14, 39, 0.92) 0%, rgba(18, 22, 51, 0.95) 50%, rgba(102, 126, 234, 0.25) 100%)',
				backdropFilter: 'blur(20px)',
				WebkitBackdropFilter: 'blur(20px)',
				boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4), 0 0 40px rgba(102, 126, 234, 0.15)',
				borderBottom: '2px solid rgba(255, 235, 59, 0.2)',
			}}
		>
			<Container maxWidth="xl">
				<Toolbar sx={{ gap: 1.5, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
					{/* Navigation buttons section */}
					<Box sx={{ display: 'flex', gap: 3.5, flexWrap: 'wrap', flex: 1, maxWidth: '70%' }}>
						<Button
							component={NavLink}
							to="/Home"
							color="inherit"
							startIcon={<TrendingUp />}
							sx={navButtonSx(location.pathname === '/Home')}
						>
							Home
						</Button>
						<Button
							component={NavLink}
							to="/Reports"
							color="inherit"
							startIcon={<Assessment />}
							sx={navButtonSx(location.pathname === '/Reports')}
						>
							Reports
						</Button>
						<Button
							component={NavLink}
							to="/Recommendations"
							color="inherit"
							startIcon={<Recommend />}
							sx={navButtonSx(location.pathname === '/Recommendations')}
						>
							Recommendations
						</Button>
						<Button
							component={NavLink}
							to="/About"
							color="inherit"
							startIcon={<Info />}
							sx={navButtonSx(location.pathname === '/About')}
						>
							About
						</Button>
					</Box>

					{/* Search field */}
					<TextField
						value={searchQuery}
						onChange={handleSearchChange}
						placeholder="Search Coin"
						variant="outlined"
						size="small"
						slotProps={{
							input: {
								startAdornment: (
									<InputAdornment position="start">
										<Search sx={{ color: '#e0e7ff' }} />
									</InputAdornment>
								),
							},
							htmlInput: { 'aria-label': 'Search by coin name or ID' },
						}}
						sx={{
							minWidth: { xs: '100%', sm: 200 },
							maxWidth: 240,
							ml: { xs: 0, sm: 'auto' },
							backgroundColor: 'rgba(255, 255, 255, 0.06)',
							borderRadius: 2,
							'& .MuiOutlinedInput-notchedOutline': {
								borderColor: 'rgba(255, 255, 255, 0.2)',
							},
							'&:hover .MuiOutlinedInput-notchedOutline': {
								borderColor: 'rgba(255, 255, 255, 0.35)',
							},
							'& .MuiOutlinedInput-input': {
								color: '#ffffff',
							},
							'& .MuiInputBase-input::placeholder': {
								color: 'rgba(255, 255, 255, 0.8)',
							},
						}}
					/>
				</Toolbar>
			</Container>
		</AppBar>
	);
}
