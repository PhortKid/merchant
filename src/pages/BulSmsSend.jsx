import React, { useState } from 'react'
import {useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchUserSenderIds, sendBulkSms } from '../hooks/hooks.jsx';
import {PersonAdd} from '@mui/icons-material';
import { Alert, Box, Button, Chip, Container, FormControl, FormHelperText, IconButton, InputLabel, MenuItem, Select, Snackbar, Stack, TextField, Typography } from '@mui/material';

const smsSchema =Yup.object({
    recipients: Yup
      .array()
      .of(
        Yup
          .string()
          .matches(/^255\d{9}$/, 'Each recipient must be a valid phone number starting with 255 and followed by 9 digits')
      )
      .min(1, 'At least one recipient is required')
      .required('Recipients are required'),

    message: Yup
      .string()
      .required('Message is required'),
    //   .max(160, 'Message must be at most 160 characters'), // Optional: limit like typical SMS

    sender_id: Yup
      .string()
      .required('Sender ID is required')
      .max(11, 'Sender ID must be at most 11 characters'),

    message_type: Yup
      .string()
      .oneOf(['alert', 'transactional', 'promotional'], 'Invalid message type')
      .required('Message type is required'),
  });

const BulSmsSend = () => {
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

  
  const [rawInput, setRawInput] = useState('');

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
            mutationFn: sendBulkSms,
            onSuccess: () => {
              queryClient.invalidateQueries('sms');
              formik.resetForm(); // Clear all form fields
              setRawInput(''); 
              setLoading(false)
              setSnackbarMessage("Messages sent successfully!");
              setSnackbarSeverity('success');
              setOpenSnackbar(true);
            },
            onError: (error) => {
            //   console.log('Error creating sms:', error);
              setLoading(false)
              setSnackbarMessage('Failed to send messages. Please try again.');
              setSnackbarSeverity('error');
              setOpenSnackbar(true);
            }
          });
    
          const handleCloseSnackbar = () => {
            setOpenSnackbar(false);
          };

    const formik = useFormik({
        initialValues: {
            recipients: [], // this should be an array of phone numbers
            message: '',
            sender_id: '',
            message_type: 'alert',
        },
        validationSchema:smsSchema,
        onSubmit: (values) => {
            setLoading(true);
            const payload = {
                recipients: values.recipients,
                message: values.message,
                sender_id: values.sender_id,
                message_type: values.message_type,
            }
            
            mutation.mutate(payload, {
                onSettled: () => setLoading(false),
            });// send payload as array of 1 object
        },
        });

        // Function to handle comma-separated input
        const handleRecipientBlur = () => {
            const recipientsArray = rawInput
            .split(',')
            .map(item => item.trim())
            .filter(item => /^255\d{9}$/.test(item));

            formik.setFieldValue('recipients', recipientsArray);
            formik.setFieldTouched('recipients', true);
        };

        const handleRemoveRecipient = (number) => {
            formik.setFieldValue(
            'recipients',
            formik.values.recipients.filter((n) => n !== number)
            );
        };


        
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
                  bgcolor:"#fff",
                  p:2,
                  py:3, 
                  position: 'relative'
                  }}>
                    <Snackbar
                  open={openSnackbar}
                  autoHideDuration={6000}
                  onClose={handleCloseSnackbar}
                //   anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
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
                      Reach Your Customers
                  </Typography>
                  <Typography  sx={{
                      fontSize:12,
                      fontWeight:400,
                      color:"#616161",
                      marginBottom:2,  
                  }} variant="body1">
                      Deliver important updates, promotions, or alerts to multiple recipients in one click.
                  </Typography>
                  <form onSubmit={formik.handleSubmit}>
                     
  
                       <TextField
                          size="small"
                          label="Add Recipients"
                          variant="outlined"
                          fullWidth
                          value={rawInput}
                          onChange={(e) => setRawInput(e.target.value)}
                          onBlur={handleRecipientBlur}
                          error={formik.touched.recipients && Boolean(formik.errors.recipients)}
                          helperText={
                              formik.touched.recipients && formik.errors.recipients
                              ? formik.errors.recipients
                              : 'Enter comma-separated numbers (e.g., 255712345678, 255789012345)'
                          }
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
                              fontSize: 10,
                              color: 
                                  formik.touched.recipients && formik.errors.recipients
                                  ? 'error.main'
                                  : 'text.secondary',
                              textTransform: "capitalize",
                              marginLeft: 0,
                              marginTop: '2px',
                              },
                          }}
  
                          />
  
                      {formik.values.recipients.length > 0 && (
                          <Stack direction="row" gap={1} spacing={1} p={2} mb={2} flexWrap="wrap">
                          {formik.values.recipients.map((recipient, index) => (
                              <Chip
                              key={index}
                              label={recipient}
                              onDelete={() => handleRemoveRecipient(recipient)}
                              color='inherit'
                              sx={{
                                  borderRadius:"4px",
                              }}
                              />
                          ))}
                          </Stack>
                      )}
  
                      
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
                     //     textTransform: 'none',
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
                  
                  {/* Snackbar for notifications */}
                  
          </Box>
  )
}

export default BulSmsSend