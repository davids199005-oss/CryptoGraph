import { Box } from '@mui/material';
import { Footer } from "../Footer/Footer";
import { Header } from "../Header/Header";
import { NavBar } from "../NavBar/NavBar";
import { Routing } from "../Routing/Routing";

export function Layout() {
	return (
		<Box
			sx={{
				minHeight: '100vh',
				display: 'flex',
				flexDirection: 'column',
				backgroundColor: 'background.default',
			}}
		>
			<NavBar />
			<Header />
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					width: '100%',
				}}
			>
				<Routing />
			</Box>
			<Footer />
		</Box>
	);
}
