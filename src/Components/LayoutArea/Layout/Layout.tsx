import { Box } from "@mui/material";
import { Footer } from "../Footer/Footer";
import { Header } from "../Header/Header";
import { NavBar } from "../NavBar/NavBar";
import { Routing } from "../../../Routes/Routing";

/**
 * Root layout: sticky nav bar, hero header, main content area (routing outlet), and footer.
 */
export function Layout() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.default",
      }}
    >
      <NavBar />
      <Header />
      <Box
        component="main"
        sx={(theme) => ({
          flexGrow: 1,
          width: "100%",
          minHeight: "100%",
          background:
            theme.custom?.pageBackground ?? theme.palette.background.default,
        })}
      >
        <Routing />
      </Box>
      <Footer />
    </Box>
  );
}
