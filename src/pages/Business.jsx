import React from 'react'
import { fetchUserInfo } from '../hooks/hooks.jsx';
import { useQuery } from '@tanstack/react-query';
import { Alert, Box, Container, Divider, TextField, Typography } from '@mui/material';

const Business = () => {
  const userDataString = localStorage.getItem('userData');
  const userData = JSON.parse(userDataString);
  const { 
    data:rows, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['userInfos'],
    queryFn: fetchUserInfo,
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!userData.tokens.access.token
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
            <Alert severity="error">Failed to load User infos. Please try again.</Alert>
            {/* <Button onClick={handleRefresh} sx={{ mt: 2 }}>Retry</Button> */}
        </Box>
        );
    }

  return (
    <Box sx={{
      margin:2
    }}>
      <Box maxWidth={400} sx={{
          p:2,
        }}>
        <Typography 
            variant="h6" 
            gutterBottom
            sx={{
                color: "#212121",  // Soft black for readability
                fontWeight: 600,
                fontSize: "1.1rem",
                letterSpacing: "0.5px",
                position: "relative",
                display: "inline-block",
                "&::after": {      // Red underline for emphasis
                content: '""',
                position: "absolute",
                bottom: -4,
                left: 0,
                width: "40px",
                height: "2px",
                backgroundColor: "#D32F2F",  // Primary red
                }
            }}
            >
            Personal Information
            </Typography>
            <Divider sx={{ mb: 2, mt: 1, borderColor: "#E0E0E0" }} />
            {['username', 'email', 'phone',"account_id", "user_id",'date_of_birth', 'gender', 'zip_code', 'country','address'].map((key) => (
                <Box key={key} mb={2}>
                    <TextField
                    size='small'
                    fullWidth
                    disabled
                    label={key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    name={key}
                    value={rows?.[key] || ''}
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
            ))}

            <Typography 
            variant="h6" 
            gutterBottom
            sx={{
                color: "#212121",
                fontWeight: 600,
                fontSize: "1.1rem",
                "&::before": {      // Red bullet for visual anchor
                content: '"•"',
                color: "#D32F2F",
                marginRight: "8px",
                fontSize: "1.3rem",
                verticalAlign: "middle"
                }
            }}
            >
            Business Information
            </Typography>
            <Divider sx={{ mb: 2, borderColor: "#E0E0E0" }} />
            {['business_name', 'business_registration_number',"tax_id"].map((key) => (
                <Box key={key} mb={2}>
                    <TextField
                    size='small'
                    fullWidth
                    disabled
                    label={key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    name={key}
                    value={rows?.[key] || ''}
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
            ))}
        </Box>
    </Box>
  )
}

export default Business
