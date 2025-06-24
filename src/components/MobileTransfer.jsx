import {Alert, Box, Button, Card, CardContent, Container,  Dialog,  DialogContent,  Divider,  Grid, IconButton, Snackbar, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { MNOSingleTransfer } from '../hooks/hooks.jsx';
import { ArrowBack,Close} from '@mui/icons-material';
import axios from 'axios';




const validationSchema = Yup.object({
    utilityref: Yup.string().required('Utility Ref is required'),
    amount: Yup.number().required('Amount is required').positive(),
    pin: Yup.string().required('PIN is required'),
    msisdn: Yup.string().required('Phone number is required'),
  });

  const generateTransId = () => {
    const prefix = 'TFR';
    const random = Math.random().toString(36).substring(2, 10).toUpperCase();
    return prefix + random;
  };
  

const MobileTransfer = ({setShowScreen}) => {
    const [mobileTransferType, setMobileTransferType] = useState(''); // for mobile money
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
        mutationFn: MNOSingleTransfer, // Ensure `createNews` is a function
        onSuccess: (response) => {
            setLoading(false)
            setSnackbar({ open: true, message: 'Your mobile money transfer request was successful.', severity: 'success' }); // For demo purposes, we'll use the dummy data
            setTransactionDetails(response);
            setTimeout(() => setOpenDialog(true), 3001);
            
        },
        onError: (error) => {
            setLoading(false)
            
        let message = 'Unable to process your mobile money transfer. Please try again later.';
        if (error.response && error.response.data) {
          const data = error.response.data;

          // Pick first available message from known fields or fallback
          message = data.message|| Object.values(data)[0] || message;
        }


        setSnackbar({
          open: true,
          message,
          severity: 'error',
        });
        }
    });

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setTimeout(() => navigate('/dashboard'), 500);
      };
  

      // Helper function to parse the message into readable format
  const parseMessage = (message) => {
    return message.split('\n').map((line, index) => (
      <Typography sx={{
        fontSize:12
      }} key={index} variant="body2" gutterBottom>
        {line}
      </Typography>
    ));
  };


      const formik = useFormik({
        initialValues: {         
            transid: generateTransId(),
            utilitycode: 'CASHIN',
            utilityref: '',
            amount: '',
            pin: '',
            msisdn: '',
            source_account: 'float'
        },
        validationSchema,
        onSubmit: values => {
            setLoading(true)
            mutation.mutate(values);
          },
      });

      // Fetch recipient when utilityref is entered
  const handleUtilityRefBlur = async (e) => {
        
            const { utilityref, transid } = formik.values;

            // Only fetch if both values are filled
            if (!utilityref || !transid) return;

            try {
                const response = await axios.get('https://ezycard.zeno.africa/lookupcash', {
                    params: { utilityref, transid },
                });

                console.log(response.data)

            // const { msisdn, amount } = response.data;

            // formik.setFieldValue('msisdn', msisdn || '');
            // formik.setFieldValue('amount', amount || '');
            } catch (error) {
            console.log('Error fetching recipient data:', error);
            }
        };
  
  return ( 
    <Box>
        {mobileTransferType ===''?(
        <Container maxWidth="md" sx={{
            display:"flex",
            flexDirection:"column",
            alignItems:"center"
        }}>
            <Box>
                <IconButton
                onClick={() => setShowScreen(false)}
                >
                <ArrowBackIcon/>
                </IconButton>
            </Box>
            <Typography variant="h5" textAlign="center" sx={{
                    fontSize:20,
                    fontWeight:700,
                    color:"#212121",

                }}  gutterBottom>Mobile Money Transfer – Quick, Easy & Reliable</Typography>
            <Typography variant="body1" textAlign="center"  sx={{
                    fontSize:14,
                    fontWeight:500,
                    color:"#616161",
                    textAlign:"center",
                    marginBottom:2,   
                }}  gutterBottom>No bank? No problem! Safe, fast, and convenient – the smarter way to send money..</Typography>

            {/* Sub-options for Mobile Money */}

            <Box mt={3}>                
               <Typography variant="h5" textAlign="center" sx={{
                    fontSize:14,
                    fontWeight:700,
                    color:"grey.500",
                    textTransform:"capitalize"

                }}  gutterBottom>Sending to one or many? Pick your option!</Typography>


                <Grid container spacing={3} maxWidth="md"  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    py: 5,
                    px: 2,
                    textAlign: "center",
                }}>
                    {/* Item 1 */}
                    <Grid item xs={12} md={6}>
                    <Card
                        variant="outlined"
                        onClick={() => setMobileTransferType('single')}
                        sx={{
                            borderColor: mobileTransferType === 'single' ? '#D32F2F' : 'grey.300',
                            cursor: 'pointer',
                            borderRadius: '1px',
                            borderWidth:"2px",
                            textAlign: 'center',
                            p: 2,
                            maxWidth:300,
                            '&:hover': { borderColor: '#D32F2F' },
                        }}
                        >
                        <CardContent>
                            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#212121', fontSize: 14 }}>
                            Quick Pay – Single Contact
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#616161', fontSize: 12, mt: 1 }}>
                            Need to pay just one person? This option lets you send money quickly with minimal steps.
                            </Typography>
                        </CardContent>
                        </Card>
                    </Grid>

                    {/* Item 2 */}
                    <Grid item xs={12} md={6}>
                        <Card
                        variant="outlined"
                        onClick={() => setMobileTransferType('many')}
                        sx={{
                            borderColor: mobileTransferType === 'many' ? '#D32F2F' : 'grey.300',
                            cursor: 'pointer',
                            borderRadius: '1px',
                            borderWidth:"2px",
                            textAlign: 'center',
                            p: 2,
                            maxWidth:300,
                            '&:hover': { borderColor: '#D32F2F' },
                        }}
                        >
                        <CardContent>
                            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#212121', fontSize: 14 }}>
                            Mass Payouts – Save Time
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#616161', fontSize: 12, mt: 1 }}>
                            Ideal for businesses or group expenses. Upload a list to send money to multiple recipients at once.
                            </Typography>
                        </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Container>
            ):( 
            <Box sx={{
                margin:2
              }}>
                {mobileTransferType === 'single' && ( 
                <Box maxWidth={500} sx={{
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
                                {parseMessage(transactionDetails.zenopay_response.message)}
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
                            }}>{transactionDetails.zenopay_response.reference}</Typography>
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
                            }}>{transactionDetails.zenopay_response.transid}</Typography>
                                </Box>
                                
                                <Box>
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
                                </Box>
                                
                                <Box>
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
                                </Box>
                                
                                <Box>
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
                                </Box>
                                
                                <Box>
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
                    
                   <Box sx={{
                        mb:3
                    }}>
                        <IconButton
                        onClick={() => setMobileTransferType('')}
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

                            }}  gutterBottom>Fast & Secure Transfer</Typography>
                        <Typography variant="body1" sx={{
                                fontSize:12,
                                fontWeight:500,
                                color:"#616161",
                                marginBottom:3,   
                            }}  gutterBottom>Get your money where it needs to go—quickly and safely</Typography>
                        <form onSubmit={formik.handleSubmit}>
                             <Box mb={2}>
                                <TextField
                                    size='small'
                                    type="text"
                                    fullWidth
                                    label="utilityref"
                                    name="utilityref"
                                    value={formik.values.utilityref}
                                    onChange={formik.handleChange}
                                    onBlur={handleUtilityRefBlur}
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
                                    type="number"
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
                                {loading?"Transfering...":"Make Transfer"}
                                </Button>
                                
                        </form>
                    </Box>
                    </Box>
                )}
                {mobileTransferType === 'many' && (
                <>
                    <Typography variant="h6" gutterBottom>Transfer to Many Users</Typography>
                    <Typography>Bulk Mobile Money Transfer form goes here...</Typography>
                </>
                )}
            </Box>
            )}
       </Box>
    
  
  )
}

export default MobileTransfer
