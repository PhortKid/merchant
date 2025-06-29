import React, { useState } from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { utilityPays } from '../hooks/hooks.jsx';
import { Alert, Box, Button, Container, Dialog, DialogContent, Divider, IconButton, MenuItem, Snackbar, TextField, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import faviconJpg from '../assets/favicon.jpg';

const validationSchema = Yup.object({
    transid: Yup.string().required('Transaction ID is required'),
    utilitycode: Yup.string().required('Utility code is required'),
    utilityref: Yup.string().required('Utility Ref is required'),
    amount: Yup.number().required('Amount is required').positive('Amount must be positive'),
    pin: Yup.string().required('PIN is required'),
    msisdn: Yup.string().required('Phone number is required'),
  });

  const generateTransId = () => {
    const prefix = 'TFR';
    const random = Math.random().toString(36).substring(2, 10).toUpperCase();
    return prefix + random;
  };

  const utilityItems = [
    {
      name: 'LUKU',
      code: 'LUKU',
      image: faviconJpg,
    },
    {
      name: 'GEPG',
      code: 'GEPG',
      image: faviconJpg,
    },
    {
      name: 'TTCL',
      code: 'TTCL',
      image: faviconJpg,
    },
    {
      name: 'DSTV',
      code: 'DSTV',
      image: faviconJpg,
    },
    {
      name: 'AZAMTV',
      code: 'AZAMTV',
      image:faviconJpg,
    },
    {
      name: 'STARTIMES',
      code: 'STARTIMES',
      image: faviconJpg,
    },
    {
      name: 'ZUKU',
      code: 'ZUKU',
      image: faviconJpg,
    },
    {
      name: 'SMILE',
      code: 'SMILE',
      image: faviconJpg,
    },
    {
      name: 'ZUKUFIBER',
      code: 'ZUKUFIBER',
      image: faviconJpg,
    },
    {
      name: 'Airtime',
      code: 'TOP',
      image: faviconJpg,
    },
  ];

const UtilityPayments = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [transactionDetails, setTransactionDetails] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [snackbar, setSnackbar] = React.useState({
      open: false,
      message: '',
      severity: 'success',
    });

    const mutation = useMutation({
        mutationFn: utilityPays, // Ensure `createNews` is a function
        onSuccess: (response) => {
            setLoading(false)
            setSnackbar({ open: true, message: 'Your utility payment has been processed successfully.', severity: 'success' }); // For demo purposes, we'll use the dummy data
            setTransactionDetails(response);
            setTimeout(() => setOpenDialog(true), 3001);
            
        },
        onError: (error) => {
            console.log(error)
            setLoading(false)
            setSnackbar({ open: true, message:'Something went wrong. Please try again or check your payment details.', severity: 'error' });
        }
    });

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setTimeout(() => navigate('/dashboard'), 500);
      };

    const formik = useFormik({
        initialValues: {
            transid: generateTransId(),       // generates something like "AiO077XSTVM0"
            utilitycode: '',            // predefined utility code
            utilityref: '',                   // to be filled by user
            amount: '',                       // numeric input
            pin: '',                          // user PIN
            msisdn: '',                       // phone number (e.g., 255652449389)
            source_account: 'float'          // default source account
        },
        validationSchema,
        onSubmit: values => {
            setLoading(true)
            // console.log(values)
            mutation.mutate(values);
            },
        });


         const parseMessage = (message) => {
            return message.split('\n').map((line, index) => (
              <Typography sx={{
                fontSize:12
              }} key={index} variant="body2" gutterBottom>
                {line}
              </Typography>
            ));
          };
        
  return (
    <Box sx={{
        margin:2
    }}>
        <Box maxWidth={500}   sx={{
            bgcolor:"#fff",
            p:2,
            py:3
        }}>
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                {/* <DialogTitle sx={{ 
                bgcolor: 'success.main', 
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: 1
                }}>
                <CheckCircle fontSize="medium" />
                Transfer Successful
                </DialogTitle> */}
                <DialogContent sx={{ mt: 2 }}>
                {transactionDetails ? (
                    <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems:"center" }}>
                        <Typography variant="h6" sx={{
                            fontSize:14,
                            fontWeight:400,
                            textTransform:"uppercase"
                        }}>Transaction Receipt</Typography>
                        <IconButton
                            onClick={handleCloseDialog} color="error">
                            <Close/>
                        </IconButton>
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                    
                    {/* Parsed message from zenopay */}
                    <Box sx={{ 
                        bgcolor: 'grey.50', 
                        p: 2, 
                        borderRadius: "1px",
                        mb: 3,
                        borderLeft: '4px solid',
                        borderColor: '#D32F2F'
                    }}>
                        {parseMessage(transactionDetails.selcom_response.message)}
                    </Box>
                    
                    {/* Transaction details */}
                    <Typography variant="subtitle2" color="text.secondary" sx={{
                        fontWeight:600,
                        fontSize:12,
                        textTransform:"uppercase"
                    }} gutterBottom>
                        TRANSACTION DETAILS
                    </Typography>
                    
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                        <Box>
                        <Typography variant="body2" color="text.secondary" sx={{
                        fontWeight:400,
                        fontSize:12,
                        textTransform:"uppercase"
                    }}>Reference:</Typography>
                        <Typography variant="body1" sx={{
                        fontWeight:500,
                        fontSize:12,
                        textTransform:"uppercase"
                    }}>{transactionDetails.selcom_response.reference}</Typography>
                        </Box>
                        
                        <Box>
                        <Typography variant="body2" color="text.secondary" sx={{
                        fontWeight:400,
                        fontSize:12,
                        textTransform:"uppercase"
                    }}>Transaction ID:</Typography>
                        <Typography variant="body1" sx={{
                        fontWeight:500,
                        fontSize:12,
                        textTransform:"uppercase"
                    }}>{transactionDetails.selcom_response.transid}</Typography>
                        </Box>
                        
                        {/* <Box>
                        <Typography variant="body2" color="text.secondary" sx={{
                        fontWeight:400,
                        fontSize:12,
                        textTransform:"uppercase"
                    }}>Amount Sent:</Typography>
                        <Typography variant="body1" sx={{
                        fontWeight:500,
                        fontSize:12,
                        textTransform:"uppercase"
                    }}>
                            {transactionDetails.amount_sent_to_customer.toLocaleString()} TZS
                        </Typography>
                        </Box> */}
                        
                        {/* <Box>
                        <Typography variant="body2" color="text.secondary" sx={{
                        fontWeight:400,
                        fontSize:12,
                        textTransform:"uppercase"
                    }}>Fee:</Typography>
                        <Typography variant="body1" sx={{
                        fontWeight:500,
                        fontSize:12,
                        textTransform:"uppercase"
                    }}>
                            {transactionDetails.fee.toLocaleString()} TZS
                        </Typography>
                        </Box> */}
                        
                        {/* <Box>
                        <Typography variant="body2" color="text.secondary" sx={{
                        fontWeight:400,
                        fontSize:12,
                        textTransform:"uppercase"
                    }}>Total Deducted:</Typography>
                        <Typography variant="body1" sx={{
                        fontWeight:700,
                        fontSize:14,
                        textTransform:"uppercase"
                    }}>
                            {transactionDetails.total_deducted.toLocaleString()} TZS
                        </Typography>
                        </Box> */}
                        
                        {/* <Box>
                        <Typography variant="body2" color="text.secondary" sx={{
                        fontWeight:400,
                        fontSize:12,
                        textTransform:"uppercase"
                    }}>New Balance:</Typography>
                        <Typography variant="body1" sx={{
                        fontWeight:500,
                        fontSize:12,
                        textTransform:"uppercase"
                    }}>
                            {transactionDetails.new_balance} TZS
                        </Typography>
                        </Box> */}
                    </Box>
                    
                    {/* <Typography variant="caption" color="text.secondary">
                        Transaction completed on {new Date().toLocaleString()}
                    </Typography> */}
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <Typography>loading...</Typography>
                    </Box>
                )}
                </DialogContent>
            </Dialog>
            <Box sx={{
                position:"relative"
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
                        textTransform:"uppercase"

                    }}  gutterBottom>Pay Your Bill</Typography>
                <Typography variant="body1" sx={{
                        fontSize:12,
                        fontWeight:500,
                        color:"#616161",
                        marginBottom:3,   
                    }}  gutterBottom>Support for electricity, water, and more — all in one form.</Typography>
                <form onSubmit={formik.handleSubmit}>
                    <Box mb={2}>
                        <TextField
                            select
                            size='small'
                            type="text"
                            fullWidth
                            label="utilitycode"
                            name="utilitycode"
                            value={formik.values.utilitycode}
                            onChange={formik.handleChange}
                            error={formik.touched.utilitycode && Boolean(formik.errors.utilitycode)}
                            helperText={formik.touched.utilitycode && formik.errors.utilitycode} 
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
                            {utilityItems.map((item) => (
                                <MenuItem key={item.code} value={item.code}
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
                            type="text"
                            fullWidth
                            label="utilityref"
                            name="utilityref"
                            value={formik.values.utilityref}
                            onChange={formik.handleChange}
                            error={formik.touched.utilityref && Boolean(formik.errors.utilityref)}
                            helperText={formik.touched.utilityref && formik.errors.utilityref} InputLabelProps={{
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
                            placeholder="Enter recepient number"
                        />
                        </Box>
                        <Box mb={2}>
                        <TextField
                        size='small'
                        type="number"
                            fullWidth
                            label="amount"
                            name="amount"
                            value={formik.values.amount}
                            onChange={formik.handleChange}
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
                            placeholder="Enter your amount"
                        />
                        </Box>
                        <Box mb={2}>
                        <TextField
                        size='small'
                        type="password"
                            fullWidth
                            label="pin"
                            name="pin"
                            value={formik.values.pin}
                            onChange={formik.handleChange}
                            error={formik.touched.pin && Boolean(formik.errors.pin)}
                            helperText={formik.touched.pin && formik.errors.pin} InputLabelProps={{
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
                            placeholder="Enter your pin"
                        />
                        </Box>
                        <Box mb={2}>
                        <TextField
                            size='small'
                            type="text"
                            fullWidth
                            label="msisdn"
                            name="msisdn"
                            value={formik.values.msisdn}
                            onChange={formik.handleChange}
                            error={formik.touched.msisdn && Boolean(formik.errors.msisdn)}
                            helperText={formik.touched.msisdn && formik.errors.msisdn} InputLabelProps={{
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
                            placeholder="Enter your mobile number"
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
                        {loading?"Paying...":"Pay"}
                        </Button>
                </form>
            </Box>
        </Box>
    </Box>
  )
}

export default UtilityPayments