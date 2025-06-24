import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react'
import { updatePin } from '../hooks/hooks.jsx';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Alert, Box, Button, Container, Snackbar, TextField, Typography } from '@mui/material';

const pinSchema = Yup.object().shape({
  old_pin: Yup.string()
    .required('Current PIN is required')
    .matches(/^\d{4}$/, 'Current PIN must be 4 digits'),

  new_pin: Yup.string()
    .required('New PIN is required')
    .matches(/^\d{4}$/, 'New PIN must be 4 digits')
    .notOneOf([Yup.ref('current_pin')], 'New PIN must be different from current PIN'),

  confirm_pin: Yup.string()
    .required('Confirm PIN is required')
    .oneOf([Yup.ref('new_pin')], 'Confirm PIN must match new PIN'),
});


const Pin = () => {
    const userDataString = localStorage.getItem('userData'); // <--- moved inside function
    const userData = JSON.parse(userDataString);
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const mutation = useMutation({
       mutationFn: updatePin,
       onSuccess: () => {
         queryClient.invalidateQueries('pin');
         setLoading(false)
         setSnackbarMessage("Pin changed successfully!");
         setSnackbarSeverity('success');
         setOpenSnackbar(true);
       },
       onError: (error) => {
         console.log('Error updating:', error);
         setLoading(false)
         setSnackbarMessage('Failed to change pin. Please try again.');
         setSnackbarSeverity('error');
         setOpenSnackbar(true);
       }
     });

     const handleCloseSnackbar = () => {
       setOpenSnackbar(false);
     };

     const formik = useFormik({
        initialValues: {
            old_pin: "",
            new_pin: "",
            confirm_pin: "",
        },
        pinSchema,
        onSubmit: (values) => {
            setLoading(true)
            mutation.mutate(values)
            // You can send this data to your backend via Axios/fetch here
        }
        });
  return (
    <Box sx={{
      margin:2
    }}>
      <Box maxWidth={400} sx={{
      p:2,
      }}>
        <Typography variant="subtitle2" sx={{
            fontSize:12,textTransform:"uppercase",fontWeight: 600,
            color:"#212121",

        }} gutterBottom>
          Update Security PIN
        </Typography>
        <Typography  sx={{
            fontSize:12,
            fontWeight:400,
            color:"#616161",
            marginBottom:2,  
        }} variant="body1">
           Keep your PIN confidential and change it often.
        </Typography>
        <form onSubmit={formik.handleSubmit}>
            <TextField
              type='password'
              placeholder='Enter current PIN'
              size='small'
              margin='normal'
              fullWidth
              label="Old pin"
              name="old_pin"
              value={formik.values.old_pin}
              onChange={formik.handleChange}
              error={formik.touched.old_pin && Boolean(formik.errors.old_pin)}
              helperText={formik.touched.old_pin && formik.errors.old_pin}
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
            type='password'
              placeholder='Enter new PIN'
              size='small'
              margin='normal'
              fullWidth
              label="New pin"
              name="new_pin"
              value={formik.values.new_pin}
              onChange={formik.handleChange}
              error={formik.touched.new_pin && Boolean(formik.errors.new_pin)}
              helperText={formik.touched.new_pin && formik.errors.new_pin}
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
            type='password'
              size='small'
              margin='normal'
              fullWidth
              label="Confirm pin"
              name="confirm_pin"
              value={formik.values.confirm_pin}
              onChange={formik.handleChange}
              error={formik.touched.confirm_pin && Boolean(formik.errors.confirm_pin)}
              helperText={formik.touched.confirm_pin && formik.errors.confirm_pin}
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
            
              <Button variant="contained" fullWidth type="submit"
              
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
              }}>
                {loading?"Changing...":"Change pin"}   
              </Button>
            </form>
            
      </Box>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Pin
