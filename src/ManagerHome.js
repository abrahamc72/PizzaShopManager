import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import pizzaOvenImage from './img/pizzaoven.jpg';
import logo from './img/logo2.png';
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';

const ManagerHome = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const navigateToCreatePizza = () => navigate('/create-pizza');
  const navigateToViewPizza = () => navigate('/view-pizza');
  const navigateToManageToppings = () => navigate('/manage-toppings');

  const handleSignOut = () => {
    setUser({ name: '', role: '' }); // Clear user context
    navigate('/'); // Navigate to sign-in page
  };

  useEffect(() => {
    if (!user || !user.name) { // Adjust the condition based on how your user object is structured
      navigate('/'); // Adjust the path as necessary
    }
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100); // Adjust as needed
    return () => clearTimeout(timer);
  }, [user,navigate]);

  return (
    <Box sx={{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      overflow: 'hidden',
    }}>
      <Box sx={{
        position: 'absolute',
        top: '-10px',
        left: '-10px',
        width: 'calc(100% + 20px)',
        height: 'calc(100% + 20px)',
        backgroundImage: `url(${pizzaOvenImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(8px)',
        zIndex: -1,
      }} />
      
      <Box sx={{
        width: '50%',
        minWidth: '500px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between', // Adjust to space between items
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.98)',
        color: 'white',
        padding: 4,
        borderRadius: 2,
        gap: 2,
        zIndex: 1,
        position: 'relative', // Ensure we can position children absolutely within
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: isLoaded ? 1 : 0, transition: 'opacity 1.5s ease' }}>
          <img src={logo} alt="Logo" style={{ maxWidth: '65px', marginBottom: '20px' }} />
          <Typography variant="h4" sx={{ marginLeft: 2, transition: 'opacity 1.5s ease', opacity: isLoaded ? 1 : 0 }}>Manager Dashboard</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 2, marginTop: 15, opacity: isLoaded ? 1 : 0, transition: 'opacity 1.5s ease', transitionDelay: '0.5s' }}>
          <Button onClick={navigateToCreatePizza} variant="outlined" sx={{ minWidth: '150px', minHeight: '150px', color: 'white', transition: 'opacity 1.5s ease', opacity: isLoaded ? 1 : 0 }}>Create/Delete Pizzas</Button>
          <Button onClick={navigateToViewPizza} variant="outlined" sx={{ minWidth: '150px', minHeight: '150px', color: 'white', transition: 'opacity 1.5s ease', opacity: isLoaded ? 1 : 0 }}>View Pizzas</Button>
          <Button onClick={navigateToManageToppings} variant="outlined" sx={{ minWidth: '150px', minHeight: '150px', color: 'white', transition: 'opacity 1.5s ease', opacity: isLoaded ? 1 : 0 }}>Manage Toppings</Button>
        </Box>
        {/* Adjusted Typography for role and name */}
        <Typography onClick={handleSignOut} sx={{ 
          mt: 'auto', // Push to the bottom
          alignSelf: 'flex-end', // Align to the right
          opacity: isLoaded ? 1 : 0, 
          transition: 'opacity 1.5s ease', 
          transitionDelay: '0.75s', // Adjust delay to show after buttons
        }}>
        {user.name} - Sign Out
        </Typography>
      </Box>
    </Box>
  );
};

export default ManagerHome;