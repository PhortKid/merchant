import { Alert, Box, Button, Container, MenuItem, Snackbar, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { createCardHolder } from '../hooks/hooks.jsx';

const genderOptions = ['MALE', 'FEMALE'];
const documentTypeOptions = ['PASSPORT', 'NATIONAL_ID', 'DRIVERS_LICENSE'];


const validationSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  dateOfBirth: Yup.date().required('Date of birth is required'),
  gender: Yup.string().required('Gender is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  phone: Yup.string()
    .matches(/^\+?[1-9]\d{1,14}$/, 'Phone number is not valid')
    .required('Phone number is required'),
  address: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  country: Yup.string().required('Country is required'),
  zipCode: Yup.string()
    .matches(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format')
    .required('ZIP code is required'),
  documentType: Yup.string().required('Document type is required'),
  documentNumber: Yup.string().required('Document number is required'),
  idFrontUrl: Yup.string().url('Invalid URL format').required('idFrontUrl is required'),
  idBackUrl: Yup.string().url('Invalid URL format').required('idBackUrl is required'),
  idSelfieUrl: Yup.string().url('Invalid URL format').required('idSelfieUrl is required'),
});


const CreateCardHolder = () => {
    const [countries, setCountries] = useState([]);
    const [snackbar, setSnackbar] = React.useState({
        open: false,
        message: '',
        severity: 'success', // 'error' | 'warning' | 'info'
        });

  const [loading, setLoading] = useState(false);
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
      mutationFn: createCardHolder, // Ensure `createNews` is a function
      onSuccess: (response) => {
        setLoading(false)
        const message = response.message
        setSnackbar({ open: true, message: message, severity: 'success' });
        // setTimeout(() => navigate('/login'), 2000); // Delay navigation to allow toast display
      },
      onError: (error) => {
        // console.log('Error:', error);
        setLoading(false)
        setSnackbar({ open: true, message: error.response.data.message || 'Cardholder creation failed', severity: 'error' });
      }
  });

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            gender: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            state: '',
            country: '',
            zipCode:'',
            documentType: '',
            documentNumber: '',
            idFrontUrl: '',
            idBackUrl: '',
            idSelfieUrl: '',
            
        },
        validationSchema,
        onSubmit: (values) =>{ 
            setLoading(true)
            mutation.mutate(values)
        }
        
        }); 
  return (
   <Box sx={{
      margin:2
    }}>
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
      <Box maxWidth={400} sx={{
      bgcolor:"#fff",
      p:2,
      py:3,
      }}>
        <Typography variant="h5"  mb={2} sx={{
            fontSize:20,
            fontWeight:700,
            color:"#212121",

        }}>
            Secure Cardholder Setup
        </Typography>
        <Typography variant="body1" mb={3} sx={{
            fontSize:14,
            fontWeight:500,
            color:"#616161",
            // textAlign:"center",
            marginBottom:2,   
        }}>
           Fill in the details to register a new cardholder for secure transactions.
        </Typography>
        <form onSubmit={formik.handleSubmit}>
            {[
        'firstName',
        'lastName',
        'dateOfBirth',
        'gender',
        'email',
        'phone',
        'address',
        'city',
        'state',
        'country',
        'zipCode',
        'documentType',
        'documentNumber',
        'idFrontUrl',
        'idBackUrl',
        'idSelfieUrl'
        ].map((key) => (
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
                <MenuItem
                sx={{
                        fontSize:12,
                        fontWeight:500,
                        padding: '8px 16px',
                    }}
                 value="" disabled>Select Gender</MenuItem>
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
            ) : key === 'country' ? (
            <TextField
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
                    <MenuItem key={country.code} value={country.code}
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
                </TextField>): key === 'documentType' ? (
                    <TextField
                        size='small'
                        select
                        fullWidth
                        label="Document Type"
                        name="documentType"
                        value={formik.values.documentType}
                        onChange={formik.handleChange}
                        error={formik.touched.documentType && Boolean(formik.errors.documentType)}
                        helperText={formik.touched.documentType && formik.errors.documentType}
                        InputLabelProps={{
                            sx: {
                            color: "#555",
                            fontSize: 12,
                            transition: "color 0.3s ease",
                            "&:hover": { color: "#333" },
                            "&.Mui-focused": {
                                color: "#212121",
                                textTransform: "uppercase",
                                fontWeight: 500
                            }
                            }
                        }}
                        inputProps={{
                            sx: {
                            fontSize: 10,
                            color: "#333",
                            "&::placeholder": {
                                color: "#aaa",
                                fontSize: 12
                            }
                            }
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                            borderRadius: "2px",
                            "&.Mui-focused fieldset": {
                                borderColor: "#212121",
                                borderRadius: "2px"
                            }
                            },
                            '& .MuiFormHelperText-root': {
                            fontSize: 10,
                            color: 'error.main',
                            textTransform: "capitalize"
                            }
                        }}
                        SelectProps={{
                            MenuProps: {
                            PaperProps: {
                                style: {
                                borderRadius: "1px",
                                maxHeight: 200,
                                marginTop: 8,
                                boxShadow: 'none',
                                border: '1px solid #e0e0e0',
                                fontSize: 12
                                }
                            }
                            }
                        }}
                        displayEmpty
                        >
                        <MenuItem value="" disabled sx={{
                            fontSize: 12,
                            fontWeight: 500,
                            padding: '8px 16px'
                        }}>
                            Select Document Type
                        </MenuItem>
                        {documentTypeOptions.map((option) => (
                            <MenuItem
                            key={option}
                            value={option}
                            sx={{
                                fontSize: 12,
                                fontWeight: 500,
                                padding: '8px 16px',
                                '&:hover': {
                                backgroundColor: 'rgb(255, 184, 190)'
                                },
                                '&.Mui-selected': {
                                backgroundColor: 'rgb(221, 24, 73)'
                                }
                            }}
                            >
                            {option}
                            </MenuItem>
                        ))}
                        </TextField>
                ): (
                <TextField
            size='small'
                fullWidth
                type={key === 'dateOfBirth' ? 'date' : key.includes('password') ? 'password' : 'text'}
                label={key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                name={key}
                value={formik.values[key]}
                onChange={formik.handleChange}
                error={formik.touched[key] && Boolean(formik.errors[key])}
                helperText={formik.touched[key] && formik.errors[key]}
                // InputProps={{
                //     startAdornment: <InputAdornment position="start">{iconMap[key]}</InputAdornment>,
                // }}
                InputLabelProps={key === 'dateOfBirth' ? { shrink: true,
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
        
        <Button
        disabled={loading}
        sx={{
        borderRadius: "1px",
        textTransform: 'uppercase',
        // py: 1.5,
        fontSize: 12,
        fontWeight:600,
        boxShadow:0,
        backgroundColor:"#D32F2F",                  
        "&:hover": {
            boxShadow: "none",
        },
        }} variant="contained" type="submit" fullWidth>
            Create CardHolder
        </Button>
        </form>
        
      </Box>
    </Box>
  )
}

export default CreateCardHolder