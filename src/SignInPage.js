import React, { useState } from 'react';
import { Button, TextField, Box, Typography, Checkbox, FormControlLabel } from '@mui/material';
import pizzaOvenImage from './img/pizzaoven.jpg';
import { useNavigate } from 'react-router-dom';
import logo from './img/logo2.png';
import { useUser } from './UserContext';

const SignInPage = () => {
    const [role, setRole] = useState('');
    const [name, setName] = useState('');
    const [useLocal, setUseLocal] = useState(false);
    const [portNum, setPortNum] = useState('5000');
    const [isTextVisible, setIsTextVisible] = useState(true);
    const [isPanelCentered, setIsPanelCentered] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useUser();

    const handleRoleSelect = (selectedRole) => {
        setRole(selectedRole);
    };
  
    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleUseLocalChange = (event) => {
        setUseLocal(event.target.checked);
    };

    const handlePortNumChange = (event) => {
        setPortNum(event.target.value);
    };
  
    const handleBack = () => {
        setRole('');
        setName('');
        setUseLocal(false);
        setPortNum('');
        setIsTextVisible(true);
        setIsPanelCentered(false);
    };
  
    const handleEnter = () => {
        if (name.trim()) {
            setUser({ name, role, localBool: useLocal, portNum: useLocal ? portNum : '' });
            setIsTextVisible(false);
            setTimeout(() => {
                setIsPanelCentered(true);
                setTimeout(() => {
                    navigate(`/${role.toLowerCase()}-home`);
                }, 1000);
            }, 500);
        }
    };

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isPanelCentered ? 'center' : 'flex-end',
            backgroundImage: `url(${pizzaOvenImage})`,
            backgroundSize: 'cover',
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundPosition: 'center',
            overflow: 'hidden',
            transition: 'justify-content 1s ease',
        }}>
            <Box sx={{
                width: isPanelCentered ? '50%' : '35%',
                transition: 'width 1s ease',
                display: 'flex',
                height: '100%',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.95)',
                color: 'white',
                padding: '20px',
            }}>
                <img src={logo} alt="Logo" style={{ maxWidth: '100px', marginBottom: '20px', opacity: isTextVisible ? 1 : 0, transition: 'opacity 0.5s ease' }} />
                <Typography variant="h5" sx={{ color: 'white', marginBottom: 10, opacity: isTextVisible ? 1 : 0, transition: 'opacity 0.5s ease' }}>Abe's Pizzeria</Typography>
                {!role && isTextVisible && (
                    <Box sx={{ opacity: isTextVisible ? 1 : 0, transition: 'opacity 0.5s ease' }}>
                        <Button variant="contained" onClick={() => handleRoleSelect('Chef')} sx={{ margin: 1, color: 'white' }}>Chef</Button>
                        <Button variant="contained" onClick={() => handleRoleSelect('Manager')} sx={{ margin: 1, color: 'white' }}>Manager</Button>
                    </Box>
                )}
                {role && isTextVisible && (
                    <>
                        <Box sx={{  textAlign: 'center', width: '100%', opacity: isTextVisible ? 1 : 0, transition: 'opacity 0.5s ease' }}>
                            <Typography variant="h5" sx={{ color: 'white', marginBottom: 2 }}>Welcome, {role}</Typography>
                            <TextField
                  placeholder="Name"
                  variant="outlined"
                  value={name}
                  onChange={handleNameChange}
                  InputLabelProps={{
                    style: { color: 'white' }, // For label
                  }}
                  InputProps={{
                    style: {
                      color: 'white', // For input text
                    },
                    // For input borders
                    notchedOutline: {
                      borderWidth: '1px',
                      borderColor: 'white !important',
                    },
                  }}
                  sx={{
                    '& label.Mui-focused': {
                      color: 'white',
                    },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'white',
                      },
                      '&:hover fieldset': {
                        borderColor: 'white',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'white',
                      },
                    },
                    width: '60%',
                    marginBottom: 2,
                    marginRight: 5
                  }}
                  placeholderTextColor="white" // This prop does not exist in MUI; it's just for reference
                />
                            <FormControlLabel
                  control={
                    <Checkbox
                      checked={useLocal}
                      onChange={handleUseLocalChange}
                      sx={{
                        color: 'white', // Checkbox color when not checked
                        '&.Mui-checked': {
                          color: 'white', // Checkbox color when checked
                        },
                      }}
                    />
                  }
                  label="Use Local"
                  sx={{ color: 'white', '& .MuiSvgIcon-root': { color: 'white' } }} // For label and checkbox
                />
                            {useLocal && (
                                <TextField
                                label="Port Number"
                                variant="outlined"
                                value={portNum}
                                onChange={handlePortNumChange}
                                placeholder="Port"
                                InputProps={{
                                  style: { color: 'white' }, // This styles the input text color
                                  // Apply styles directly to the input element for the placeholder color
                                  inputProps: {
                                    style: {
                                      color: 'white', // Ensures text entered by the user is white
                                      '::placeholder': {
                                        color: 'white', // Attempts to style the placeholder text directly
                                        opacity: 1 // Ensure the placeholder is fully opaque
                                      }
                                    }
                                  }
                                }}
                                sx={{
                                  '& label.Mui-focused': {
                                    color: 'white',
                                  },
                                  '& .MuiInput-underline:before': {
                                    borderBottomColor: 'white',
                                  },
                                  '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                      borderColor: 'white',
                                    },
                                    '&:hover fieldset': {
                                      borderColor: 'white',
                                    },
                                    '&.Mui-focused fieldset': {
                                      borderColor: 'white',
                                    },
                                  },
                                  '& .MuiInputLabel-root': { // Styles the label
                                    color: 'white',
                                  },
                                  width: '30%',
                                  marginBottom: 2,
                                }}
                              />
                            )}
                        </Box>
                        <Box sx={{ marginTop: 2, opacity: isTextVisible ? 1 : 0, transition: 'opacity 0.5s ease' }}>
                            <Button variant="contained" onClick={handleBack} sx={{ margin: 1, color: 'white', backgroundColor: 'rgba(255,255,255,0.2)' }}>Back</Button>
                            <Button variant="contained" onClick={handleEnter} sx={{ margin: 1, color: 'white' }}>Enter</Button>
                        </Box>
                    </>
                )}
            </Box>
        </Box>
    );
};

export default SignInPage;