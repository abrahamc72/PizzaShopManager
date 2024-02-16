import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, Typography, OutlinedInput, Chip } from '@mui/material';
import pizzaOvenImage from './img/pizzaoven.jpg';
import logo from './img/logo2.png';
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const CreatePizza = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [reloadData, setReloadData] = useState(false);
  const [toppings, setToppings] = useState([]);
  const [selectedToppingIds, setSelectedToppingIds] = useState([]);
  const [selectedToppingsUpdate, setSelectedToppingsUpdate] = useState([]);
  const [pizzaName, setPizzaName] = useState("");
  const [updatePizzaName, setUpdatePizzaName] = useState("");
  const [pizzas, setPizzas] = useState([]);
  const [selectedPizzaForUpdate, setSelectedPizzaForUpdate] = useState("");
const [selectedPizzaForDelete, setSelectedPizzaForDelete] = useState("");
  const navigateToViewPizza = () => navigate('/view-pizza');
  const navigateToManageToppings = () => navigate('/manage-toppings');
  const baseUrl = user.localBool ? `http://localhost:${user.portNum}` : 'http://ec2-18-219-122-182.us-east-2.compute.amazonaws.com:8000';
  const handleSignOut = () => {
    setUser({ name: '', role: '' });
    navigate('/');
  };
  const navigateToRole = () => {
    console.log(user.name)
    if (user.name.trim()) {
      navigate(`/${user.role.toLowerCase()}-home`);
    }
  };
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
    fetch(baseUrl+'/pizzas')
      .then(response => response.json())
      .then(data => {
        setPizzas(data);
      })
      .catch(error => console.log('Error fetching pizzas:', error));
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [navigate, user, reloadData, baseUrl]);
  const handleCreatePizza = () => {
    if (!pizzaName.trim() || selectedToppingIds.length === 0) {
      alert("Please enter a pizza name and select at least one topping.");
      return;
    }
    const pizzaData = {
      name: pizzaName,
      chef: user.name,
      toppings: selectedToppingIds,
    };
    fetch(baseUrl+'/pizzas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pizzaData),
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        alert(`Error: ${data.error}`);
      } else {
        alert(data.message);
      }
      setPizzaName("");
      setSelectedToppingIds([]);
      setReloadData(prev => !prev);
    })
    .catch(error => console.error('Error:', error));
  };
  const handleChangeToppings = (event) => {
    const selectedNames = event.target.value;
    const selectedIds = selectedNames.map(name =>
      toppings.find(topping => topping.name === name)?.id
    );
    setSelectedToppingIds(selectedIds);
  };
  const handleChangeUpdateToppings = (event) => {
    const selectedNames = event.target.value;
    const selectedIds = selectedNames.map(name =>
      toppings.find(topping => topping.name === name)?.id
    );
    setSelectedToppingsUpdate(selectedIds);
  };
  const handleUpdatePizzaSelection = (event) => {
    const pizzaId = event.target.value;
    setSelectedPizzaForUpdate(pizzaId);
    const pizza = pizzas.find(p => p.name === pizzaId);
    if (pizza) {
      setUpdatePizzaName(pizza.name);
      const selectedToppingIds = Array.isArray(pizza.toppings) ? pizza.toppings.map(topping => topping.id) : [];
      setSelectedToppingsUpdate(selectedToppingIds);
      console.log(selectedToppingIds);
    } else {
      setUpdatePizzaName("");
      setSelectedToppingsUpdate([]);
    }
  };
  const handleUpdatePizza = () => {
    if (!updatePizzaName.trim() || selectedToppingsUpdate.length === 0 || !selectedPizzaForUpdate) {
      alert("Please select a pizza and ensure it has a name and at least one topping.");
      return;
    }
    const pizzaData = {
      name: updatePizzaName,
      toppings: selectedToppingsUpdate,
    };
    fetch(baseUrl+`/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pizza_id: selectedPizzaForUpdate, ...pizzaData }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        alert(`Error: ${data.error}`);
      } else {
        alert(data.message);
      }
      setUpdatePizzaName("");
      setSelectedToppingsUpdate([]);
      setSelectedPizzaForUpdate('');
      setReloadData(prev => !prev);
    })
    .catch(error => console.error('Error updating pizza:', error));
  };
  const handleDeletePizzaSelection = (event) => {
    setSelectedPizzaForDelete(event.target.value);
  };
  const handleDeleteConfirmation = () => {
    if (!selectedPizzaForDelete) {
      alert("Please select a pizza to delete.");
      return;
    }
    const confirmed = window.confirm(`Are you sure you want to delete the pizza "${selectedPizzaForDelete}"?`);
    if (confirmed) {
      fetch(baseUrl+`/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pizzaName: selectedPizzaForDelete }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          alert(`Error: ${data.error}`);
        } else {
          alert(data.message);
        }
        setSelectedPizzaForDelete("");
        setReloadData(prev => !prev);
      })
      .catch(error => console.error('Error deleting pizza:', error));
    }
  };
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
          <Typography variant="h4" sx={{ marginLeft: 2, transition: 'opacity 1.5s ease', opacity: isLoaded ? 1 : 0 }}>Create/Delete a Pizza</Typography>
        </Box>
        {}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button variant="outlined" onClick={navigateToRole} color="primary">Home</Button>
          <Button variant="outlined" onClick={navigateToViewPizza} color="primary">View Pizzas</Button>
          <Button variant="outlined" onClick={navigateToManageToppings} color="primary">Manage Toppings</Button>
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
        <Typography variant="h4">Create a Pizza</Typography>
        <FormControl fullWidth margin="small" variant="outlined" sx={{ '.MuiInputLabel-root': { color: 'white' }, '.MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'white' }, '&:hover fieldset': { borderColor: 'white' } } }}>
        <TextField
          label="Pizza Name"
          value={pizzaName}
          onChange={(e) => setPizzaName(e.target.value)}
          InputLabelProps={{
            style: { color: 'white' },
          }}
          InputProps={{
            style: { color: 'white' },
          }}
        />
      </FormControl>
      <FormControl fullWidth margin="small" variant="outlined" sx={{ '.MuiInputLabel-root': { color: 'white' }, '.MuiSelect-select': { color: 'white' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' } }}>
        <InputLabel id="toppings-select-label" style={{ color: 'white' }}>Toppings</InputLabel>
        <Select
          labelId="toppings-select-label"
          multiple
          value={selectedToppingIds.map(id =>
            toppings.find(topping => topping.id === id)?.name || ''
          )}
          onChange={handleChangeToppings}
          input={<OutlinedInput id="select-multiple-chip" label="Toppings" style={{ color: 'white' }} />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} style={{ color: 'white', borderColor: 'white', backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
          sx={{ '.MuiSelect-select': { color: 'white', borderColor: 'white' }, '.MuiSvgIcon-root': { color: 'white' } }}
        >
          {toppings.map((topping) => (
            <MenuItem
              key={topping.id}
              value={topping.name}
              style={{ color: 'black', backgroundColor: 'white' }}
            >
              {topping.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="contained" onClick={handleCreatePizza}>Create</Button>
      <Typography variant="h4" sx={{ color: 'white', mt: 4, mb: 2 }}>Update Existing Pizza</Typography>
      <Box sx={{ width: '100%' }}>
  <FormControl fullWidth margin="small" variant="outlined" sx={{ '.MuiInputLabel-root': { color: 'white' }, '.MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'white' }, '&:hover fieldset': { borderColor: 'white' } }, '& .MuiSelect-select': { textAlign: 'left', paddingRight: '24px' } }}>
    <InputLabel id="select-pizza-label" sx={{ color: 'white' }}>Existing Pizza</InputLabel>
    <Select
      labelId="select-pizza-label"
      value={updatePizzaName}
      onChange={handleUpdatePizzaSelection}
      label="Pizza"
      sx={{ color: 'white', textAlign: 'left' }}
      MenuProps={{ PaperProps: { sx: { width: 'auto' } } }}
    >
      {pizzas.map((pizza) => (
        <MenuItem
          key={pizza.pizza_id}
          value={pizza.name}
          style={{ textAlign: 'left' }}
        >
          {pizza.name}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
</Box>
<Box sx={{ width: '100%' }}>
  <FormControl fullWidth margin="small" variant="outlined" sx={{ '.MuiInputLabel-root': { color: 'white' }, '.MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'white' }, '&:hover fieldset': { borderColor: 'white' } } }}>
    <InputLabel id="select-toppings-label" sx={{ color: 'white' }}>Toppings</InputLabel>
    <Select
          labelId="toppings-select-label"
          multiple
          value={selectedToppingsUpdate.map(id =>
            toppings.find(topping => topping.id === id)?.name || ''
          )}
          onChange={handleChangeUpdateToppings}
          input={<OutlinedInput id="select-multiple-chip" label="Toppings" style={{ color: 'white' }} />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} style={{ color: 'white', borderColor: 'white', backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
          sx={{ '.MuiSelect-select': { color: 'white', borderColor: 'white' }, '.MuiSvgIcon-root': { color: 'white' } }}
        >
          {toppings.map((topping) => (
            <MenuItem
              key={topping.id}
              value={topping.name}
              style={{ color: 'black', backgroundColor: 'white' }}
            >
              {topping.name}
            </MenuItem>
          ))}
        </Select>
  </FormControl>
</Box>
<Button variant="contained" onClick={handleUpdatePizza}>Update</Button>
  <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>Delete a Pizza</Typography>
  <FormControl fullWidth margin="small" variant="outlined" sx={{ '.MuiInputLabel-root': { color: 'white' }, '.MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'white' }, '&:hover fieldset': { borderColor: 'white' } }, '& .MuiSelect-select': { textAlign: 'left', paddingRight: '24px' } }}>
    <InputLabel id="delete-pizza-label" sx={{ color: 'white' }}>Existing Pizza</InputLabel>
    <Select
      labelId="delete-pizza-label"
      value={selectedPizzaForDelete}
      onChange={handleDeletePizzaSelection}
      label="Pizza"
      sx={{ color: 'white', textAlign: 'left' }}
      MenuProps={{ PaperProps: { sx: { width: 'auto' } } }}
    >
      {pizzas.map((pizza) => (
        <MenuItem
          key={pizza.pizza_id}
          value={pizza.name}
          style={{ textAlign: 'left' }}
        >
          {pizza.name}
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
export default CreatePizza;