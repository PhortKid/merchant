import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Button, TextField, Typography, Paper, MenuItem,
  Divider,
  Snackbar,
  Alert
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Register } from '../hooks/hooks.jsx';

const genderOptions = ['M', 'F', 'O'];

const validationSchema = Yup.object({
    username: Yup.string().required(),
    email: Yup.string().email().required(),
    phone: Yup.string().required(),
    zip_code: Yup.string().required(),
    country: Yup.string().required(),
    password: Yup.string().required(),
    confirm_password: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required(),
    nida_id: Yup.string().required(),
    business_name: Yup.string().required(),
    business_registration_number: Yup.string().required(),
    tax_id: Yup.string().required(),
    address: Yup.string().required(),
    gender: Yup.string().oneOf(genderOptions).required(),
    date_of_birth: Yup.date().required(),
    id_front_url: Yup.string(),
    id_back_url: Yup.string(),
    id_selfie_url: Yup.string(),
  });




const Registration = () => {
    const [countries, setCountries] = useState([]);
    
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = React.useState({
        open: false,
        message: '',
        severity: 'success', // 'error' | 'warning' | 'info'
      });

   useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all?fields=name,cca2')
      .then(response => {
        const countryList = response.data.map(country => ({
          name: country.name.common,
          code: country.cca2
        })).sort((a, b) => a.name.localeCompare(b.name));
        setCountries(countryList);
      })
      .catch(error => {
        console.error('Error fetching countries:', error);
      });
  }, []);


  const navigate = useNavigate();
  const mutation = useMutation({
      mutationFn: Register, // Ensure `createNews` is a function
      onSuccess: (response) => {
        const message = response.message
        setLoading(false)
        setSnackbar({ open: true, message: message, severity: 'success' });
        setTimeout(() => navigate('/login'), 2000); // Delay navigation to allow toast display

      },
      onError: (error) => {
        setLoading(false)
        setSnackbar({ open: true, message: error.message || 'Registration failed', severity: 'error' });
      }
  });
    const formik = useFormik({
        initialValues: {
          username: '',
          user_type:'business',
          email: '',
          phone: '',
          zip_code: '',
          country: '',
          password: '',
          confirm_password: '',
          nida_id: '',
          business_name: '',
          business_registration_number: '',
          tax_id: '',
          address: '',
          gender: '',
          date_of_birth: '',
          id_front_url: '',
          id_back_url: '',
          id_selfie_url: '',
        },
        validationSchema,
        onSubmit: (values) => {
          setLoading(true)
          mutation.mutate(values)
        }
        
      }); 

      
      
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#fff" px={2}>
       <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
            <Alert
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                severity={snackbar.severity}
            >
                {snackbar.message}
            </Alert>
        </Snackbar>
      <Paper elevation={0} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Typography variant="h5" textAlign="center" mb={2} sx={{
            fontSize:20,
            fontWeight:700,
            color:"#212121",

        }}>
           API Dashboard Sign-Up
        </Typography>
        <Typography variant="body1" textAlign="center" mb={3} sx={{
            fontSize:14,
            fontWeight:500,
            color:"#616161",
            textAlign:"center",
            marginBottom:2,   
        }}>
           Authenticate to unlock API keys, docs & transaction analytics
        </Typography>

        <form onSubmit={formik.handleSubmit}>
            {/* Section 1: Personal Info */}
            <Typography 
                variant="h6" 
                gutterBottom
                sx={{
                    color: "#212121",  // Soft black for readability
                    fontWeight: 600,
                    fontSize: "1.1rem",
                    letterSpacing: "0.5px",
                    position: "relative",
                    display: "inline-block",
                    "&::after": {      // Red underline for emphasis
                    content: '""',
                    position: "absolute",
                    bottom: -4,
                    left: 0,
                    width: "40px",
                    height: "2px",
                    backgroundColor: "#D32F2F",  // Primary red
                    }
                }}
                >
                Personal Information
                </Typography>
                <Divider sx={{ mb: 2, mt: 1, borderColor: "#E0E0E0" }} />
            {['username', 'email', 'phone', 'date_of_birth', 'gender', 'zip_code', 'country', 'password', 'confirm_password'].map((key) => (
                <Box key={key} mb={2}>
                {key === 'gender' ? (
                    <TextField
                size='small'
                    select
                    fullWidth
                    label="Gender"
                    name="gender"
                    value={formik.values.gender}
                    onChange={formik.handleChange}
                    error={formik.touched.gender && Boolean(formik.errors.gender)}
                    helperText={formik.touched.gender && formik.errors.gender}
                    InputLabelProps={{
                        sx: {
                        color: "#555", // Default label color
                        fontSize: 12,
                        transition: "color 0.3s ease",
                        "&:hover": {
                            color: "#333"
                        }, // Label color on hover
                        "&.Mui-focused": { 
                            color: "#212121",
                            textTransform:"uppercase",
                            fontWeight:500
                        }, // Label color on focus
                        },
                    }}
                    inputProps={{
                        sx: {
                        fontSize: 10, // Field content size
                        color: "#333", // Field content color
                        "&::placeholder": {
                            color: "#aaa", // Placeholder color
                            fontSize: 12,
                        },
                        },
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                        borderRadius: "2px",
                        "&.Mui-focused fieldset": { 
                            borderColor: "#212121",
                            borderRadius:"2px"
                        }, // Focus border
                        },
                        '& .MuiFormHelperText-root': {
                        fontSize: 10, // Smaller font size for validation errors
                        color: 'error.main', // Red color for errors
                        textTransform:"capitalize"
                        },
                    
                    }}
                
                    SelectProps={{
                    MenuProps: {
                        PaperProps: {
                        style: {
                            borderRadius:"1px",
                            maxHeight: 200,
                            marginTop: 8,
                            boxShadow: 'none', // Removed elevation
                            border: '1px solid #e0e0e0',
                            fontSize:12,
                        },
                        },
                    },
                    }}
                    displayEmpty
                    >
                    <MenuItem value="" disabled>Select Gender</MenuItem>
                    {genderOptions.map((option) => (
                        <MenuItem key={option} value={option}
                        sx={{
                            fontSize:12,
                            fontWeight:500,
                          padding: '8px 16px',
                          '&:hover': {
                            backgroundColor: 'rgb(255, 184, 190)',
                          },
                          '&.Mui-selected': {
                            backgroundColor: 'rgb(221, 24, 73)',
                          }
                        }}>{option}</MenuItem>
                    ))}
                    </TextField>
                ) : key === 'country' ? (<TextField
                size='small'
                    select
                    fullWidth
                    label="Country"
                    name="country"
                    value={formik.values.country}
                    onChange={formik.handleChange}
                    error={formik.touched.country && Boolean(formik.errors.country)}
                    helperText={formik.touched.country && formik.errors.country}
                    
                    InputLabelProps={{
                        sx: {
                        color: "#555", // Default label color
                        fontSize: 12,
                        transition: "color 0.3s ease",
                        "&:hover": {
                            color: "#333"
                        }, // Label color on hover
                        "&.Mui-focused": { 
                            color: "#212121",
                            textTransform:"uppercase",
                            fontWeight:500
                        }, // Label color on focus
                        },
                    }}
                    inputProps={{
                        sx: {
                        fontSize: 10, // Field content size
                        color: "#333", // Field content color
                        "&::placeholder": {
                            color: "#aaa", // Placeholder color
                            fontSize: 12,
                        },
                        },
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                        borderRadius: "2px",
                        "&.Mui-focused fieldset": { 
                            borderColor: "#212121",
                            borderRadius:"2px"
                        }, // Focus border
                        },
                        '& .MuiFormHelperText-root': {
                        fontSize: 10, // Smaller font size for validation errors
                        color: 'error.main', // Red color for errors
                        textTransform:"capitalize"
                        },
                    
                    }}
                
                    SelectProps={{
                    MenuProps: {
                        PaperProps: {
                        style: {
                            borderRadius:"1px",
                            minHeight: 200,
                            marginTop: 8,
                            boxShadow: 'none', // Removed elevation
                            border: '1px solid #e0e0e0',
                            fontSize:12,
                        },
                        },
                    },
                    }}
                    displayEmpty
                  >
                    {countries.map((country) => (
                      <MenuItem key={country.code} value={country.name}
                      sx={{
                          fontSize:12,
                          fontWeight:500,
                        padding: '8px 16px',
                        '&:hover': {
                          backgroundColor: 'rgb(255, 184, 190)',
                        },
                        '&.Mui-selected': {
                          backgroundColor: 'rgb(221, 24, 73)',
                        }
                      }}>
                        {country.name}
                      </MenuItem>
                    ))}
                  </TextField>): (
                    <TextField
                size='small'
                    fullWidth
                    type={key === 'date_of_birth' ? 'date' : key.includes('password') ? 'password' : 'text'}
                    label={key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    name={key}
                    value={formik.values[key]}
                    onChange={formik.handleChange}
                    error={formik.touched[key] && Boolean(formik.errors[key])}
                    helperText={formik.touched[key] && formik.errors[key]}
                    // InputProps={{
                    //     startAdornment: <InputAdornment position="start">{iconMap[key]}</InputAdornment>,
                    // }}
                    InputLabelProps={key === 'date_of_birth' ? { shrink: true,
                        sx: {
                          color: "#555", // Default label color
                          fontSize: 12,
                          transition: "color 0.3s ease",
                          "&:hover": {
                              color: "#333"
                          }, // Label color on hover
                          "&.Mui-focused": { 
                              color: "#212121",
                              textTransform:"uppercase",
                              fontWeight:500
                          }, // Label color on focus
                        }, } : {
                            
                        sx: {
                            color: "#555", // Default label color
                            fontSize: 12,
                            transition: "color 0.3s ease",
                            "&:hover": {
                                color: "#333"
                            }, // Label color on hover
                            "&.Mui-focused": { 
                                color: "#212121",
                                textTransform:"uppercase",
                                fontWeight:500
                            }, // Label color on focus
                          },
                        }}
                      inputProps={{
                        sx: {
                          fontSize: 10, // Field content size
                          color: "#333", // Field content color
                          "&::placeholder": {
                            color: "#aaa", // Placeholder color
                            fontSize: 12,
                          },
                        },
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: "2px",
                          "&.Mui-focused fieldset": { 
                              borderColor: "#212121",
                              borderRadius:"2px"
                          }, // Focus border
                        },
                        '& .MuiFormHelperText-root': {
                          fontSize: 10, // Smaller font size for validation errors
                          color: 'error.main', // Red color for errors
                          textTransform:"capitalize"
                        },
                      
                      }}
                    />
                )}
                </Box>
            ))}

            {/* Section 2: Business Info */}
            <Typography 
            variant="h6" 
            gutterBottom
            sx={{
                color: "#212121",
                fontWeight: 600,
                fontSize: "1.1rem",
                "&::before": {      // Red bullet for visual anchor
                content: '"•"',
                color: "#D32F2F",
                marginRight: "8px",
                fontSize: "1.3rem",
                verticalAlign: "middle"
                }
            }}
            >
            Business Information
            </Typography>
            <Divider sx={{ mb: 2, borderColor: "#E0E0E0" }} />
            {['business_name', 'business_registration_number', 'tax_id', 'nida_id', 'address'].map((key) => (
                <Box key={key} mb={2}>
                <TextField
                size='small'
                    fullWidth
                    type="text"
                    label={key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    name={key}
                    value={formik.values[key]}
                    onChange={formik.handleChange}
                    error={formik.touched[key] && Boolean(formik.errors[key])}
                    helperText={formik.touched[key] && formik.errors[key]}
                    // InputProps={{
                    // startAdornment: <InputAdornment position="start">{iconMap[key]}</InputAdornment>,
                    // }}
                    InputLabelProps={{
                        sx: {
                          color: "#555", // Default label color
                          fontSize: 12,
                          transition: "color 0.3s ease",
                          "&:hover": {
                              color: "#333"
                          }, // Label color on hover
                          "&.Mui-focused": { 
                              color: "#212121",
                              textTransform:"uppercase",
                              fontWeight:500
                          }, // Label color on focus
                        },
                      }}
                      inputProps={{
                        sx: {
                          fontSize: 10, // Field content size
                          color: "#333", // Field content color
                          "&::placeholder": {
                            color: "#aaa", // Placeholder color
                            fontSize: 12,
                          },
                        },
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: "2px",
                          "&.Mui-focused fieldset": { 
                              borderColor: "#212121",
                              borderRadius:"2px"
                          }, // Focus border
                        },
                        '& .MuiFormHelperText-root': {
                          fontSize: 10, // Smaller font size for validation errors
                          color: 'error.main', // Red color for errors
                          textTransform:"capitalize"
                        },
                      
                      }}
                />
                </Box>
            ))}

            {/* Section 3: Verification Docs */}
            <Typography 
            variant="h6" 
            gutterBottom
            sx={{
                color: "#212121",
                fontWeight: 600,
                fontSize: "1.1rem",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                "&::before": {      // Red lock icon (replace with your icon)
                content: '"🔒"',
                color: "#D32F2F",
                fontSize: "1rem"
                }
            }}
            >
            Verification Documents
            </Typography>
            <Divider sx={{ mb: 2, borderColor: "#E0E0E0" }} />
            {['id_front_url', 'id_back_url', 'id_selfie_url'].map((key) => (
                <Box key={key} mb={2}>
                <TextField
                size='small'
                    fullWidth
                    type="text"
                    label={key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    name={key}
                    value={formik.values[key]}
                    onChange={formik.handleChange}
                    error={formik.touched[key] && Boolean(formik.errors[key])}
                    helperText={formik.touched[key] && formik.errors[key]}
                    // InputProps={{
                    // startAdornment: <InputAdornment position="start">{iconMap[key]}</InputAdornment>,
                    // }}
                    InputLabelProps={{
                        sx: {
                          color: "#555", // Default label color
                          fontSize: 12,
                          transition: "color 0.3s ease",
                          "&:hover": {
                              color: "#333"
                          }, // Label color on hover
                          "&.Mui-focused": { 
                              color: "#212121",
                              textTransform:"uppercase",
                              fontWeight:500
                          }, // Label color on focus
                        },
                      }}
                      inputProps={{
                        sx: {
                          fontSize: 10, // Field content size
                          color: "#333", // Field content color
                          "&::placeholder": {
                            color: "#aaa", // Placeholder color
                            fontSize: 12,
                          },
                        },
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: "2px",
                          "&.Mui-focused fieldset": { 
                              borderColor: "#212121",
                              borderRadius:"2px"
                          }, // Focus border
                        },
                        '& .MuiFormHelperText-root': {
                          fontSize: 10, // Smaller font size for validation errors
                          color: 'error.main', // Red color for errors
                          textTransform:"capitalize"
                        },
                      
                      }}
                />
                </Box>
            ))}

            <Button
            disabled={loading}
            sx={{
            borderRadius: "1px",
            textTransform: 'none',
            // py: 1.5,
            fontSize: 12,
            fontWeight:600,
            boxShadow:0,
            backgroundColor:"#D32F2F",                  
            "&:hover": {
                boxShadow: "none",
            },
            }} variant="contained" type="submit" fullWidth>
                {loading? "Registering" : "Register"}
            </Button>
            <Box mt={2} textAlign="center">
                <Typography variant="body2" sx={{
                    // py: 1.5,
                    fontSize: 12,
                    fontWeight:400,
                    }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#D32F2F', textDecoration: 'none', fontWeight: 500 }}>
                    Login
                    </Link>
                </Typography>
             </Box>
            </form>
       
      </Paper>
    </Box>
  )
}

export default Registration
