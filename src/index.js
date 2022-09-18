import * as React from "react";
import { createRoot } from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import App from "./App";
import theme from "./theme";
import reportWebVitals from "./reportWebVitals";
import { GlobalStyles } from "@mui/material";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

const styles = `
  html, body {
    margin: 0;
    width: 100%;
    height: 100%;
  }
`

root.render(
  <ThemeProvider theme={theme}>
    <GlobalStyles styles={styles}/>
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
    <CssBaseline />
    <App />
  </ThemeProvider>
);

reportWebVitals();
