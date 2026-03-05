import { createTheme } from '@mui/material/styles';

/**
 * MUI theme for CryptoGraph: dark base, neon cyan/magenta accents, and custom
 * palette extensions (crypto.*, custom.pageBackground, glows). Used for buttons,
 * cards, inputs, app bar, and typography (Orbitron + Rajdhani).
 */
/* Futuristic: deep space background with subtle grid feel */
const pageBackgroundGradient =
	'linear-gradient(180deg, #050810 0%, #0a0e1a 30%, #080c18 70%, #050810 100%)';

/* Neon accent colors */
const neonCyan = '#00f5ff';
const neonCyanDim = '#00b8c4';
const neonMagenta = '#ff00aa';
const neonMagentaDim = '#c40085';
const neonGreen = '#00ff88';
const neonRed = '#ff3366';
const glassDark = 'rgba(5, 8, 16, 0.85)';
const glassBorder = 'rgba(0, 245, 255, 0.2)';
const glowCyan = 'rgba(0, 245, 255, 0.4)';
const glowMagenta = 'rgba(255, 0, 170, 0.3)';

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

	interface Theme {
		custom: {
			pageBackground: string;
			neonCyan: string;
			neonMagenta: string;
			glowCyan: string;
			glowMagenta: string;
		};
	}

	interface ThemeOptions {
		custom?: {
			pageBackground?: string;
			neonCyan?: string;
			neonMagenta?: string;
			glowCyan?: string;
			glowMagenta?: string;
		};
	}
}

