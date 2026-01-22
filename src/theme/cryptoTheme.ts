import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
	interface Palette {
		crypto: {
			primary: string;
			secondary: string;
			accent: string;
			dark: string;
			light: string;
		};
	}

	interface PaletteOptions {
		crypto?: {
			primary?: string;
			secondary?: string;
			accent?: string;
			dark?: string;
			light?: string;
		};
	}
}

export const cryptoTheme = createTheme({
	palette: {
		mode: 'dark',
		primary: {
			main: '#667eea',
			light: '#8b9fff',
			dark: '#4a5fb8',
			contrastText: '#ffffff',
		},
		secondary: {
			main: '#764ba2',
			light: '#9b6bc5',
			dark: '#5a3680',
			contrastText: '#ffffff',
		},
		background: {
			default: '#0a0e27',
			paper: '#121633',
		},
		text: {
			primary: '#ffffff',
			secondary: '#b8bcc8',
		},
		crypto: {
			primary: '#667eea',
			secondary: '#764ba2',
			accent: '#f59e0b',
			dark: '#0a0e27',
			light: '#1a1f3a',
		},
		success: {
			main: '#10b981',
			light: '#34d399',
			dark: '#059669',
		},
		error: {
			main: '#ef4444',
			light: '#f87171',
			dark: '#dc2626',
		},
		warning: {
			main: '#f59e0b',
			light: '#fbbf24',
			dark: '#d97706',
		},
	},
	typography: {
		fontFamily: "'MainFont', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
		h1: {
			fontWeight: 700,
			fontSize: '3rem',
			background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
			WebkitBackgroundClip: 'text',
			WebkitTextFillColor: 'transparent',
			backgroundClip: 'text',
		},
		h2: {
			fontWeight: 600,
			fontSize: '2.5rem',
		},
		h3: {
			fontWeight: 600,
			fontSize: '2rem',
		},
		h4: {
			fontWeight: 600,
			fontSize: '1.5rem',
		},
		body1: {
			fontSize: '1rem',
			lineHeight: 1.6,
		},
		button: {
			textTransform: 'none',
			fontWeight: 600,
		},
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					borderRadius: 16,
					padding: '12px 32px',
					fontWeight: 600,
					textTransform: 'none',
					boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
					background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
					'&:hover': {
						boxShadow: '0 8px 30px rgba(102, 126, 234, 0.6)',
						transform: 'translateY(-3px)',
						background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
					},
					'&:active': {
						transform: 'translateY(-1px)',
					},
					transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
				},
			},
		},
		MuiCard: {
			styleOverrides: {
				root: {
					background: 'linear-gradient(145deg, rgba(18, 22, 51, 0.95) 0%, rgba(26, 31, 58, 0.95) 100%)',
					backdropFilter: 'blur(20px)',
					WebkitBackdropFilter: 'blur(20px)',
					borderRadius: 24,
					border: '1px solid rgba(102, 126, 234, 0.3)',
					boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(102, 126, 234, 0.1)',
					position: 'relative',
					overflow: 'hidden',
					'&::before': {
						content: '""',
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						height: '2px',
						background: 'linear-gradient(90deg, transparent, #667eea, transparent)',
						opacity: 0,
						transition: 'opacity 0.3s ease',
					},
					'&:hover': {
						borderColor: 'rgba(102, 126, 234, 0.6)',
						boxShadow: '0 16px 48px rgba(102, 126, 234, 0.3), 0 0 0 1px rgba(102, 126, 234, 0.2)',
						transform: 'translateY(-8px) scale(1.02)',
						'&::before': {
							opacity: 1,
						},
					},
					transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
				},
			},
		},
		MuiChip: {
			styleOverrides: {
				root: {
					borderRadius: 12,
					fontWeight: 600,
					padding: '4px 12px',
					fontSize: '0.875rem',
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					backgroundImage: 'none',
					backdropFilter: 'blur(10px)',
					WebkitBackdropFilter: 'blur(10px)',
				},
			},
		},
		MuiAppBar: {
			styleOverrides: {
				root: {
					backdropFilter: 'blur(20px)',
					WebkitBackdropFilter: 'blur(20px)',
					backgroundColor: 'rgba(10, 14, 39, 0.8)',
				},
			},
		},
	},
	shape: {
		borderRadius: 12,
	},
});
