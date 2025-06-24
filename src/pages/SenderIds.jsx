import React, { useEffect, useMemo, useState } from 'react'
import { fetchUserSenderIds } from '../hooks/hooks.jsx';
import { Alert, Box, Grid, IconButton, InputAdornment, MenuItem, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import {  Search } from '@mui/icons-material';


const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'approved', label: 'Approved' },
    { value: 'pending', label: 'Pending' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const dateOptions = [
    { label: "Last 30 days", value: 30 },
    { label: "Last 60 days", value: 60 },
    { label: "Last 90 days", value: 90 },
  ];

const SenderIds = () => {
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
  
  
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [days, setDays] = useState(30);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  
  const filteredRows = useMemo(() => {
    const now = new Date();
    const dateThreshold = new Date(now);
    dateThreshold.setDate(dateThreshold.getDate() - days);
    return rows?.filter((row) => {
      const matchSearch = row.sender_id.toLowerCase().includes(search.toLowerCase())
  
      const matchStatus = status === "All" || row.verification_status === status;
  
      const matchDate = new Date(row.created_at) >= dateThreshold;
  
      return matchSearch && matchStatus && matchDate;
    });
  }, [rows, search, status, days]);
  
  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
 
  
  
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
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
        bgcolor:"#fff",
        margin:2,
        p:2,
        py:3
      }}>
        
        <Typography gutterBottom variant="h4" sx={{ fontWeight: 600, color: "#212121", fontSize: 12, textTransform: "uppercase" }}>    
            Registered Sender IDs
        </Typography>
        <Typography variant="body1" sx={{ mb: 5, color: "text.secondary", fontSize: 12, textTransform: "capitalize" }}>
          View all active and pending sender IDs associated with your account. Each ID is verified for secure use in messaging.
        </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={6} lg={6}>
        <TextField
            size="small"
            label="Search SMS by Sender ID or Recipient number..."
            variant="outlined"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
            startAdornment: (
                <InputAdornment position="start">
                <Search/>
                </InputAdornment>
            ),
            }}
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
        </Grid>

        <Grid item xs={12} sm={3} md={3} lg={3}>
        <TextField
        size="small"
            select
            label="Filter by Status"
            fullWidth
            value={status}
            onChange={(e) => setStatus(e.target.value)}
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
                maxHeight: 200,
                marginTop: 8,
                boxShadow: 'none', // Removed elevation
                border: '1px solid #e0e0e0',
                fontSize:12,
            },
            },
        },
        }}
        >
            {statusOptions.map((option) => (
            <MenuItem sx={{
                fontSize:12,
                fontWeight:500,
                textTransform:"capitalize",
            padding: '8px 16px',
            '&:hover': {
                backgroundColor: 'rgb(255, 184, 190)',
            },
            '&.Mui-selected': {
                backgroundColor: 'rgb(221, 24, 73)',
            }
            }} key={option.value} value={option.value}>{option.label}</MenuItem>
            ))}
        </TextField>
        </Grid>

        <Grid item xs={12} sm={3} md={3} lg={3}>
        <TextField
        size="small"
            select
            label="Filter by Date"
            fullWidth
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
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
                maxHeight: 200,
                marginTop: 8,
                boxShadow: 'none', // Removed elevation
                border: '1px solid #e0e0e0',
                fontSize:12,
            },
            },
        },
        }}
        >
            {dateOptions.map((option) => (
            <MenuItem sx={{
                fontSize:12,
                fontWeight:500,
                textTransform:"capitalize",
            padding: '8px 16px',
            '&:hover': {
                backgroundColor: 'rgb(255, 184, 190)',
            },
            '&.Mui-selected': {
                backgroundColor: 'rgb(221, 24, 73)',
            }
            }} key={option.value} value={option.value}>
                {option.label}
            </MenuItem>
            ))}
        </TextField>
        </Grid>
    </Grid>
      <TableContainer elevation={0} component={Paper} sx={{ 
        mt: 3,
        borderTop:"1px solid #e8e8e8"
       }}>
        <Table>
          <TableHead sx={{
            bgcolor:"grey.50"
          }}>
            <TableRow>
            <TableCell   sx={{
                    fontSize:10,
                    fontWeight:600,
                    textTransform:"uppercase"
                }}>sender id</TableCell>
              <TableCell   sx={{
                    fontSize:10,
                    fontWeight:600,
                    textTransform:"uppercase"
                }}>Status</TableCell>
              <TableCell   sx={{
                    fontSize:10,
                    fontWeight:600,
                    textTransform:"uppercase"
                }}>Created at</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows?.length> 0 ?(
              <>
               {filteredRows?.map((sender, index) => (
                <TableRow key={sender.id}
                  sx={{
                        backgroundColor: index % 2 === 0 ? 'white' : 'grey.100',
                      }}>
                  <TableCell size="small" 
                                sx={{
                                    fontSize:12,
                                }}>{sender.sender_id}</TableCell>
                  <TableCell size="small"
                              sx={{
                                fontSize:12,
                                textTransform:"capitalize",
                                fontWeight:700,
                                color: sender.verification_status === 'approved' ? 'success.main' : 
                                    sender.verification_status === 'pending' ? 'warning.main' : 'error.main'
                            }}
                            >{sender.verification_status}</TableCell>
                  <TableCell size="small"  
                                sx={{
                                    fontSize:12,
                                }}>{format(new Date(sender.created_at), 'MMM d, yyyy HH:mm')}</TableCell>
                </TableRow>
              ))}
              </>
            ):(
              <TableRow>
                <TableCell colSpan={8} align="center" 
                            sx={{
                                fontSize:12,
                                color:"text.secondary",
                            }}> 
                  No Api key match your filter criteria Or You have not created any Api key yet. Try adjusting your filters or search keywords or create api key
                </TableCell>
              </TableRow>
            )}
           
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          rowsPerPageOptions={[5, 10, 25]}
          count={filteredRows?.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            "& .MuiTablePagination-root": {
                fontSize: 12, // Adjust overall pagination text size
                fontWeight: 500,
                // textTransform: "uppercase",
            },
            "& .MuiTablePagination-toolbar": {
                fontSize: 12, // Adjust toolbar text size (e.g., "Rows per page")
                // textTransform:"uppercase"
            },
            "& .MuiTablePagination-selectLabel": {
                fontSize: 12, // Adjust "Rows per page" text size
            },
            "& .MuiTablePagination-input": {
                fontSize: 12, // Adjust dropdown text size
            },
            "& .MuiTablePagination-actions button": {
                fontSize: 12, // Adjust button (next/prev) text size
            },
            "& .MuiSelect-select": {
                bgcolor:"#fff",// Light gray dropdown background
                borderRadius: "1px",
                padding: "5px 10px",
                fontSize: 12, // Adjust dropdown font size
            },
            "& .MuiTablePagination-displayedRows": {
                fontSize: 12, // Adjust font size of "1–1 of 1"
                fontWeight: 500,
                // textTransform: "uppercase",
            },
        }}
        SelectProps={{
            MenuProps: {
                PaperProps: {
                    sx: {
                        borderRadius: "1px", // Rounded border for dropdown
                        backgroundColor: "#fff", // Background color of dropdown
                        elevation:0,
                        boxShadow:"none",
                        border: "1px solid #ccc", // Optional: Adds a subtle border for separation
                        mt: 1.5, 
                        "& .MuiMenuItem-root": {
                            fontSize: 12, // Dropdown text size
                            fontWeight: 500, // Dropdown text weight
                            "&.Mui-selected": {
                                backgroundColor: "rgb(221, 24, 73)", // Active dropdown item color (red)
                                color: "white",
                            },
                            "&:hover": {
                                backgroundColor: "rgb(255, 184, 190)", // Hover color (lighter red)
                            },
                        },
                    },
                },
            },
        }}
        />
      </TableContainer>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
  )
}

export default SenderIds
