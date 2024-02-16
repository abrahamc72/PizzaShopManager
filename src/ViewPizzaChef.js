import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import pizzaOvenImage from './img/pizzaoven.jpg';
import logo from './img/logo2.png';
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';
const ViewPizza = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [pizzas, setPizzas] = useState([]);
  const navigateToCreatePizza = () => navigate('/create-pizza-chef');
  const handleSignOut = () => {
    setUser({ name: '', role: '' });
    navigate('/');
  };
  const navigateToHome = () => {
    console.log(user.name)
    if (user.name.trim()) {
      navigate(`/chef-home`);
    }
  };
  useEffect(() => {
    if (!user || !user.name) {
      navigate('/');
    }
    const baseUrl = user.localBool ? `http://localhost:${user.portNum}` : 'http://ec2-18-219-122-182.us-east-2.compute.amazonaws.com:8000';
    fetch(baseUrl+'/pizzas')
      .then(response => response.json())
      .then(data => {
        setPizzas(data);
        setIsLoaded(true);
      })
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
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
          <Typography variant="h4" sx={{ marginLeft: 2, transition: 'opacity 1.5s ease', opacity: isLoaded ? 1 : 0 }}>View All Pizzas</Typography>
        </Box>
        {}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button variant="outlined" onClick={navigateToHome} color="primary">Home</Button>
          <Button variant="outlined" onClick={navigateToCreatePizza} color="primary">Create Pizzas</Button>
        </Box>
        <TableContainer component={Paper} sx={{
  maxWidth: 750,
  marginTop: 5,
  backgroundColor: '#2c2c2c',
  color: 'white',
  '&::-webkit-scrollbar': {
      width: '10px',
      backgroundColor: 'transparent',
    },
    '&::-webkit-scrollbar-track': {
      border: '1px solid white',
      borderRadius: '10px',
      backgroundColor: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#840f0f',
      borderRadius: '10px',
      border: '2px solid white',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: '#115293',
    },
}}>
  <Table aria-label="simple table">
    <TableHead>
      <TableRow sx={{
        '& .MuiTableCell-root': {
          backgroundColor: '#1d1d1d',
          color: 'white',
        }
      }}>
        <TableCell>Pizza Name</TableCell>
        <TableCell align="right">Chef</TableCell>
        <TableCell align="right">Date Created</TableCell>
        <TableCell align="right">Toppings</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {pizzas.map((pizza) => (
        <TableRow key={pizza.name} sx={{
          color:'white',
          backgroundColor: '#3d3d3d',
          '&:not(:last-child)': {
            borderBottom: '0.5px solid white',
          },
          '& .MuiTableCell-root': {
            borderBottom: 'none',
          },
        }}>
          <TableCell sx={{color:'white',}} component="th" scope="row">{pizza.name}</TableCell>
          <TableCell sx={{color:'white',}} align="right">{pizza.chef}</TableCell>
          <TableCell sx={{color:'white',}} align="right">{pizza.date_created}</TableCell>
          <TableCell sx={{color:'white',}} align="right">{pizza.toppings}</TableCell> {}
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>
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
export default ViewPizza;