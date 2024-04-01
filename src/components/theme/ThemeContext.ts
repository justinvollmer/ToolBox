import * as React from "react";

interface ThemeContextType {
  toggleTheme: () => void;
}

export const ThemeContext = React.createContext<ThemeContextType>({
  toggleTheme: () => {},
});

export const useTheme = () => React.useContext(ThemeContext);
