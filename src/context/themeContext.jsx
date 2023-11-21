import React, { useContext, useState, useEffect, useCallback } from "react";
import { saveTheme, getTheme } from "../utils/helper";

const context = React.createContext({
  setShowThemeOptions: (prev) => {},
  showThemeOptions: false,
  openMenu: () => {},
  closeMenu: () => {},

  setTheme: (newTheme) => {},
  checkSystemTheme: () => {},
  theme: "",
});
//
const initialTheme = getTheme();

const ThemeProvider = ({ children }) => {
  const [showThemeOptions, setShowThemeOptions] = useState(false);
  const [theme, setTheme] = useState(initialTheme);

  const checkSystemTheme = () => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("Dark");
    } else {
      setTheme("Light");
    }
  };

  // check theme stored in local storage;
  const checkTheme = useCallback(() => {
    if (initialTheme) return;
    checkSystemTheme();
  }, []);

  useEffect(() => {
    checkTheme();
  }, [checkTheme]);

  useEffect(() => {
    if (theme === "Dark") {
      document.documentElement.classList.add("dark");
      saveTheme("Dark");
    } else if (theme === "Light") {
      document.documentElement.classList.remove("dark");
      saveTheme("Light");
    }
  }, [theme]);

  const openMenu = () => {
    setShowThemeOptions(true);
  };

  const closeMenu = useCallback(() => {
    setShowThemeOptions(false);
  }, []);

  return (
    <context.Provider
      value={{
        showThemeOptions,
        openMenu,
        closeMenu,
        setTheme,
        theme,
        checkSystemTheme,
        setShowThemeOptions,
      }}
    >
      {children}
    </context.Provider>
  );
};

export default ThemeProvider;

export const useTheme = () => {
  return useContext(context);
};
