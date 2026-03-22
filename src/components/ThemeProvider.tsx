import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

type ThemeProviderContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeProviderContext = createContext<ThemeProviderContextType | undefined>(undefined);

function getSystemTheme(): Theme {
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }
  return "dark";
}

export function ThemeProvider({
  children,
  defaultTheme,
  storageKey = "portfolio-theme",
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem(storageKey) as Theme;
      if (stored === "light" || stored === "dark") return stored;
    } catch {
      // localStorage unavailable (e.g. private browsing on iOS Safari)
    }
    // Use explicit defaultTheme when provided, otherwise fall back to system preference
    return defaultTheme ?? getSystemTheme();
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    root.setAttribute("data-theme", theme);
    try {
      // colorScheme is well-supported but wrap defensively for strict browser
      // environments or older engines (e.g. WebKit < 15) where it may throw.
      root.style.colorScheme = theme;
    } catch {
      // Ignore — the class + data-theme already carry the theme information.
    }
    try {
      localStorage.setItem(storageKey, theme);
    } catch {
      // localStorage unavailable
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0a0a0a" : "#fafafa");
  }, [theme, storageKey]);

  // Follow OS theme changes when the user has not set an explicit preference
  // and no defaultTheme was provided (i.e. defaultTheme should track the OS)
  useEffect(() => {
    if (!window.matchMedia || defaultTheme !== undefined) return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    const handleChange = (e: MediaQueryListEvent) => {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem(storageKey);
      } catch {
        // localStorage unavailable
      }
      if (!stored) {
        setTheme(e.matches ? "light" : "dark");
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [storageKey, defaultTheme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  }, []);

  const value = {
    theme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