export const cryptoTheme = createTheme({
	custom: {
		pageBackground: pageBackgroundGradient,
		neonCyan,
		neonMagenta,
		glowCyan,
		glowMagenta,
	},
	palette: {
		mode: 'dark',
		primary: {
			main: neonCyan,
			light: '#66fff5',
			dark: neonCyanDim,
			contrastText: '#050810',
		},
		secondary: {
			main: neonMagenta,
			light: '#ff66cc',
			dark: neonMagentaDim,
			contrastText: '#ffffff',
		},
		background: {
			default: '#050810',
			paper: '#0a0e1a',
		},
		text: {
			primary: '#e0f7ff',
			secondary: '#8ba3b5',
		},
		crypto: {
			primary: neonCyan,
			secondary: neonMagenta,
			accent: neonCyan,
			dark: '#050810',
			light: '#0d1220',
		},
		success: {
			main: neonGreen,
			light: '#66ffaa',
			dark: '#00cc6a',
		},
		error: {
			main: neonRed,
			light: '#ff6699',
			dark: '#cc2952',
		},
		warning: {
			main: '#ffaa00',
			light: '#ffcc44',
			dark: '#cc8800',
		},
	},
	typography: {
		fontFamily: "'Rajdhani', 'MainFont', -apple-system, BlinkMacSystemFont, sans-serif",
		h1: {
			fontFamily: "'Orbitron', 'MainFont', sans-serif",
			fontWeight: 700,
			fontSize: '3rem',
			letterSpacing: '0.08em',
			background: `linear-gradient(135deg, ${neonCyan} 0%, ${neonMagenta} 100%)`,
			WebkitBackgroundClip: 'text',
			WebkitTextFillColor: 'transparent',
			backgroundClip: 'text',
		},
		h2: {
			fontFamily: "'Orbitron', 'MainFont', sans-serif",
			fontWeight: 600,
			fontSize: '2.5rem',
			letterSpacing: '0.05em',
			color: '#e0f7ff',
		},
		h3: {
			fontFamily: "'Orbitron', 'MainFont', sans-serif",
			fontWeight: 600,
			fontSize: '2rem',
			letterSpacing: '0.04em',
		},
		h4: {
			fontFamily: "'Orbitron', 'MainFont', sans-serif",
			fontWeight: 600,
			fontSize: '1.5rem',
			letterSpacing: '0.03em',
		},
		body1: {
			fontSize: '1rem',
			lineHeight: 1.6,
			color: '#c8d4e0',
		},
		button: {
			textTransform: 'none',
			fontWeight: 600,
			letterSpacing: '0.04em',
		},
	},
	shape: {
		borderRadius: 8,
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					borderRadius: 8,
					padding: '12px 28px',
					fontWeight: 600,
					textTransform: 'none',
					letterSpacing: '0.06em',
					border: '1px solid',
					borderColor: neonCyan,
					background: 'transparent',
					color: neonCyan,
					boxShadow: `0 0 20px ${glowCyan}, inset 0 0 20px rgba(0, 245, 255, 0.05)`,
					'&:hover': {
						backgroundColor: 'rgba(0, 245, 255, 0.08)',
						boxShadow: `0 0 30px ${glowCyan}, 0 0 60px rgba(0, 245, 255, 0.2), inset 0 0 30px rgba(0, 245, 255, 0.08)`,
						borderColor: '#66fff5',
					},
					'&:active': {
						transform: 'scale(0.98)',
					},
					'&.Mui-focusVisible': {
						outline: '2px solid',
						outlineColor: neonCyan,
						outlineOffset: 2,
						boxShadow: `0 0 0 4px ${glowCyan}`,
					},
					transition: 'all 0.3s ease',
					'&.MuiButton-contained': {
						background: `linear-gradient(135deg, ${neonCyan} 0%, ${neonCyanDim} 100%)`,
						color: '#050810',
						border: 'none',
						boxShadow: `0 0 25px ${glowCyan}`,
						'&:hover': {
							background: `linear-gradient(135deg, #66fff5 0%, ${neonCyan} 100%)`,
							boxShadow: `0 0 35px ${glowCyan}, 0 0 50px rgba(0, 245, 255, 0.3)`,
						},
					},
				},
			},
		},
		MuiCard: {
			styleOverrides: {
				root: {
					background: 'linear-gradient(145deg, rgba(10, 14, 26, 0.9) 0%, rgba(5, 8, 16, 0.95) 100%)',
					backdropFilter: 'blur(20px)',
					WebkitBackdropFilter: 'blur(20px)',
					borderRadius: 12,
					border: '1px solid',
					borderColor: glassBorder,
					boxShadow: `0 0 0 1px rgba(0, 245, 255, 0.06), 0 8px 32px rgba(0, 0, 0, 0.5)`,
					position: 'relative',
					overflow: 'hidden',
					'&::before': {
						content: '""',
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						height: '1px',
						background: `linear-gradient(90deg, transparent, ${neonCyan}, transparent)`,
						opacity: 0.6,
					},
					'&:hover': {
						borderColor: 'rgba(0, 245, 255, 0.5)',
						boxShadow: `0 0 30px ${glowCyan}, 0 0 0 1px rgba(0, 245, 255, 0.2)`,
						transform: 'translateY(-4px)',
						'&::before': {
							opacity: 1,
							boxShadow: `0 0 15px ${neonCyan}`,
						},
					},
					transition: 'all 0.35s ease',
				},
			},
		},
		MuiChip: {
			styleOverrides: {
				root: {
					borderRadius: 6,
					fontWeight: 600,
					letterSpacing: '0.04em',
					border: '1px solid rgba(0, 245, 255, 0.3)',
					background: 'rgba(0, 245, 255, 0.08)',
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					backgroundImage: 'none',
					backgroundColor: glassDark,
					backdropFilter: 'blur(16px)',
					WebkitBackdropFilter: 'blur(16px)',
					border: '1px solid',
					borderColor: glassBorder,
				},
			},
		},
		MuiOutlinedInput: {
			styleOverrides: {
				root: {
					borderRadius: 8,
					'& .MuiOutlinedInput-notchedOutline': {
						borderColor: 'rgba(0, 245, 255, 0.25)',
					},
					'&:hover .MuiOutlinedInput-notchedOutline': {
						borderColor: 'rgba(0, 245, 255, 0.5)',
						boxShadow: `0 0 15px ${glowCyan}`,
					},
					'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
						borderColor: neonCyan,
						borderWidth: 2,
						boxShadow: `0 0 20px ${glowCyan}`,
					},
					'&.Mui-focusVisible .MuiOutlinedInput-notchedOutline': {
						borderColor: neonCyan,
						boxShadow: `0 0 0 2px ${glowCyan}`,
					},
				},
			},
		},
		MuiAppBar: {
			styleOverrides: {
				root: {
					background: 'rgba(5, 8, 16, 0.88)',
					backdropFilter: 'blur(24px)',
					WebkitBackdropFilter: 'blur(24px)',
					borderBottom: '1px solid',
					borderBottomColor: glassBorder,
					boxShadow: `0 0 40px rgba(0, 245, 255, 0.08)`,
				},
			},
		},
		MuiSwitch: {
			styleOverrides: {
				switchBase: {
					'&.Mui-checked': {
						'& + .MuiSwitch-track': {
							backgroundColor: neonCyan,
							opacity: 1,
							boxShadow: `0 0 15px ${glowCyan}`,
						},
						'& .MuiSwitch-thumb': {
							backgroundColor: '#050810',
							boxShadow: `0 0 10px ${neonCyan}`,
						},
					},
				},
				track: {
					backgroundColor: 'rgba(0, 245, 255, 0.2)',
					border: '1px solid rgba(0, 245, 255, 0.3)',
				},
				thumb: {
					backgroundColor: '#e0f7ff',
				},
			},
		},
	},
});
