import React, { useState } from 'react'
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import { useFormik } from 'formik';
import { Alert, Box, Button, Snackbar, TextField, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { receivePayments } from '../hooks/hooks.jsx';

const OrderSchema = Yup.object().shape({
  buyer_phone: Yup.string()
    .matches(/^0\d{9}$/, 'Phone must be 10 digits starting with 0')
    .required('Phone is required'),
  amount: Yup.number()
    .typeError('Amount must be a number')
    .positive('Amount must be positive')
    .required('Amount is required'),
});

const CONSTANT_BUYER_EMAIL = 'merchant@zenopay.net';
const CONSTANT_BUYER_NAME = 'ZenoPay Merchants';

const ReceivePayments = () => {
    const [loading, setLoading] = useState(false)
    
    const [snackbar, setSnackbar] = React.useState({
        open: false,
        message: '',
        severity: 'success',
    });

    const mutation = useMutation({
            mutationFn: receivePayments, // Ensure `createNews` is a function
            onSuccess: (response) => {
                setLoading(false)
                setSnackbar({ open: true, message: 'Your order request was successful.', severity: 'success' }); // For demo purposes, we'll use the dummy data
                // setTransactionDetails(response);
                formik.resetForm();
                // setTimeout(() => setOpenDialog(true), 3001);
                
            },
            onError: (error) => {
              setLoading(false)
              setSnackbar({ open: true, message:'Unable to process your order request. Please try again later.', severity: 'error' });
            }
        });

    const formik = useFormik({
    initialValues: {
        buyer_phone: '',
        amount: '',
    },
    validationSchema: OrderSchema,
    onSubmit: (values) => {
        setLoading(true)
        const orderData = {
        order_id: uuidv4(),
        buyer_email: CONSTANT_BUYER_EMAIL,
        buyer_name: CONSTANT_BUYER_NAME,
        ...values,
        };
        mutation.mutate(orderData);
        // console.log('Order Submitted:', orderData);
        // Send `orderData` to backend
    },
    });
  return (
    <Box sx={{
      margin:2
    }}>
        <Box maxWidth={500} sx={{
            bgcolor:"#fff",
            p:2,
            }}>
            <Box sx={{
                position: 'relative'
            }}>
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    // anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
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
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
                <Typography variant="h4" sx={{
                        fontSize:12,
                        fontWeight:600,
                        color:"#212121",
                        textTransform: "uppercase" 

                    }}  gutterBottom>Let's Get Paid!</Typography>
                <Typography variant="body1" sx={{
                        fontSize:12,
                        fontWeight:500,
                        color:"#616161",
                        marginBottom:3,   
                    }}  gutterBottom>Just enter the buyer’s number and amount — we’ll handle the rest like magic.</Typography>
                <form onSubmit={formik.handleSubmit}>
                    <Box mb={2}>
                        <TextField
                            size='small'
                            fullWidth
                            // margin="normal"
                            id="buyer_phone"
                            name="buyer_phone"
                            label="Buyer Phone"
                            value={formik.values.buyer_phone}
                            onChange={formik.handleChange}
                            error={formik.touched.buyer_phone && Boolean(formik.errors.buyer_phone)}
                            helperText={formik.touched.buyer_phone && formik.errors.buyer_phone}
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
                            placeholder="Enter buyer phone number"
                        />
                        </Box>
                        <Box mb={2}>
                        <TextField
                            size='small'
                            fullWidth
                            // margin="normal"
                            id="Amount"
                            name="amount"
                            label="Amount"
                            type="number"
                            value={formik.values.amount}
                            onChange={formik.handleChange}
                            error={formik.touched.amount && Boolean(formik.errors.amount)}
                            helperText={formik.touched.amount && formik.errors.amount}
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
                            placeholder="Enter amount"
                        />
                        </Box>
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
                        {loading?"Sending...":"Send Order"}
                        </Button>
                </form>
            </Box>
            </Box>

    </Box>
  )
}

export default ReceivePayments
