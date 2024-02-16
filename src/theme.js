import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  // Customize your theme here
  palette: {
    primary: {
      main: "#840f0f", // Example primary color
    },
    scrollbar: {
      thumbColor: "#ffffff",
      trackColor: "#222222",
    },
    // Add more customization
  },
});

export default theme;