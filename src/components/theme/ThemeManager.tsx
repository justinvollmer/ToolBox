import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ThemeContext } from "./ThemeContext";

interface Props {
  children: React.ReactNode;
}

function ThemeManager({ children }: Props) {
  const [mode, setMode] = React.useState<"light" | "dark">("light");

  const theme = createTheme({
    palette: {
      mode: mode,
      text: {
        primary: mode === "dark" ? "#ffffff" : "#000000",
      },
      background: {
        default: mode === "dark" ? "#0f0f0f" : "#fff",
        paper: mode === "dark" ? "#272727" : "#fff",
      },
    },
  });

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const themeStyles = {
    "--text-primary": theme.palette.text.primary,
    "--text-secondary": theme.palette.text.secondary,
    "--background-default": theme.palette.background.default,
    "--background-paper": theme.palette.background.paper,
    "--link-color": theme.palette.mode === "dark" ? "#2b89c1" : "blue",
  } as React.CSSProperties & {
    [key: string]: string;
  };

  return (
    <ThemeContext.Provider value={{ toggleTheme }}>
      <ThemeProvider theme={theme}>
        <div style={themeStyles}>{children}</div>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default ThemeManager;
