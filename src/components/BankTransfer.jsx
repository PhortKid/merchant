import { Alert, Box, Button, Dialog, IconButton, MenuItem, Paper, Snackbar, TextField, Typography, useTheme } from '@mui/material'
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { bankTransfer } from '../hooks/hooks.jsx';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ArrowBack, Info } from '@mui/icons-material';

const validationSchema = Yup.object().shape({
  amount: Yup.number()
    .typeError('Amount must be a number')
    .positive('Amount must be greater than zero')
    .required('Amount is required'),
  swiftCode: Yup.string()
    .required('Swift code is required'),
  accountNumber: Yup.string()
    .matches(/^\d{10,20}$/, 'Account number must be between 10 and 20 digits')
    .required('Account number is required'),
  narration: Yup.string()
    .max(100, 'Narration must be 100 characters or less')
    .required('Narration is required'),
  recipientNames: Yup.string()
    .matches(/^[A-Za-z\s]+$/, 'Recipient name must contain only letters')
    .required('Recipient name is required'),
});

 const bankSwiftCodes = [
  { name: "NMB Bank Plc", swiftCode: "NMIBTZTZ" },
  { name: "CRDB Bank Plc", swiftCode: "CORUTZTZ" },
  { name: "NBC (National Bank of Commerce)", swiftCode: "NLCBTZTX" },
  { name: "Exim Bank Tanzania", swiftCode: "EXTNTZTZ" },
  { name: "Absa Bank Tanzania", swiftCode: "BARCTZTZ" },
  { name: "Stanbic Bank Tanzania", swiftCode: "SBICTZTZ" },
  { name: "Diamond Trust Bank (DTB)", swiftCode: "DTKETZTZ" },
  { name: "Citibank Tanzania", swiftCode: "CITITZTZ" },
  { name: "Equity Bank Tanzania", swiftCode: "EQBLTZTZ" },
];



const BankTransfer = ({setShowScreen}) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [loading, setLoading] = useState(false)
    const [transactionDetails, setTransactionDetails] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [snackbar, setSnackbar] = React.useState({
      open: false,
      message: '',
      severity: 'success',
    });

    const mutation = useMutation({
        mutationFn: bankTransfer, // Ensure `createNews` is a function
        onSuccess: (response) => {
            setLoading(false)
            setSnackbar({ open: true, message: 'Your bank transfer request was successful.', severity: 'success' }); // For demo purposes, we'll use the dummy data
            setTransactionDetails(response);
            formik.resetForm();
            // setTimeout(() => setOpenDialog(true), 3001);
            
        },
        onError: (error) => {
          setLoading(false)
          setSnackbar({ open: true, message:'Unable to process your bank transfer. Please try again later.', severity: 'error' });
        }
    });

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setTimeout(() => navigate('/dashboard'), 500);
      };
  

       const formik = useFormik({
            initialValues:  {
                amount: '',
                swiftCode: '',
                accountNumber: '',
                narration: '',
                recipientNames: '',
            },
            validationSchema,
            onSubmit: values => {
                setLoading(true)
                const msisdn = `${values.swiftCode}:${values.accountNumber}`;
                const finalPayload = {
                    amount: values.amount,
                    msisdn,
                    narration: values.narration,
                    recipientNames: values.recipientNames,
                };
                mutation.mutate(finalPayload);
                // console.log('Submitting: ', finalPayload);
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
                mb:3
            }}>
                <IconButton
                onClick={() => setShowScreen(false)}
                >
                <ArrowBack/>
                </IconButton>
            </Box>
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

                    }}  gutterBottom>Easy Bank Transfer</Typography>
                <Typography variant="body1" sx={{
                        fontSize:12,
                        fontWeight:500,
                        color:"#616161",
                        marginBottom:3,   
                    }}  gutterBottom>Just enter the details and we’ll handle the rest securely.</Typography>
                <form onSubmit={formik.handleSubmit}>
                    <Box mb={2}>
                        <TextField
                            size='small'
                            type="number"
                            fullWidth
                            label="Amount"
                            name="amount"
                            value={formik.values.amount}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.amount && Boolean(formik.errors.amount)}
                            helperText={formik.touched.amount && formik.errors.amount} InputLabelProps={{
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
                        <Box mb={2}>
                        <TextField
                            select
                            size='small'
                            type="text"
                            fullWidth
                            label="swiftCode"
                            name="swiftCode"
                            value={formik.values.swiftCode}
                            onChange={formik.handleChange}
                            error={formik.touched.swiftCode && Boolean(formik.errors.swiftCode)}
                            helperText={formik.touched.swiftCode && formik.errors.swiftCode} 
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
                            {bankSwiftCodes.map((item) => (
                                <MenuItem key={item.swiftCode} value={item.swiftCode}
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
                                    {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            style={{ width: 20, height: 20, borderRadius: '50%' }}
                                        /> */}
                                        {item.name}
                                    {/* </Box> */}
                                </MenuItem>
                            ))}
                        </TextField>
                        </Box>
                        <Box mb={2}>
                        <TextField
                        size='small'
                            fullWidth
                            label="accountNumber"
                            name="accountNumber"
                            value={formik.values.accountNumber}
                            onChange={formik.handleChange}
                            error={formik.touched.accountNumber && Boolean(formik.errors.accountNumber)}
                            helperText={formik.touched.accountNumber && formik.errors.accountNumber} InputLabelProps={{
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
                            placeholder="Enter your accountNumber"
                        />
                        </Box>
                        <Box mb={2}>
                        <TextField
                            size='small'
                            fullWidth
                            label="narration"
                            name="narration"
                            value={formik.values.narration}
                            onChange={formik.handleChange}
                            error={formik.touched.narration && Boolean(formik.errors.narration)}
                            helperText={formik.touched.narration && formik.errors.narration} InputLabelProps={{
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
                            placeholder="Enter your narration"
                        />
                        </Box>
                        <Box mb={2}>
                        <TextField
                            size='small'
                            fullWidth
                            label="recipientNames"
                            name="recipientNames"
                            value={formik.values.recipientNames}
                            onChange={formik.handleChange}
                            error={formik.touched.recipientNames && Boolean(formik.errors.recipientNames)}
                            helperText={formik.touched.recipientNames && formik.errors.recipientNames} InputLabelProps={{
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
                            placeholder="Enter your narration"
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
                        {loading?"Transfering...":"Make Transfer"}
                        </Button>

                         <Box sx={{ mt: 3 }}>
                            <Paper 
                                elevation={0}
                                sx={{
                                padding: 2,
                                backgroundColor: "#e6f7ff",
                                borderLeft: `4px solid ${theme.palette.info.main}`,
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 1,
                                borderRadius:"1px"
                                }}
                            >
                                <Info color="info" />
                                <Typography variant="body2" sx={{
                                    color:theme.palette.info.main,
                                    fontWeight:500
                                }}>
                                A fee of 5,000 TZS will be charged for any bank transactions.
                                </Typography>
                            </Paper>
                        </Box>
                </form>
            </Box>
            </Box>
    </Box>
  )
}

export default BankTransfer
