import { Alert, Box, Button, Container, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, Snackbar, TextField, Typography } from '@mui/material'
import React, { useState } from "react";
import {useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchUserSenderIds, sendSms } from '../hooks/hooks.jsx';


const validationSchema = Yup.object({
  recipient: Yup.string()
    .required("Recipient is required"),
  message: Yup.string().required("Message is required"),
  sender_id: Yup.string().required("Sender ID is required"),
  message_type: Yup.string().oneOf(["alert", "promo", "info"], "Invalid message type"),
});


const SendSms = () => {
  const userDataString = localStorage.getItem('userData');
  const userData = JSON.parse(userDataString);
  const { 
    data:rows, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['userSenderids'],
    queryFn: fetchUserSenderIds,
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!userData.tokens.access.token
  });

   // Filter the expenses by selected type
   const filteredIds = rows?.filter((ids) => 
    ids.status === true && ids.verification_status === "approved"
  );

  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
   const mutation = useMutation({
        mutationFn: sendSms,
        onSuccess: () => {
          queryClient.invalidateQueries('sms');
          setLoading(false)
          setSnackbarMessage("Message sent successfully!");
          setSnackbarSeverity('success');
          setOpenSnackbar(true);
        },
        onError: (error) => {
          // console.log('Error creating sms:', error);
          setLoading(false)
          setSnackbarMessage('Failed to send message. Please try again.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
        }
      });

      const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
      };
    
   const formik = useFormik({
      initialValues: {
        recipient: "",
        message: "",
        sender_id: "",
        message_type: "alert",
      },
      validationSchema,
      onSubmit: (values) => {
        setLoading(true)
        mutation.mutate(values)
        // You can send this data to your backend via Axios/fetch here
      }
    });


     if (isLoading) {
            return (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <Typography>loading....</Typography>
              </Box>
            );
          }
        
          if (isError) {
            return (
              <Box sx={{ p: 3 }}>
                <Alert severity="error">Failed to load sender IDs. Please try again.</Alert>
              </Box>
            );
          }
  return (
    <Box sx={{
      margin:2
    }}>
      <Box maxWidth={500} sx={{
      p:2,
      position:"relative"
      }}>
        {/* Snackbar for notifications */}
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
          SMS Broadcast Center
        </Typography>
        <Typography  sx={{
            fontSize:12,
            fontWeight:400,
            color:"#616161",
            marginBottom:2,   
        }} variant="body1">
          Quickly compose and send important messages to your customers.
        </Typography>
        <form onSubmit={formik.handleSubmit}>
            <TextField
              type='number'
              placeholder='Enter recepient mobile number'
              size='small'
              margin='normal'
              fullWidth
              label="Recipient"
              name="recipient"
              value={formik.values.recipient}
              onChange={formik.handleChange}
              error={formik.touched.recipient && Boolean(formik.errors.recipient)}
              helperText={formik.touched.recipient && formik.errors.recipient}
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
              fullWidth
              multiline
              rows={4}
              label="Message"
              name="message"
              size='small'
              margin='normal'
              value={formik.values.message}
              onChange={formik.handleChange}
              error={formik.touched.message && Boolean(formik.errors.message)}
              helperText={formik.touched.message && formik.errors.message}
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
            
            {/* <TextField
              fullWidth
              label="Sender ID"
              name="sender_id"
              size='small'
              margin='normal'
              value={formik.values.sender_id}
              onChange={formik.handleChange}
              error={formik.touched.sender_id && Boolean(formik.errors.sender_id)}
              helperText={formik.touched.sender_id && formik.errors.sender_id}
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
            /> */}

            <FormControl 
              fullWidth 
              size="small" 
              margin="normal" 
              error={formik.touched.sender_id && Boolean(formik.errors.sender_id)}
              sx={{
                '& .MuiInputLabel-root': {
                  color: "#555",
                  fontSize: 12,
                  transition: "color 0.3s ease",
                  "&:hover": {
                    color: "#333"
                  },
                  "&.Mui-focused": {
                    color: "#212121",
                    textTransform: "uppercase",
                    fontWeight: 500
                  }
                },
                '& .MuiOutlinedInput-root': {
                  fontSize: 10,
                  color: "#333",
                  borderRadius: "2px",
                  "&.Mui-focused fieldset": {
                    borderColor: "#212121",
                    borderRadius: "2px"
                  }
                },
                '& .MuiFormHelperText-root': {
                  fontSize: 10,
                  color: 'error.main',
                  textTransform: "capitalize"
                },
              }}
            >
              <InputLabel 
                id="sender-id-label"
                sx={{
                  color: "#555",
                  fontSize: 12,
                  transition: "color 0.3s ease",
                  "&:hover": {
                    color: "#333"
                  },
                  "&.Mui-focused": {
                    color: "#212121",
                    textTransform: "uppercase",
                    fontWeight: 500
                  }
                }}
              >
                Sender ID
              </InputLabel>
              <Select
                  labelId="sender-id-label"
                  name="sender_id"
                  value={formik.values.sender_id}
                  onChange={formik.handleChange}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        borderRadius: "1px",
                        maxHeight: 200,
                        marginTop: 8,
                        boxShadow: "none",
                        border: "1px solid #e0e0e0",
                        fontSize: 12,
                      },
                    },
                  }}
                  sx={{
                    fontSize: 10,
                    color: "#333",
                    "& .MuiSelect-select": {
                      padding: "8px 14px",
                    },
                  }}
                  label="Sender ID"
                >
                  {filteredIds && filteredIds.length > 0
                    ? [
                        <MenuItem
                          key="default"
                          disabled
                          value=""
                          sx={{
                            fontSize: 12,
                            fontWeight: 500,
                            textTransform: "capitalize",
                            padding: "8px 16px",
                            "&:hover": {
                              backgroundColor: "rgb(255, 184, 190)",
                            },
                            "&.Mui-selected": {
                              backgroundColor: "rgb(221, 24, 73)",
                              color: "white",
                            },
                          }}
                        >
                          ---Select Sender ID---
                        </MenuItem>,
                        ...filteredIds.map((sender) => (
                          <MenuItem
                            key={sender.id}
                            value={sender.sender_id}
                            sx={{
                              fontSize: 12,
                              fontWeight: 500,
                              textTransform: "capitalize",
                              padding: "8px 16px",
                              "&:hover": {
                                backgroundColor: "rgb(255, 184, 190)",
                              },
                              "&.Mui-selected": {
                                backgroundColor: "rgb(221, 24, 73)",
                                color: "white",
                              },
                            }}
                          >
                            {sender.sender_id}
                          </MenuItem>
                        )),
                      ]
                    : (
                      <MenuItem
                        disabled
                        value=""
                        sx={{
                          fontSize: 12,
                          color: "text.secondary",
                          justifyContent: "center", // Center text horizontally
                        }}
                      >
                        No Sender IDs Approved yet
                      </MenuItem>
                    )}
                </Select>

               
                {/* Add more options as needed */}
             
              <FormHelperText>{formik.touched.sender_id && formik.errors.sender_id}</FormHelperText>
            </FormControl>

            
              <Button variant="contained" fullWidth type="submit"
              
              disabled={loading}
              sx={{
              borderRadius: "3px",
              textTransform: 'none',
              textTransform:"uppercase",
              fontSize: 12,
              fontWeight:600,
              boxShadow:0,
              backgroundColor:"#D32F2F",                  
              "&:hover": {
                  boxShadow: "none",
              },
              }}>
                {loading?"Sending...":"Send Message"}   
              </Button>
            </form>
            
      </Box>
      
      
    </Box>
    
  )
}

export default SendSms
