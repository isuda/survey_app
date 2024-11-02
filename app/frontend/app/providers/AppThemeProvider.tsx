import React, { useMemo } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { PaletteMode } from '@mui/material';

// Custom hook to detect system theme preference
const usePreferredColorScheme = (): PaletteMode => {
  const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return isDarkMode ? 'dark' : 'light';
};

const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const preferredMode = usePreferredColorScheme();

  // Create theme based on system preference
  const theme = useMemo(() => createTheme({ palette: { mode: preferredMode } }), [preferredMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Ensures background and text color align with theme */}
      {children}
    </ThemeProvider>
  );
};

export default AppThemeProvider;
