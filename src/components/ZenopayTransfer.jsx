import React, { useState } from 'react';
import {
  Container, Typography, Box, TextField, Button, CircularProgress, Alert,
  Snackbar,
  IconButton,
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { initiateTransfer } from '../hooks/hooks.jsx';
import { ArrowBack } from '@mui/icons-material';
import ZenoTransferConfirm from './ZenoTransferConfirm.jsx';

const InitiateSchema = Yup.object().shape({
  recipient_account_id: Yup.string().required('Recipient account is required'),
  amount: Yup.number().required('Amount is required').min(1),
  note: Yup.string(),
});

const ConfirmSchema = Yup.object().shape({
  pin: Yup.string().length(4, 'PIN must be 4 digits').required('PIN is required'),
});

const ZenopayTransfer = ({setShowScreen}) => {
  const [transferData, setTransferData] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [isLoading, setIsLoading] = useState(false)

  const handleSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const {
    mutate: initiate,
  } = useMutation({
    mutationFn:initiateTransfer,
    onSuccess: (data) => {
        setIsLoading(false)
      setTransferData(data);
      handleSnackbar(data.message, 'info');
    },
    onError: (error) => {
        setIsLoading(false)
      handleSnackbar(error.response?.data?.message || 'Failed to initiate transfer', 'error');
    },
});


  return ( 
    <Box sx={{
      margin:2
    }}>
         <Box maxWidth={500} 
         sx={{
            p:2,
            position:"relative"
        }}
         >
            <Box sx={{
                mb:3
            }}>
                <IconButton
                onClick={() => setShowScreen(false)}
                >
                <ArrowBack/>
                </IconButton>
            </Box>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                // anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                 sx={{ 
                    maxWidth: '100%',
                    position: 'static', // Disable fixed positioning
                    mt: 1, // Add margin to separate from other elements
                    mb: 2, // Optional: Add bottom margin
                }}
            >
                <Alert
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                severity={snackbar.severity}
                sx={{ width: '100%' }}
                >
                {snackbar.message}
                </Alert>
            </Snackbar>
            <Typography variant="subtitle2" sx={{
                fontSize:12,textTransform:"uppercase",fontWeight: 600,
                color:"#212121",
    
            }} gutterBottom>
                ZenoPay → ZenoPay
            </Typography>
            <Typography  sx={{
                fontSize:12,
                fontWeight:400,
                color:"#616161",
                marginBottom:2,   
            }} variant="body1">
                Transfer funds quickly and securely to other ZenoPay accounts. It's fast, safe, and easy — no bank needed.
            </Typography>
            <Typography variant="h5" mb={3} sx={{
                fontSize:10,
                textTransform:"uppercase",
                color:"grey.500",
                fontWeight:600
            }}>
                {transferData ? 'Confirm Transfer with PIN' : 'Initiate Float Transfer'}
            </Typography>

            {!transferData ? (
                <Formik
                initialValues={{
                    recipient_account_id: '',
                    amount: '',
                    note: '',
                }}
                validationSchema={InitiateSchema}
                onSubmit={(values) => {
                        setIsLoading(true)
                        initiate(values);
                    }}
                >
                {({ errors, touched }) => (
                    <Form>
                    <Box mb={2}>
                        <Field
                        size="small"
                        name="recipient_account_id"
                        as={TextField}
                        fullWidth
                        label="Recipient Account ID"
                        error={touched.recipient_account_id && !!errors.recipient_account_id}
                        helperText={touched.recipient_account_id && errors.recipient_account_id}
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
                    <Box mb={2}>
                        <Field
                        size="small"
                        name="amount"
                        as={TextField}
                        fullWidth
                        label="Amount"
                        type="number"
                        error={touched.amount && !!errors.amount}
                        helperText={touched.amount && errors.amount}
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
                    <Box mb={2}>
                        <Field
                        size="small"
                        name="note"
                        as={TextField}
                        fullWidth
                        label="Note"
                        error={touched.note && !!errors.note}
                        helperText={touched.note && errors.note}
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
                    <Button type="submit" variant="contained" disabled={isLoading}
                        fullWidth
                        sx={{
                            borderRadius: "3px",
                            textTransform:"uppercase",
                            fontSize: 12,
                            fontWeight:600,
                            boxShadow:0,
                            backgroundColor:"#D32F2F",                  
                            "&:hover": {
                                boxShadow: "none",
                            },
                        }}
                    >
                        {isLoading? 'Initiating...' : 'Initiate Transfer'}
                    </Button>
                    </Form>
                )}
                </Formik>
            ) : (
                <ZenoTransferConfirm transferData={transferData} validationSchema = {ConfirmSchema} handleSnackbar={handleSnackbar}/>
            )}
            </Box>
    </Box>
 
  )
}

export default ZenopayTransfer
