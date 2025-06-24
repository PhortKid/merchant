import { Box, TextField, Typography, Select, MenuItem, Button, Snackbar, Alert } from '@mui/material';
import { useFormik } from 'formik';
import React, { useState } from 'react'
import * as Yup from 'yup';
import { margin } from '../../node_modules/@mui/system/esm/spacing/spacing';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { eventCreate } from '../hooks/hooks.jsx';

const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

const eventValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Event name is required'),

  currency: Yup.string()
    .oneOf(['TZS', 'USD', 'EUR'], 'Unsupported currency')
    .required('Currency is required'),

  price: Yup.number()
    .typeError('Price must be a number')
    .min(0, 'Price must be a positive value')
    .required('Price is required'),

  location: Yup.string()
    .required('Location is required'),

  event_type: Yup.string()
    .oneOf(['physical', 'online'], 'Invalid event type')
    .required('Event type is required'),

  date: Yup.date()
    .required('Date is required')
    .min(new Date(), 'Date cannot be in the past'),

  time: Yup.string()
  .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time must be in HH:MM format')
  .required('Time is required'),

  capacity: Yup.number()
    .typeError('Capacity must be a number')
    .integer('Capacity must be an integer')
    .min(1, 'Capacity must be at least 1')
    .required('Capacity is required'),

  cover_image: Yup
    .mixed()
    .required('Cover image is required')
    .test(
      'fileType',
      'Unsupported file format',
      value => value && SUPPORTED_IMAGE_TYPES.includes(value.type)
    ),

  description: Yup.string()
    .required('Description is required'),

  category: Yup.string()
    .required('Category is required'),
});


