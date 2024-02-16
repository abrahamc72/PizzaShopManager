import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import pizzaOvenImage from './img/pizzaoven.jpg';
import logo from './img/logo2.png';
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';
const ManageToppings = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [toppingName, setToppingName] = useState("");
  const [selectedToppingForDelete, setSelectedToppingForDelete] = useState("");
  const [toppings, setToppings] = useState([]);
  const [reloadData, setReloadData] = useState(false);
  const baseUrl = user.localBool ? `http://localhost:${user.portNum}` : 'http://ec2-18-219-122-182.us-east-2.compute.amazonaws.com:8000';
  const navigateToCreatePizza = () => navigate('/create-pizza');
  const navigateToViewPizza = () => navigate('/view-pizza');
  const navigateToRole = () => navigate('/manager-home');
  const handleSignOut = () => {
    setUser({ name: '', role: '' });
    navigate('/');
  };
  const handleAddTopping = () => {
    if (!toppingName.trim()) {
      alert("Please enter a topping name.");
      return;
    }
    fetch(baseUrl+'/add-topping', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: toppingName }),
    })
    .then(response => response.json())
      .then(data => {
        if (data.error) {
          alert(`Error: ${data.error}`);
        } else {
          alert(data.message);
        }
        setSelectedToppingForDelete("");
        setReloadData(prev => !prev);
      })
      .catch(error => console.error('Error deleting topping:', error));
  };
  const handleDeleteToppingSelection = (event) => {
    setSelectedToppingForDelete(event.target.value);
  };
  const handleDeleteConfirmation = () => {
    if (!selectedToppingForDelete) {
      alert("Please select a topping to delete.");
      return;
    }
    const confirmed = window.confirm(`Are you sure you want to delete the topping "${selectedToppingForDelete}"?`);
    if (confirmed) {
      fetch(baseUrl + `/delete-topping`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toppingName: selectedToppingForDelete }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          alert(`Error: ${data.error}`);
        } else {
          alert(data.message);
        }
        setSelectedToppingForDelete("");
        setReloadData(prev => !prev);
      })
      .catch(error => console.error('Error deleting topping:', error));
    };}
  useEffect(() => {
    if (!user || !user.name) {
      navigate('/');
    }
    fetch(baseUrl+'/toppings')
      .then(response => response.json())
      .then(data => {
        setToppings(data);
      })
      .catch(error => console.log('Error fetching toppings:', error));
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [reloadData, baseUrl,navigate,user]);
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
          <Typography variant="h4" sx={{ marginLeft: 2, transition: 'opacity 1.5s ease', opacity: isLoaded ? 1 : 0 }}>Manage Toppings</Typography>
        </Box>
        {}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button variant="outlined" onClick={navigateToRole} color="primary">Home</Button>
          <Button variant="outlined" onClick={navigateToCreatePizza} color="primary">Create/Delete Pizzas</Button>
          <Button variant="outlined" onClick={navigateToViewPizza} color="primary">View Pizzas</Button>
        </Box>
        <Box sx={{
    width: '50%',
    minWidth: '540px',
    maxWidth:'540px',
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: '20px',
    maxHeight: '60vh',
    marginTop: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
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
        <Accordion sx={{
  width: '100%',
  backgroundColor: 'rgba(255,255,255,0.0)',
  color: 'white',
  border: '1px solid white',
  borderRadius: '4px',
}}>
  <AccordionSummary
    aria-controls="panel1a-content"
    id="panel1a-header"
  >
    <Typography>View Toppings</Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {toppings.length > 0 ? toppings.map((topping, index) => (
        <Typography key={index}>
          {topping.name}
        </Typography>
      )) : <Typography>No toppings available.</Typography>}
    </Box>
  </AccordionDetails>
</Accordion>
        <Typography variant="h4">Add a Topping</Typography>
        <FormControl fullWidth margin="small" variant="outlined" sx={{ '.MuiInputLabel-root': { color: 'white' }, '.MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'white' }, '&:hover fieldset': { borderColor: 'white' } } }}>
          <TextField
            label="Topping Name"
            value={toppingName}
            onChange={(e) => setToppingName(e.target.value)}
            InputLabelProps={{
              style: { color: 'white' },
            }}
            InputProps={{
              style: { color: 'white' },
            }}
          />
        </FormControl>
        <Button variant="contained" onClick={handleAddTopping}>Add Topping</Button>
        <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>Delete a Topping</Typography>
        <FormControl fullWidth margin="small" variant="outlined" sx={{ '.MuiInputLabel-root': { color: 'white' }, '.MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'white' }, '&:hover fieldset': { borderColor: 'white' } }, '& .MuiSelect-select': { textAlign: 'left', paddingRight: '24px' } }}>
          <InputLabel id="delete-topping-label" sx={{ color: 'white' }}>Existing Toppings</InputLabel>
          <Select
            labelId="delete-topping-label"
            value={selectedToppingForDelete}
            onChange={handleDeleteToppingSelection}
            label="Topping"
            sx={{ color: 'white', textAlign: 'left' }}
            MenuProps={{ PaperProps: { sx: { width: 'auto' } } }}
          >
            {toppings.map((topping) => (
              <MenuItem
                key={topping.id}
                value={topping.name}
                style={{ textAlign: 'left' }}
              >
                {topping.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleDeleteConfirmation}>Delete</Button>
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
export default ManageToppings;