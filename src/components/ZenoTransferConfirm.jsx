import { Box, Button, TextField } from '@mui/material'
import React, { useState } from 'react'
import { confirmTransfer } from '../hooks/hooks.jsx';
import { useMutation } from '@tanstack/react-query';
import { Field, Form, Formik } from 'formik';

const ZenoTransferConfirm = ({transferData, validationSchema, handleSnackbar}) => {
    const [isLoading, setIsLoading]=useState(false)
    const {
        mutate: confirm,
        isLoading: confirming,
        } = useMutation({
        mutationFn: confirmTransfer,
        onSuccess: (data, _variables, context) => {
            setIsLoading(false)
            handleSnackbar(data.message, 'success');
            context?.resetForm(); // 🆕 Reset form on success
        },
        onError: (error) => {
            handleSnackbar(
            error.response?.data?.message || 'Failed to confirm transfer',
            'error'
            );
        },
        });
  return (
    <Box>
        <Formik
            initialValues={{
                transfer_reference: transferData?.transfer_reference || '',
                pin: '',
            }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
                        setIsLoading(true)
                        confirm(values, {
                        context: { resetForm } // 🆕 Pass resetForm to context
                        });
                    }}
        >
        {({ errors, touched }) => (
            <Form>
            <Box mb={2}>
                <Field
                size="small"
                name="transfer_reference"
                as={TextField}
                disabled
                fullWidth
                label="Transfer Reference"
                error={touched.transfer_reference && !!errors.transfer_reference}
                helperText={touched.transfer_reference && errors.transfer_reference}
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
                label="pin"
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
            <Button type="submit" variant="contained" disabled={confirming}
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
                {confirming ? 'confirming...' : 'Confirm Transfer'}
            </Button>
            </Form>
        )}
        </Formik>
    </Box>
  )
}

export default ZenoTransferConfirm
