import { Alert, Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, Snackbar, TextField, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import React, { useState } from 'react'
import * as Yup from 'yup';
import { ApiKeyGen } from '../hooks/hooks.jsx';
import { useNavigate } from 'react-router-dom';
import { ContentCopy } from '@mui/icons-material';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
});


const NewApiKey = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');  
    const [copiedKeyId, setCopiedKeyId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showNewKey, setShowNewKey] = useState(false);
    const [newKey, setNewKey] = useState('');
     const mutation = useMutation({
          mutationFn: ApiKeyGen,
          onSuccess: (response) => { 
            setLoading(false)           
            setNewKey(response.secret_key);
            setShowNewKey(true);
            setSnackbarMessage('API key created successfully');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            setTimeout(() => navigate('/dashboard'), 2000);
          },
          onError: (error) => {          
            // console.log('Error creating API key:', error);
            setLoading(false)   
            setSnackbarMessage('Failed to create API key');
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
            service_type: 'API',
            scopes: ['read', 'write']
        },
        validationSchema,
        onSubmit: (values) => {
          setLoading(true)
          mutation.mutate(values)
          // You can send this data to your backend via Axios/fetch here
        }
      });
   
  return (
    <Box  sx={{
        margin:2,
      }}>
        <Box maxWidth={500} sx={{
        p:2,
        position:"relative"
      }}>
        
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
            Generate Your API Key
        </Typography>
        <Typography  sx={{
            fontSize:12,
            fontWeight:400,
            color:"#616161",
            marginBottom:2,  
        }} variant="body1">
            Create a unique key to authenticate your API requests. Keep this key safe—it grants access to your account
        </Typography>
        <form onSubmit={formik.handleSubmit}>
        <TextField
            size='small'
            fullWidth
            label="Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            margin="normal"
            required
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
        variant="contained" fullWidth type="submit"
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
            {loading?"Creating...":"Create new api key"}
            </Button>
        </form>
        
      </Box>
            {/* New API Key Reveal Dialog */}
      <Dialog open={showNewKey} onClose={() => setShowNewKey(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{
            fontSize: 16,
            fontWeight: 600,
            color: "#212121",
            pb: 1, // Reduce padding to bring subtitle closer
          }}>New API Key Created</DialogTitle>
        <DialogContent>
          <Typography variant="body1" 
              sx={{
                display: "block",
                fontSize: 14,
                fontWeight: 500,
                color:"#616161",
                textTransform:"capitalize",
                mt: 0.5,
              }}>
            Please copy your API key now. You won't be able to see it again.
          </Typography>
          <TextField
          size='small'
            fullWidth
            value={newKey}
            margin="normal"
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
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      navigator.clipboard.writeText(newKey);
                      setSnackbarMessage('API key copied to clipboard');
                      setSnackbarSeverity('info');
                      setOpenSnackbar(true);
                    }}
                  >
                    <ContentCopy />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Alert severity="warning" sx={{ mt: 2 }}>
            Store this key securely. Treat it like a password.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowNewKey(false)}
            variant="contained"
            sx={{
            borderRadius: "1px",
            textTransform: 'uppercase',
            // py: 1.5,
            fontSize: 12,
            // fontWeight:600,
            boxShadow:0,
            backgroundColor:"#D32F2F",                  
            "&:hover": {
                boxShadow: "none",
            },
            }}
          >
            I've copied my key
          </Button>
        </DialogActions>
      </Dialog>

      </Box>
  )
}

export default NewApiKey