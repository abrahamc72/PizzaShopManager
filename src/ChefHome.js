import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import pizzaOvenImage from './img/pizzaoven.jpg';
import logo from './img/logo2.png';
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';
const ChefHome = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const navigateToViewPizza = () => navigate('/view-pizza-chef');
  const navigateToCreate = () => navigate('/create-pizza-chef');
  const handleSignOut = () => {
    setUser({ name: '', role: '' });
    navigate('/');
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);
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
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.98)',
        color: 'white',
        padding: 4,
        borderRadius: 2,
        gap: 2,
        zIndex: 1,
        position: 'relative',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: isLoaded ? 1 : 0, transition: 'opacity 1.5s ease' }}>
          <img src={logo} alt="Logo" style={{ maxWidth: '65px', marginBottom: '20px' }} />
          <Typography variant="h4" sx={{ marginLeft: 2, transition: 'opacity 1.5s ease', opacity: isLoaded ? 1 : 0 }}>{user.role} Dashboard</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 2, marginTop: 15, opacity: isLoaded ? 1 : 0, transition: 'opacity 1.5s ease', transitionDelay: '0.5s' }}>
          <Button variant="outlined" onClick={navigateToCreate} sx={{ minWidth: '150px', minHeight: '150px', color: 'white', transition: 'opacity 1.5s ease', opacity: isLoaded ? 1 : 0 }}>Create Pizzas</Button>
          <Button variant="outlined" onClick={navigateToViewPizza} sx={{ minWidth: '150px', minHeight: '150px', color: 'white', transition: 'opacity 1.5s ease', opacity: isLoaded ? 1 : 0 }}>View Pizzas</Button>
        </Box>
        {}
        <Typography onClick={handleSignOut} sx={{ 
          mt: 'auto',
          alignSelf: 'flex-end',
          opacity: isLoaded ? 1 : 0, 
          transition: 'opacity 1.5s ease', 
          transitionDelay: '0.75s',
        }}>
        {user.name} - Sign Out
        </Typography>
      </Box>
    </Box>
  );
};
export default ChefHome;