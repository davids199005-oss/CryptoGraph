import { NavLink, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Button, Box, Container } from "@mui/material";
import { TrendingUp, Assessment, Recommend, Info } from "@mui/icons-material";

export function NavBar() {
	const location = useLocation();

	const navButtonSx = (isActive: boolean) => ({
		color: '#ffeb3b',
		fontWeight: 600,
		textTransform: 'none' as const,
		fontSize: '1rem',
		px: 2,
		py: 1,
		borderRadius: 2,
		WebkitTextStroke: '1px #000',
		textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6), 0 0 12px rgba(102, 126, 234, 0.4)',
		'& .MuiButton-startIcon': {
			color: '#ffeb3b',
			filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.6))',
		},
		...(isActive && {
			backgroundColor: 'rgba(255, 255, 255, 0.15)',
			boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(102, 126, 234, 0.2)',
		}),
		'&:hover': {
			backgroundColor: 'rgba(255, 255, 255, 0.12)',
			transform: 'translateY(-2px)',
			textShadow: '2px 2px 6px rgba(0, 0, 0, 0.7), 0 0 20px rgba(102, 126, 234, 0.5)',
		},
		transition: 'all 0.3s ease',
	});

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
				<Toolbar sx={{ justifyContent: 'center', gap: 1 }}>
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
				</Toolbar>
			</Container>
		</AppBar>
	);
}