const NewEvent = () => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const CURRENCY_TYPE_CHOICES = [
        ['USD', 'USD'],
        ['TZS', 'TZS'],
        ['KES', 'KES'],
        ['UGX', 'UGX'],
        ['ZMW', 'ZMW'],
    ];

    const mutation = useMutation({
        mutationFn: eventCreate,
        onSuccess: () => {
            queryClient.invalidateQueries('event');
            setLoading(false)
            setSnackbarMessage("Event created successfully!");
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            formik.resetForm()
        },
        onError: (error) => {
            setLoading(false)
            let message = 'Unexpected error occurred. Please try again later or contact support.';
                if (error.response && error.response.data) {
                const data = error.response.data;

                // Pick first available message from known fields or fallback
                message = data.message|| Object.values(data)[0] || message;
            }

            setSnackbarMessage(message);
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
        });
    

      const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
      };

  const formik = useFormik({
    initialValues: {
      name: '',
      currency: '',
      price: '',
      location: '',
      event_type: '',
      date: '',  // Add this line
      time: '',
      capacity: '',
      cover_image: null,
      description: '',
      category: '',
    },
    validationSchema: eventValidationSchema,
    onSubmit: (values) => {
        setLoading(true)
        mutation.mutate(values)
    },
  });
  return (
    <Box sx={{
      margin:2
    }}>
        <Box maxWidth={500} sx={{
      p:2,
      position:"relative"
      }}>
        {/* Snackbar for notifications */}
                <Snackbar
                  open={openSnackbar}
                  autoHideDuration={6000}
                  onClose={handleCloseSnackbar}
                  // anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                  sx={{ 
                      maxWidth: '100%',
                      position: 'static', // Disable fixed positioning
                      mt: 1, // Add margin to separate from other elements
                      mb: 2, // Optional: Add bottom margin
                  }}
                >
                  <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
                    {snackbarMessage}
                  </Alert>
                </Snackbar>
        <Typography variant="subtitle2" sx={{
            fontSize:12,textTransform:"uppercase",fontWeight: 600,
            color:"#212121",

        }} gutterBottom>
            Organize the Future
        </Typography>
        <Typography  sx={{
            fontSize:12,
            fontWeight:400,
            color:"#616161",
            marginBottom:2,   
        }} variant="body1">
            Power your event with innovation. Add your details and let's get started.
        </Typography>
        <form onSubmit={formik.handleSubmit}>
             <TextField
                margin="normal"
                name="name"
                label="Event Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={!!formik.errors.name && formik.touched.name}
                helperText={formik.touched.name && formik.errors.name}
                fullWidth
                size='small'
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

           <TextField
            margin="normal"
            name="currency"
            label="Currency"
            size="small"
            select
            value={formik.values.currency}
            onChange={formik.handleChange}
            error={!!formik.errors.currency && formik.touched.currency}
            helperText={formik.touched.currency && formik.errors.currency}
            fullWidth
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
                },
                },
            }}
            inputProps={{
                sx: {
                fontSize: 10,
                color: "#333",
                "&::placeholder": {
                    color: "#aaa",
                    fontSize: 12,
                },
                },
            }}
            sx={{
                '& .MuiOutlinedInput-root': {
                borderRadius: "2px",
                "&.Mui-focused fieldset": {
                    borderColor: "#212121",
                    borderRadius: "2px"
                },
                },
                '& .MuiFormHelperText-root': {
                fontSize: 10,
                color: 'error.main',
                textTransform: "capitalize"
                },
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
                    fontSize: 12,
                    },
                },
                },
            }}
            displayEmpty
            >
            <MenuItem disabled value="">
                <em>Select Currency</em>
            </MenuItem>
            {CURRENCY_TYPE_CHOICES.map(([code, label]) => (
                <MenuItem
                key={code}
                value={code}
                sx={{
                    fontSize: 12,
                    fontWeight: 500,
                    textTransform: "capitalize",
                    padding: "8px 16px",
                    "&:hover": {
                    backgroundColor: "rgb(255, 184, 190)",
                    },
                    "&.Mui-selected": {
                    backgroundColor: "rgb(221, 24, 73)",
                    color: "white",
                    },
                }}
                >
                {label}
                </MenuItem>
            ))}
            </TextField>


            <TextField
                margin="normal"
                name="price"
                label="Price"
                type="number"
                value={formik.values.price}
                onChange={formik.handleChange}
                error={!!formik.errors.price && formik.touched.price}
                helperText={formik.touched.price && formik.errors.price}
                fullWidth
                size='small'
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

            <TextField
                margin="normal"
                name="location"
                label="Location"
                value={formik.values.location}
                onChange={formik.handleChange}
                error={!!formik.errors.location && formik.touched.location}
                helperText={formik.touched.location && formik.errors.location}
                fullWidth
                size='small'
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

            <TextField
                margin="normal"
                name="event_type"
                label="Event Type"
                size='small'
                select
                value={formik.values.event_type}
                onChange={formik.handleChange}
                error={!!formik.errors.event_type && formik.touched.event_type}
                helperText={formik.touched.event_type && formik.errors.event_type}
                fullWidth InputLabelProps={{
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
                <MenuItem  sx={{
                            fontSize: 12,
                            fontWeight: 500,
                            textTransform: "capitalize",
                            padding: "8px 16px",
                            "&:hover": {
                              backgroundColor: "rgb(255, 184, 190)",
                            },
                            "&.Mui-selected": {
                              backgroundColor: "rgb(221, 24, 73)",
                              color: "white",
                            },
                          }} value="physical">Physical</MenuItem>
                <MenuItem  sx={{
                            fontSize: 12,
                            fontWeight: 500,
                            textTransform: "capitalize",
                            padding: "8px 16px",
                            "&:hover": {
                              backgroundColor: "rgb(255, 184, 190)",
                            },
                            "&.Mui-selected": {
                              backgroundColor: "rgb(221, 24, 73)",
                              color: "white",
                            },
                          }} value="online">Online</MenuItem>
            </TextField>
           <TextField
                type="date"
                size="small"
                margin="normal"
                fullWidth
                label="Date"
                name="date"
                value={formik.values.date}
                onChange={formik.handleChange}
                error={formik.touched.date && Boolean(formik.errors.date)}
                helperText={formik.touched.date && formik.errors.date}
                InputLabelProps={{
                    shrink: true,
                    sx: {
                    color: "#555",
                    fontSize: 12,
                    transition: "color 0.3s ease",
                    "&:hover": {
                        color: "#333"
                    },
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
                />
            <TextField
               type="time"
                placeholder="Select time"
                size="small"
                margin="normal"
                fullWidth
                label="Time"
                name="time"
                value={formik.values.time}
                onChange={formik.handleChange}
                error={formik.touched.time && Boolean(formik.errors.time)}
                helperText={formik.touched.time && formik.errors.time}
                InputLabelProps={{
                    shrink: true,
                    sx: {
                    color: "#555", // Default label color
                    fontSize: 12,
                    transition: "color 0.3s ease",
                    "&:hover": {
                        color: "#333"
                    },
                    "&.Mui-focused": {
                        color: "#212121",
                        textTransform: "uppercase",
                        fontWeight: 500
                    }
                    }
                }}
                inputProps={{
                    sx: {
                    fontSize: 10, // Field content size
                    color: "#333", // Field content color
                    "&::placeholder": {
                        color: "#aaa", // Placeholder color
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
            />

            <TextField
                margin="normal"
                name="capacity"
                label="Capacity"
                type="number"
                value={formik.values.capacity}
                onChange={formik.handleChange}
                error={!!formik.errors.capacity && formik.touched.capacity}
                helperText={formik.touched.capacity && formik.errors.capacity}
                fullWidth
                size='small'
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

            <Button
                margin="normal"
                variant="outlined"
                component="label"
                fullWidth
                sx={{
                    border:"1px solid #333",
                    color:"#333",
                    borderRadius:"2px",
                    fontSize:"12px"
                }}
            >
                Upload Cover Image
                <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                    formik.setFieldValue('cover_image', e.currentTarget.files[0]);
                }}
                />
            </Button>
            {formik.touched.cover_image && formik.errors.cover_image && (
                <Typography color="error" variant="caption">{formik.errors.cover_image}</Typography>
            )}

             {formik.values.cover_image && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1, fontSize: 10, }}>
                        SELECTED FILE: {formik.values.cover_image.name}
                      </Typography>
                      <img
                        src={URL.createObjectURL(formik.values.cover_image)}
                        alt="Preview"
                        style={{
                          maxWidth: '100%',
                          height: 'auto',
                          maxHeight: 400,
                          borderRadius: '2px',
                          boxShadow: 0,
                        }}
                      />
                    </Box>
                  )}

            <TextField
                margin="normal"
                name="description"
                label="Description"
                size='small'
                multiline
                rows={4}
                value={formik.values.description}
                onChange={formik.handleChange}
                error={!!formik.errors.description && formik.touched.description}
                helperText={formik.touched.description && formik.errors.description}
                fullWidth
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

            <TextField
                margin="normal"
                name="category"
                label="Category"
                value={formik.values.category}
                onChange={formik.handleChange}
                error={!!formik.errors.category && formik.touched.category}
                helperText={formik.touched.category && formik.errors.category}
                fullWidth
                size='small'
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

            <Button 
            disabled={loading}
            sx={{
              borderRadius: "3px",
             // textTransform: 'none',
              textTransform:"uppercase",
              fontSize: 12,
              fontWeight:600,
              boxShadow:0,
              backgroundColor:"#D32F2F",                  
              "&:hover": {
                  boxShadow: "none",
              },
              }} variant="contained" type="submit" fullWidth>
                {loading?"Creating..":"Create Event"}
            </Button>
        </form>
      </Box>
    </Box>
    // <Box component="form" onSubmit={formik.handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 400, mx: 'auto' }} encType="multipart/form-data">
    //   <Typography variant="h5" align="center">Create Event</Typography>

    //   <TextField
    //     name="name"
    //     label="Event Name"
    //     value={formik.values.name}
    //     onChange={formik.handleChange}
    //     error={!!formik.errors.name && formik.touched.name}
    //     helperText={formik.touched.name && formik.errors.name}
    //     fullWidth
    //   />

    //   <TextField
    //     name="currency"
    //     label="Currency"
    //     Select
    //     value={formik.values.currency}
    //     onChange={formik.handleChange}
    //     error={!!formik.errors.currency && formik.touched.currency}
    //     helperText={formik.touched.currency && formik.errors.currency}
    //     fullWidth
    //   >
    //     <MenuItem value="TZS">TZS</MenuItem>
    //     <MenuItem value="USD">USD</MenuItem>
    //     <MenuItem value="EUR">EUR</MenuItem>
    //   </TextField>

    //   <TextField
    //     name="price"
    //     label="Price"
    //     type="number"
    //     value={formik.values.price}
    //     onChange={formik.handleChange}
    //     error={!!formik.errors.price && formik.touched.price}
    //     helperText={formik.touched.price && formik.errors.price}
    //     fullWidth
    //   />

    //   <TextField
    //     name="location"
    //     label="Location"
    //     value={formik.values.location}
    //     onChange={formik.handleChange}
    //     error={!!formik.errors.location && formik.touched.location}
    //     helperText={formik.touched.location && formik.errors.location}
    //     fullWidth
    //   />

    //   <TextField
    //     name="event_type"
    //     label="Event Type"
    //     select
    //     value={formik.values.event_type}
    //     onChange={formik.handleChange}
    //     error={!!formik.errors.event_type && formik.touched.event_type}
    //     helperText={formik.touched.event_type && formik.errors.event_type}
    //     fullWidth
    //   >
    //     <MenuItem value="physical">Physical</MenuItem>
    //     <MenuItem value="virtual">Virtual</MenuItem>
    //     <MenuItem value="hybrid">Hybrid</MenuItem>
    //   </TextField>

    //   <TextField
    //     name="time"
    //     label="Time"
    //     type="time"
    //     value={formik.values.time}
    //     onChange={formik.handleChange}
    //     error={!!formik.errors.time && formik.touched.time}
    //     helperText={formik.touched.time && formik.errors.time}
    //     fullWidth
    //     InputLabelProps={{ shrink: true }}
    //   />

    //   <TextField
    //     name="capacity"
    //     label="Capacity"
    //     type="number"
    //     value={formik.values.capacity}
    //     onChange={formik.handleChange}
    //     error={!!formik.errors.capacity && formik.touched.capacity}
    //     helperText={formik.touched.capacity && formik.errors.capacity}
    //     fullWidth
    //   />

    //   <Button
    //     variant="outlined"
    //     component="label"
    //     fullWidth
    //   >
    //     Upload Cover Image
    //     <input
    //       type="file"
    //       accept="image/*"
    //       hidden
    //       onChange={(e) => {
    //         formik.setFieldValue('cover_image', e.currentTarget.files[0]);
    //       }}
    //     />
    //   </Button>
    //   {formik.touched.cover_image && formik.errors.cover_image && (
    //     <Typography color="error" variant="caption">{formik.errors.cover_image}</Typography>
    //   )}

    //   <TextField
    //     name="description"
    //     label="Description"
    //     multiline
    //     rows={4}
    //     value={formik.values.description}
    //     onChange={formik.handleChange}
    //     error={!!formik.errors.description && formik.touched.description}
    //     helperText={formik.touched.description && formik.errors.description}
    //     fullWidth
    //   />

    //   <TextField
    //     name="category"
    //     label="Category"
    //     value={formik.values.category}
    //     onChange={formik.handleChange}
    //     error={!!formik.errors.category && formik.touched.category}
    //     helperText={formik.touched.category && formik.errors.category}
    //     fullWidth
    //   />

    //   <Button variant="contained" type="submit" color="primary" fullWidth>
    //     Submit Event
    //   </Button>
    // </Box>
  )
}

export default NewEvent
