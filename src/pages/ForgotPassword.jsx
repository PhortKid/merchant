import React, { useState } from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { forgotPassword } from '../hooks/hooks.jsx';
import { Alert, Box, Button, Paper, Snackbar, TextField, Typography } from '@mui/material';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
});


const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const mutation = useMutation({
      mutationFn: forgotPassword, // Ensure `createNews` is a function
      onSuccess: (response) => {
          setLoading(false)
          setSnackbar({ open: true, message: 'Login successful!', severity: 'success' });
      },
      onError: (error) => {
        setLoading(false) 
        let message = 'Login failed';
        if (error.response && error.response.data) {
          const data = error.response.data;

          // Pick first available message from known fields or fallback
          message = data.message || Object.values(data)[0] || message;
        }
        
        setSnackbar({
          open: true,
          message,
          severity: 'error',
        });
      }
  });

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit: (values) => {
      setLoading(true)
      mutation.mutate(values)
    },
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
            🔐 Forgot Password?
        </Typography>
        <Typography variant="body1" textAlign="center" mb={3} sx={{
            fontSize:14,
            fontWeight:500,
            color:"#616161",
            textAlign:"center",
            marginBottom:2,   
        }}>
           No worries — we’ve got you covered.
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Box mb={2}>
            <TextField
            size='small'
              fullWidth
              label="Email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email} InputLabelProps={{
                sx: {
                  color: "#555", // Default label color
                  fontSize: 14,
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
                  fontSize: 14, // Field content size
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
                  fontSize: 14, // Smaller font size for validation errors
                  color: 'error.main', // Red color for errors
                  textTransform:"capitalize"
                },
              
              }}
              placeholder="Enter your email"
            />
          </Box>
          
          <Button 
          disabled={loading}
            sx={{
            borderRadius: "1px",
            textTransform: 'none',
            // py: 1.5,
            fontSize: 14,
            fontWeight:600,
            boxShadow:0,
            backgroundColor:"#D32F2F",                  
            "&:hover": {
                boxShadow: "none",
            },
            }} variant="contained" type="submit" fullWidth>
            {loading?"loading...":"Login"}
          </Button>

          <Box mt={2} mb={2} textAlign="center">
            <Typography variant="body2" sx={{
                    // py: 1.5,
                    fontSize: 14,
                    fontWeight:600,
                    textTransform:"capitalize"
                    }}>
              <Link to="/login" style={{ color: '#D32F2F', fontWeight: 500, textDecorationLine:"none" }}>
                Go back to login
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  )
}

export default ForgotPassword