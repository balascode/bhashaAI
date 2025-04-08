import { createContext, useState, useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

export const ThemeContext = createContext({
  toggleTheme: () => {},
  mode: "dark" as "light" | "dark",
});

export const ThemeContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<"light" | "dark">("dark");
  
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { 
            main: mode === "dark" ? "#00f5ff" : "#6200ea" 
          },
          secondary: { 
            main: mode === "dark" ? "#ff4081" : "#00c853" 
          },
          background: {
            default: mode === "dark" ? "#050920" : "#f0f7ff",
            paper: mode === "dark" ? "#0a1029" : "#ffffff",
          },
        },
        typography: { 
          fontFamily: "'Rajdhani', 'Orbitron', sans-serif",
          h6: {
            letterSpacing: '0.5px',
            fontWeight: 600
          },
          body1: {
            letterSpacing: '0.2px'
          }
        },
        shape: {
          borderRadius: 12
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 24,
                textTransform: 'none',
                fontWeight: 600,
                padding: '8px 24px',
                boxShadow: mode === 'dark' ? '0 0 15px rgba(0, 245, 255, 0.5)' : 'none',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  transition: 'left 0.5s',
                },
                '&:hover::before': {
                  left: '100%',
                }
              }
            }
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: 12,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: mode === 'dark' ? '#00f5ff' : '#6200ea',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderWidth: '2px',
                  }
                }
              }
            }
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: mode === 'dark' 
                  ? 'linear-gradient(135deg, rgba(10, 16, 41, 0.8) 0%, rgba(5, 9, 32, 0.95) 100%)'
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 247, 255, 0.95) 100%)',
                backdropFilter: 'blur(10px)',
                borderRadius: 16,
                border: mode === 'dark' ? '1px solid rgba(0, 245, 255, 0.1)' : '1px solid rgba(98, 0, 234, 0.1)',
                boxShadow: mode === 'dark' 
                  ? '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 10px rgba(0, 245, 255, 0.1)' 
                  : '0 8px 32px rgba(0, 0, 0, 0.05), 0 0 5px rgba(98, 0, 234, 0.05)'
              }
            }
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundImage: mode === 'dark' 
                  ? 'linear-gradient(90deg, rgba(5, 9, 32, 0.7) 0%, rgba(10, 16, 41, 0.7) 100%)'
                  : 'linear-gradient(90deg, rgba(240, 247, 255, 0.9) 0%, rgba(255, 255, 255, 0.9) 100%)',
                backdropFilter: 'blur(10px)',
                borderBottom: mode === 'dark' ? '1px solid rgba(0, 245, 255, 0.1)' : '1px solid rgba(98, 0, 234, 0.1)',
              }
            }
          }
        }
      }),
    [mode]
  );

  const toggleTheme = () => setMode((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ toggleTheme, mode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};
