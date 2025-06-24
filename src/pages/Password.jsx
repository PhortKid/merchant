import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import React, { useState } from 'react'
import { updatePassword } from '../hooks/hooks.jsx';
import { Alert, Box, Button, Container, Snackbar, TextField, Typography } from '@mui/material';

const passwordSchema = Yup.object().shape({
    old_password: Yup.string()
      .required('Old password is required'),
  
    new_password: Yup.string()
      .required('New password is required')
      .min(8, 'Password must be at least 8 characters long')
      .matches(/[a-z]/, 'Must contain at least one lowercase letter')
      .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
      .matches(/[0-9]/, 'Must contain at least one number'),
  });

const Password = () => {
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const mutation = useMutation({
         mutationFn: updatePassword,
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
              old_password: "",
              new_password: "",
          },
          passwordSchema,
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
          Strengthen Your Security
        </Typography>
        <Typography  sx={{
            fontSize:12,
            fontWeight:400,
            color:"#616161",
            marginBottom:2,   
        }} variant="body1">
           Regularly updating your password helps protect your account.
        </Typography>
        <form onSubmit={formik.handleSubmit}>
            <TextField
              type='password'
              placeholder='Enter old/current password'
              size='small'
              margin='normal'
              fullWidth
              label="old password"
              name="old_password"
              value={formik.values.old_password}
              onChange={formik.handleChange}
              error={formik.touched.old_password && Boolean(formik.errors.old_password)}
              helperText={formik.touched.old_password && formik.errors.old_password}
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
              placeholder='Enter new password'
              size='small'
              margin='normal'
              fullWidth
              label="New password"
              name="new_password"
              value={formik.values.new_password}
              onChange={formik.handleChange}
              error={formik.touched.new_password && Boolean(formik.errors.new_password)}
              helperText={formik.touched.new_password && formik.errors.new_password}
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
            //  textTransform: 'none',
              textTransform:"uppercase",
              fontSize: 12,
              fontWeight:600,
              boxShadow:0,
              backgroundColor:"#D32F2F",                  
              "&:hover": {
                  boxShadow: "none",
              },
              }}>
                {loading?"Changing...":"Change password"}   
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

export default Password
