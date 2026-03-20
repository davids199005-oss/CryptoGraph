import { ChangeEvent, useCallback } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  AppBar,
  Toolbar,
  Button,
  Container,
  TextField,
  InputAdornment,
  Box,
  useTheme,
} from "@mui/material";
import {
  TrendingUp,
  Assessment,
  Recommend,
  Info,
  Search,
} from "@mui/icons-material";
import { AppState } from "../../../Redux/AppState";
import { searchSliceActions } from "../../../Redux/SearchSlice";

/**
 * Sticky navigation bar with links (Home, Reports, Recommendations, About), active-route
 * highlighting, and a global coin search field that filters the list on the Home page.
 */
export function NavBar() {
  const theme = useTheme();
  const location = useLocation();
  const dispatch = useDispatch();
  const searchQuery = useSelector((state: AppState) => state.searchQuery);

  // Memoize search handler to prevent unnecessary re-renders
  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      dispatch(searchSliceActions.setSearchQuery(event.target.value));
    },
    [dispatch],
  );

  const navButtonSx = useCallback(
    (isActive: boolean) => ({
      color: isActive ? "primary.main" : "text.primary",
      fontWeight: 600,
      textTransform: "uppercase" as const,
      fontSize: "0.9rem",
      letterSpacing: "0.1em",
      px: { xs: 1.5, md: 2 },
      py: 1,
      borderRadius: 1,
      opacity: isActive ? 1 : 0.88,
      "& .MuiButton-startIcon": {
        color: "inherit",
      },
      backgroundColor: "transparent",
      borderBottom: "2px solid transparent",
      ...(isActive && {
        borderBottomColor: "primary.main",
        boxShadow: `0 0 20px ${theme.custom.glowCyan}`,
        textShadow: `0 0 15px ${theme.custom.glowCyan}`,
      }),
      "&:hover": {
        color: "primary.main",
        backgroundColor: "rgba(0, 245, 255, 0.06)",
        textShadow: `0 0 12px ${theme.custom.glowCyan}`,
      },
      "&:active": {
        transform: "scale(0.98)",
      },
      "&.Mui-focusVisible": {
        outline: "2px solid",
        outlineColor: "primary.main",
        outlineOffset: 2,
      },
      transition: "all 0.25s ease",
    }),
    [theme.custom.glowCyan],
  );

  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar
          sx={{
            gap: 1.5,
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Navigation buttons section */}
          <Box
            sx={{
              display: "flex",
              gap: { xs: 1.5, md: 2.5 },
              flexWrap: "wrap",
              flex: 1,
              maxWidth: { xs: "100%", md: "70%" },
            }}
          >
            <Button
              component={NavLink}
              to="/Home"
              color="inherit"
              startIcon={<TrendingUp />}
              sx={navButtonSx(location.pathname === "/Home")}
            >
              Home
            </Button>
            <Button
              component={NavLink}
              to="/Reports"
              color="inherit"
              startIcon={<Assessment />}
              sx={navButtonSx(location.pathname === "/Reports")}
            >
              Reports
            </Button>
            <Button
              component={NavLink}
              to="/Recommendations"
              color="inherit"
              startIcon={<Recommend />}
              sx={navButtonSx(location.pathname === "/Recommendations")}
            >
              Recommendations
            </Button>
            <Button
              component={NavLink}
              to="/About"
              color="inherit"
              startIcon={<Info />}
              sx={navButtonSx(location.pathname === "/About")}
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
                    <Search sx={{ color: "rgba(0, 245, 255, 0.8)" }} />
                  </InputAdornment>
                ),
              },
              htmlInput: { "aria-label": "Search by coin name or ID" },
            }}
            sx={{
              minWidth: { xs: "100%", sm: 200 },
              maxWidth: 240,
              ml: { xs: 0, sm: "auto" },
              backgroundColor: "rgba(0, 245, 255, 0.04)",
              borderRadius: 1,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.custom.glassBorder,
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.custom.glassBorderStrong,
                boxShadow: `0 0 15px ${theme.custom.glowCyan}`,
              },
              "& .MuiOutlinedInput-input": {
                color: "text.primary",
              },
              "& .MuiInputBase-input::placeholder": {
                color: "text.secondary",
                opacity: 0.8,
              },
            }}
          />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
