import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ChefHome from './ChefHome';
import ManagerHome from './ManagerHome';
import SignInPage from './SignInPage';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { UserProvider } from './UserContext'; // Ensure this path is correct
import CreatePizza from './CreatePizza'; // Import your component
import ViewPizza from './ViewPizza';
import ManageToppings from './ManageToppings';
import ViewPizzaChef from './ViewPizzaChef';
import CreatePizzaChef from './CreatePizzaChef';
const App = () => {
  return (
    <ThemeProvider theme={theme}> {/* Continue to wrap everything in ThemeProvider */}
      <UserProvider> {/* Wrap the Routes in UserProvider to provide user context */}
        <BrowserRouter >
          <Routes>
            <Route path="/" element={<SignInPage />} />
            <Route path="/chef-home" element={<ChefHome />} />
            <Route path="/manager-home" element={<ManagerHome />} />
            <Route path="/create-pizza" element={<CreatePizza />} />
            <Route path="/view-pizza" element={<ViewPizza />} />
            <Route path="/manage-toppings" element={<ManageToppings />} />
            <Route path="/view-pizza-chef" element={<ViewPizzaChef/>} />
            <Route path="/create-pizza-chef" element={<CreatePizzaChef />} />
            {/* Add other routes as needed */}
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;