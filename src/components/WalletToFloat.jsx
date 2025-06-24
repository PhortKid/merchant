import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react'
import * as Yup from 'yup';
import { walletToFloat } from '../hooks/hooks.jsx';
import { Alert, Box, Button, Dialog, DialogContent, Divider, IconButton, Paper, Snackbar, TextField, Typography, useTheme } from '@mui/material';
import { ArrowBack, Close, Info } from '@mui/icons-material';
import { Field, Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';

// Yup validation schema
const TransferBalanceSchema = Yup.object().shape({
  amount: Yup.number()
    .typeError('Amount must be a number')
    .positive('Amount must be positive')
    .required('Amount is required'),
  pin: Yup.string()
    .matches(/^\d{4}$/, 'PIN must be exactly 4 digits')
    .required('PIN is required'),
});



const WalletToFloat = ({setShowScreen}) => {
    const theme = useTheme();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [transactionDetails, setTransactionDetails] = useState(null);
  const navigate = useNavigate();
   const handleSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };
  const {
    mutate: wallettofloat,
  } = useMutation({
    mutationFn:walletToFloat,
    onSuccess: (data, _variables, context) => {
      setIsLoading(false)
    //   setTransferData(data);
      handleSnackbar(data.message, 'success');
      setTransactionDetails(data);
      context?.resetForm(); // 🆕 Reset form on success
      setTimeout(() => setOpenDialog(true), 3001);
    },
    onError: (error) => {
      handleSnackbar(error.response?.data?.error || 'Failed to initiate transfer', 'error');
      setIsLoading(false)
    },
});

 const handleCloseDialog = () => {
        setOpenDialog(false);
        // setTimeout(() => navigate('/dashboard'), 500);
      };
  
  return (
    <Box sx={{
      margin:2
    }}>
        <Box  maxWidth={500} 
         sx={{
            p:2,
            position:"relative"
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
                Balance Transfer
            </Typography>
            <Typography  sx={{
                fontSize:12,
                fontWeight:400,
                color:"#616161",
                marginBottom:2,   
            }} variant="body1">
                Securely shift funds from your wallet to your float account instantly.
            </Typography>
                <Formik
                initialValues={{
                    amount: '',
                    pin: '',
                    direction: 'wallet_to_float',
                }}
                validationSchema={TransferBalanceSchema}
                  onSubmit={(values, { resetForm }) => {
                        setIsLoading(true)
                        wallettofloat(values, {
                        context: { resetForm } // 🆕 Pass resetForm to context
                        });
                    }}
                >
                {({ errors, touched }) => (
                    <Form>
                    <Box mb={2}>
                        <Field
                        size="small"
                        name="amount"
                        type="number"
                        as={TextField}
                        fullWidth
                        label="Amount"
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
                        name="pin"
                        as={TextField}
                        fullWidth
                        label="Pin"
                        type="password"
                        error={touched.pin && !!errors.pin}
                        helperText={touched.pin && errors.pin}
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
                        {isLoading ? 'transfering...' : 'Transfer balance now'}
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
                            <Box>
                                <Typography  variant="body2" sx={{
                                color:theme.palette.info.main,
                                fontWeight:500
                            }}>🔒 Business Verification Notice</Typography>
                                <Typography  variant="caption" sx={{
                                color:theme.palette.info.main,
                                fontWeight:500
                            }}>Make sure your business is verified to enjoy lower fees</Typography>
                            <Box>
                                <Typography variant="body2" sx={{
                                color:theme.palette.info.main,
                                fontWeight:500
                            }}>✅ Verified Businesses (Completed Full KYC)</Typography>
                            <Box sx={{
                                display:"flex",
                                flexDirection:"column",
                                marginLeft:2
                            }}>
                                <Typography variant="caption" sx={{
                                color:theme.palette.info.main,
                                fontWeight:500
                            }}>•⁠  ⁠Transaction Fee: 3%</Typography>
                                <Typography variant="caption" sx={{
                                color:theme.palette.info.main,
                                fontWeight:500
                            }}>•⁠  ⁠Transfer Fee: TZS 200</Typography>
                            </Box>
                            </Box>
                            <Box>
                                <Typography variant="body2" sx={{
                                color:theme.palette.info.main,
                                fontWeight:500
                            }}>⚠ Unverified Businesses (Incomplete KYC)</Typography>
                            <Box sx={{
                                display:"flex",
                                flexDirection:"column",
                                marginLeft:2
                            }}>
                                 <Typography variant="caption" sx={{
                                color:theme.palette.info.main,
                                fontWeight:500
                            }}>•⁠  ⁠Transaction Fee: 6%</Typography>
                                <Typography variant="caption" sx={{
                                color:theme.palette.info.main,
                                fontWeight:500,
                            }}>•⁠  ⁠Transfer Fee: TZS 200</Typography>
                            </Box>
                               
                            </Box>
                            <Typography variant="body2" sx={{
                                color:theme.palette.info.main,
                                fontWeight:500
                            }}>
                                📲 Complete your KYC now!
                            </Typography>
                            <Typography variant="body2" sx={{
                                color:theme.palette.info.main,
                                fontWeight:500
                            }}>Contact us on WhatsApp: ‪+255 793 166 166‬</Typography>
                            <Typography variant="body2" sx={{
                                color:theme.palette.info.main,
                                fontWeight:500
                            }}>Let’s grow your business with confidence and lower fees 🚀</Typography>
                            </Box>
                            
                        </Paper>
                    </Box>
                    </Form>
                )}
                </Formik>
        </Box>
        
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
                {/* <Box sx={{ 
                    bgcolor: 'grey.50', 
                    p: 2, 
                    borderRadius: "1px",
                    mb: 3,
                    borderLeft: '4px solid',
                    borderColor: '#D32F2F'
                }}>
                    {parseMessage(transactionDetails.zenopay_response.message)}
                </Box> */}
                
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
                }}>wallet balance:</Typography>
                    <Typography variant="body1" sx={{
                    fontWeight:500,
                    fontSize:12,
                    textTransform:"uppercase"
                }}>{transactionDetails.wallet_balance.toLocaleString()}</Typography>
                    </Box>
                    
                    <Box>
                    <Typography variant="body2" color="text.secondary" sx={{
                    fontWeight:400,
                    fontSize:12,
                    textTransform:"uppercase"
                }}>float balance:</Typography>
                    <Typography variant="body1" sx={{
                    fontWeight:500,
                    fontSize:12,
                    textTransform:"uppercase"
                }}>{transactionDetails.float_balance.toLocaleString()}</Typography>
                    </Box>
                    
                    <Box>
                    <Typography variant="body2" color="text.secondary" sx={{
                    fontWeight:400,
                    fontSize:12,
                    textTransform:"uppercase"
                }}>merchant transaction fee:</Typography>
                    <Typography variant="body1" sx={{
                    fontWeight:500,
                    fontSize:12,
                    textTransform:"uppercase"
                }}>
                        {transactionDetails.merchant_transaction_fee.toLocaleString()} TZS
                    </Typography>
                    </Box>
                    
                    <Box>
                    <Typography variant="body2" color="text.secondary" sx={{
                    fontWeight:400,
                    fontSize:12,
                    textTransform:"uppercase"
                }}>wallet to float transfer fee:</Typography>
                    <Typography variant="body1" sx={{
                    fontWeight:500,
                    fontSize:12,
                    textTransform:"uppercase"
                }}>
                        {transactionDetails.wallet_to_float_transfer_fee.toLocaleString()} TZS
                    </Typography>
                    </Box>
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
    </Box>
  )
}

export default WalletToFloat