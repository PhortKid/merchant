import React, { useState } from 'react';
import {
  Box, Button, TextField, Typography, Paper, Snackbar, Alert
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { LoginReq } from '../hooks/hooks.jsx';


const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const { login } = useAuth();
  const mutation = useMutation({
      mutationFn: LoginReq, // Ensure `createNews` is a function
      onSuccess: (response) => {
          setLoading(false)
          setSnackbar({ open: true, message: 'Login successful!', severity: 'success' });
          localStorage.setItem('userData', JSON.stringify(response));
          login(); // update context + localStorage
          setTimeout(() => navigate('/dashboard'), 2000);
      },
      onError: (error) => {
        setLoading(false) 
        let message = 'Login failed';
        if (error.response && error.response.data) {
          const data = error.response.data;

          // Pick first available message from known fields or fallback
          message = data.email || data.password || Object.values(data)[0] || message;
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
      password: '',
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
            🔐 Gateway Authentication
        </Typography>
        <Typography variant="body1" textAlign="center" mb={3} sx={{
            fontSize:14,
            fontWeight:500,
            color:"#616161",
            textAlign:"center",
            marginBottom:2,   
        }}>
           Access your payment integrations & transaction logs
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
          <Box mb={2}>
            <TextField
            size='small'
              fullWidth
              type="password"
              label="Password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password} InputLabelProps={{
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
                    fontSize: 14,
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
              placeholder="Enter your password"
            />
          </Box>
          <Box mt={2} mb={2} textAlign="center">
            <Typography variant="body2" sx={{
                    // py: 1.5,
                    fontSize: 14,
                    fontWeight:400,
                    }}>
              <Link to="/forgot-password" style={{ color: '#D32F2F', fontWeight: 500 }}>
                Forgot password?
              </Link>
            </Typography>
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
          <Box mt={2} textAlign="center">
            <Typography variant="body2" sx={{
                    // py: 1.5,
                    fontSize: 14,
                    fontWeight:400,
                    }}>
              Don’t have an account?{' '}
              <Link to="/registration" style={{ color: '#D32F2F', fontWeight: 500 }}>
                Register
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
