import { Alert, Box, Button, Container, Snackbar, TextField, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react'
import { addSenderId } from '../hooks/hooks.jsx';
import { useFormik } from 'formik';
import * as Yup from "yup";

// Validation schema
const senderIdSchema = Yup.object().shape({
  sender_id: Yup.string()
    .required('Sender ID is required')
    .max(11, 'Sender ID must be at most 11 characters')
    .matches(/^[a-zA-Z0-9]+$/, 'Only alphanumeric characters are allowed'),
  description: Yup.string()
    .required('Description is required')
    .max(255, 'Description must be at most 255 characters'),
  status: Yup.string()
    .oneOf(['active', 'pending'], 'Invalid status')
    .required('Status is required')
});

const ReqSenderId = () => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    // Mutation for adding a new sender ID
  const addSenderIdMutation = useMutation({
    mutationFn: addSenderId,
    onSuccess: () => {
      queryClient.invalidateQueries('senderIds');
      setLoading(false)
      setSnackbarMessage("Thank you! Your Sender ID request has been received. We'll review your request and notify you once it's approved");
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    },
    onError: (error) => {
      setSnackbarMessage('Oops! Something went wrong. Please try again later or contact support if the issue persists.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  });

   const handleCloseSnackbar = () => {
      setOpenSnackbar(false);
    };
  
  const formik = useFormik({
    initialValues: {
      sender_id: "",
      description: "",
      status: 'pending'
    },
    senderIdSchema,
    onSubmit: (values) => {
      setLoading(true)
      addSenderIdMutation.mutate(values)
      // You can send this data to your backend via Axios/fetch here
    }
  });
  return (
    <Box  sx={{
      margin:2,
    }}>
      <Box maxWidth={500} sx={{
          bgcolor:"#fff",
          p:2,
      }}>
        <Typography variant="subtitle2" sx={{
            fontSize:12,textTransform:"uppercase",fontWeight: 600,
            color:"#212121",

        }} gutterBottom>
          Get Your Sender ID
        </Typography>
        <Typography  sx={{
            fontSize:12,
            fontWeight:400,
            color:"#616161",
            marginBottom:2,  
        }} variant="body1">
          Stand out in every message — apply for your custom sender name today.
        </Typography>
        <form onSubmit={formik.handleSubmit}>
        <TextField
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
            />
            
            <TextField
              fullWidth
              multiline
              rows={4}                  
              name="description"
              label="Description"
              size='small'
              margin='normal'
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
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
            
            
            
              <Button variant="contained" fullWidth type="submit"
              
              disabled={loading}
              sx={{
              borderRadius: "3px",
            //  textTransform: 'none',
              textTransform:"uppercase",
              fontSize: 12,
              fontWeight:600,
              boxShadow:0,
              backgroundColor:"#D32F2F",                  
              "&:hover": {
                  boxShadow: "none",
              },
              }}>
                {loading?"Sending Request...":"Request sender id"}   
              </Button>
            </form>
            
      </Box>.
       {/* Snackbar for notifications */}
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

export default ReqSenderId


// import { Add, Refresh, Search } from '@mui/icons-material';
// import { Alert, Box, Button, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Paper, Select, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Tooltip, Typography } from '@mui/material';
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import React, { useEffect, useState } from 'react'
// import { addSenderId, getSenderIds } from '../hooks/hooks';
// import { Field, Form, Formik } from 'formik';
// import * as Yup from 'yup';
// import { format } from 'date-fns';

// const statusOptions = [
//   { value: 'all', label: 'All Statuses' },
//   { value: 'active', label: 'Active' },
//   { value: 'pending', label: 'Pending' },
//   { value: 'rejected', label: 'Rejected' }
// ];



// const ReqSenderId = () => {
//   const queryClient = useQueryClient();
//   const [openDialog, setOpenDialog] = React.useState(false);// Fetch sender IDs
//   const [page, setPage] = useState(0); // Note: TablePagination uses 0-based index
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [openSnackbar, setOpenSnackbar] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState('');
//   const [snackbarSeverity, setSnackbarSeverity] = useState('success');

//   // Debounce search term
//   useEffect(() => {
//     const timerId = setTimeout(() => {
//       setDebouncedSearchTerm(searchTerm);
//       setPage(0); // Reset to first page when search changes
//     }, 500); // 500ms delay

//     return () => {
//       clearTimeout(timerId);
//     };
//   }, [searchTerm]);

//     // Fetch sender IDs with pagination and search
//   const { 
//     data: senderIdsData = { data: [], total: 0 }, 
//     isLoading, 
//     isError, 
//     error,
//     refetch,
//     isFetching
//   } = useQuery({
//     queryKey: ['senderIds', { 
//       page: page + 1, // Convert to 1-based index for API
//       pageSize: rowsPerPage, 
//       search: debouncedSearchTerm,
//       status: statusFilter !== 'all' ? statusFilter : undefined
//     }],
//     queryFn: ({ queryKey }) => {
//       const [, params] = queryKey;
//       return getSenderIds(params);
//     },
//     keepPreviousData: true,
//     staleTime: 5000,
//   });


//     const handleStatusFilterChange = (event) => {
//       setStatusFilter(event.target.value);
//       setPage(0);
//     };

//     const handleRefresh = () => {
//       refetch();
//     };
//   const handleSubmit = (values) => {
//     addSenderIdMutation.mutate(values);
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0); // Reset to first page when page size changes
//   };

//   const handleSearchChange = (event) => {
//     setSearchTerm(event.target.value);
//     setPage(0); // Reset to first page when search changes
//   };

//   const handleCloseSnackbar = () => {
//     setOpenSnackbar(false);
//   };

//   const initialValues = {
//     sender_id: '',
//     description: '',
//     status: 'pending' // Default to pending status
//   };

//   if (isLoading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
//         <Typography>loading....</Typography>
//       </Box>
//     );
//   }

//   if (isError) {
//     return (
//       <Box sx={{ p: 3 }}>
//         <Alert severity="error">Failed to load sender IDs. Please try again.</Alert>
//         <Button onClick={handleRefresh} sx={{ mt: 2 }}>Retry</Button>
//       </Box>
//     );
//   }


//   return (
//     <Box>
//       <Box 
//       mt={3}
//       display="flex"
//       flexDirection={{ xs: "column", lg: "row" }}
//       gap={2}
//       mb={3} sx={{ p: 3, bgcolor: "#fff", border: "1px solid #e8e8e8"}}>
//          <TextField
//             size="small"
//             fullWidth
//             variant="outlined"
//             placeholder="Search sender IDs..."
//             value={searchTerm}
//             onChange={handleSearchChange}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <Search />
//                 </InputAdornment>
//               ),
//             }}
//             InputLabelProps={{
//               sx: {
//                 color: "#555",
//                 fontSize: 12,
//                 transition: "color 0.3s ease",
//                 "&:hover": {
//                   color: "#333"
//                 },
//                 "&.Mui-focused": { 
//                   color: "#212121",
//                   textTransform: "uppercase",
//                   fontWeight: 500
//                 },
//               },
//             }}
//             inputProps={{
//               sx: {
//                 fontSize: 10,
//                 color: "#333",
//                 "&::placeholder": {
//                   color: "#aaa",
//                   fontSize: 12,
//                 },
//               },
//             }}
//             sx={{
//               '& .MuiOutlinedInput-root': {
//                 borderRadius: "2px",
//                 "&.Mui-focused fieldset": { 
//                   borderColor: "#212121",
//                   borderRadius: "2px"
//                 },
//               },
//               '& .MuiFormHelperText-root': {
//                 fontSize: 10,
//                 color: 'error.main',
//                 textTransform: "capitalize"
//               },
//             }}
//           />

//         <TextField
//           select
//           size="small"
//           fullWidth
//           variant="outlined"
//           value={statusFilter}
//           onChange={handleStatusFilterChange}
//           label="Filter by status"
//           InputLabelProps={{
//             sx: {
//             color: "#555", // Default label color
//             fontSize: 12,
//             transition: "color 0.3s ease",
//             "&:hover": {
//                 color: "#333"
//             }, // Label color on hover
//             "&.Mui-focused": { 
//                 color: "#212121",
//                 textTransform:"uppercase",
//                 fontWeight:500
//             }, // Label color on focus
//             },
//         }}
//         inputProps={{
//             sx: {
//             fontSize: 10, // Field content size
//             color: "#333", // Field content color
//             "&::placeholder": {
//                 color: "#aaa", // Placeholder color
//                 fontSize: 12,
//             },
//             },
//         }}
//         sx={{
//             '& .MuiOutlinedInput-root': {
//             borderRadius: "2px",
//             "&.Mui-focused fieldset": { 
//                 borderColor: "#212121",
//                 borderRadius:"2px"
//             }, // Focus border
//             },
//             '& .MuiFormHelperText-root': {
//             fontSize: 10, // Smaller font size for validation errors
//             color: 'error.main', // Red color for errors
//             textTransform:"capitalize"
//             },
        
//         }}
    
//         SelectProps={{
//         MenuProps: {
//             PaperProps: {
//             style: {
//                 borderRadius:"1px",
//                 maxHeight: 200,
//                 marginTop: 8,
//                 boxShadow: 'none', // Removed elevation
//                 border: '1px solid #e0e0e0',
//                 fontSize:12,
//             },
//             },
//         },
//         }}
//         >
//            {statusOptions.map((option) => (
//               <MenuItem sx={{
//                 fontSize:12,
//                 fontWeight:500,
//               padding: '8px 16px',
//               '&:hover': {
//                 backgroundColor: 'rgb(255, 184, 190)',
//               },
//               '&.Mui-selected': {
//                 backgroundColor: 'rgb(221, 24, 73)',
//               }
//             }} key={option.value} value={option.value}>
//                 {option.label}
//               </MenuItem>
//             ))}
//         </TextField>
        
//         <Button
//           fullWidth
//           variant="contained"
//           // color="primary"
//           onClick={()=>setOpenDialog(true)}
//             sx={{
//               borderRadius: "1px",
//               textTransform: 'uppercase',
//               // py: 1.5,
//               fontSize: 12,
//               fontWeight:500,
//               boxShadow:0,
//               backgroundColor:"#D32F2F",                  
//               "&:hover": {
//                   boxShadow: "none",
//               },
//               }} 
//         >
//           Request Sender ID
//         </Button>
          
//       </Box>
//       {senderIdsData?.data.length === 0 ? (
//         <Box sx={{ p: 3, bgcolor:"#fff", border:"1px solid #e8e8e8",textAlign: 'center'}}>
//           <Typography variant="body1">
//             {debouncedSearchTerm ? 'No matching sender IDs found' : 'You don\'t have any sender IDs yet'}
//           </Typography>
//         </Box>
//       ) : (
//         <Box sx={{ p: 3, bgcolor:"#fff", border:"1px solid #e8e8e8",textAlign: 'center'}}>
//           <TableContainer elevation={0} component={Paper}>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell sx={{
//                             fontSize:10,
//                             fontWeight:600,
//                             textTransform:"uppercase"
//                         }}>Sender ID</TableCell>
//                   <TableCell sx={{
//                             fontSize:10,
//                             fontWeight:600,
//                             textTransform:"uppercase"
//                         }}>Created at</TableCell>
//                   <TableCell sx={{
//                             fontSize:10,
//                             fontWeight:600,
//                             textTransform:"uppercase"
//                         }}>Status</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//               {senderIdsData?.data.map((sender) => (
//                   <TableRow key={`${sender.sender_id}-${sender.status}`}>
//                     <TableCell size="small" sx={{
//                                     fontSize:10,
//                                     textTransform:"uppercase",
//                                 }}>{sender.sender_id}</TableCell>
//                     <TableCell size="small" sx={{
//                                     fontSize:10,
//                                     textTransform:"capitalize",
//                                 }}>
//                                   {format(new Date(sender.created_at), 'MMM d, yyyy HH:mm')}</TableCell>
//                     <TableCell size="small" sx={{
//                                     fontSize:10,
//                                     textTransform:"capitalize",
//                                 }}>
//                       <Typography 
//                         color={
//                           sender.verification_status === 'active' ? 'success.main' : 
//                           sender.verification_status === 'pending' ? 'warning.main' : 'error.main'
//                         }
//                         sx={{
//                           fontSize:10,
//                           textTransform:"capitalize",
//                           fontWeight:500
//                       }}
//                       >
//                         {sender.verification_status}
//                       </Typography>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//           <TablePagination
//             rowsPerPageOptions={[5, 10, 25]}
//             component="div"
//             count={senderIdsData.total}
//             rowsPerPage={rowsPerPage}
//             page={page}
//             onPageChange={handleChangePage}
//             onRowsPerPageChange={handleChangeRowsPerPage}
//             labelRowsPerPage="Rows per page:"
//             labelDisplayedRows={({ from, to, count }) => {
//               const start = Math.min(page * rowsPerPage + 1, count);
//               const end = Math.min((page + 1) * rowsPerPage, count);
//               return `${start}-${end} of ${count}`;
//             }}
//             sx={{
//               "& .MuiTablePagination-root": {
//                   fontSize: 12, // Adjust overall pagination text size
//                   fontWeight: 500,
//                   // textTransform: "uppercase",
//               },
//               "& .MuiTablePagination-toolbar": {
//                   fontSize: 12, // Adjust toolbar text size (e.g., "Rows per page")
//                   // textTransform:"uppercase"
//               },
//               "& .MuiTablePagination-selectLabel": {
//                   fontSize: 12, // Adjust "Rows per page" text size
//               },
//               "& .MuiTablePagination-input": {
//                   fontSize: 12, // Adjust dropdown text size
//               },
//               "& .MuiTablePagination-actions button": {
//                   fontSize: 12, // Adjust button (next/prev) text size
//               },
//               "& .MuiSelect-select": {
//                   bgcolor:"#fff",// Light gray dropdown background
//                   borderRadius: "1px",
//                   padding: "5px 10px",
//                   fontSize: 12, // Adjust dropdown font size
//               },
//               "& .MuiTablePagination-displayedRows": {
//                   fontSize: 12, // Adjust font size of "1–1 of 1"
//                   fontWeight: 500,
//                   // textTransform: "uppercase",
//               },
//           }}
//           SelectProps={{
//               MenuProps: {
//                   PaperProps: {
//                       sx: {
//                           borderRadius: "1px", // Rounded border for dropdown
//                           backgroundColor: "#fff", // Background color of dropdown
//                           elevation:0,
//                           boxShadow:"none",
//                           border: "1px solid #ccc", // Optional: Adds a subtle border for separation
//                           mt: 1.5, 
//                           "& .MuiMenuItem-root": {
//                               fontSize: 12, // Dropdown text size
//                               fontWeight: 500, // Dropdown text weight
//                               "&.Mui-selected": {
//                                   backgroundColor: "rgb(221, 24, 73)", // Active dropdown item color (red)
//                                   color: "white",
//                               },
//                               "&:hover": {
//                                   backgroundColor: "rgb(255, 184, 190)", // Hover color (lighter red)
//                               },
//                           },
//                       },
//                   },
//               },
//           }}
//           />
//         </Box>
        
//       )}

//     <Dialog open={openDialog} onClose={()=>setOpenDialog(false)} fullWidth maxWidth="sm">
//       <DialogTitle sx={{
//         fontSize: 16,
//         fontWeight: 600,
//         color: "#212121",
//         pb: 1, // Reduce padding to bring subtitle closer
//       }}>
//         Get Your Sender ID
//         <Box 
//           component="span" 
//           sx={{
//             display: "block",
//             fontSize: 14,
//             fontWeight: 500,
//             color:"#616161",
//             textTransform:"capitalize",
//             mt: 0.5,
//           }}
//         >
//           Stand out in every message — apply for your custom sender name today.
//         </Box>
//       </DialogTitle>
//       <Formik
//         initialValues={initialValues}
//         validationSchema={senderIdSchema}
//         onSubmit={(values, { setSubmitting }) => {
//           handleSubmit(values)
//           setSubmitting(false);
//         }}
//       >
//         {({ errors, touched, handleSubmit, isSubmitting, isValid }) => (
//           <Form>
//             <DialogContent>
//               <Box>
//                 <Field
//                   as={TextField}
//                   size="small"
//                   name="sender_id"
//                   label="Sender ID"
//                   fullWidth
//                   variant="outlined"
//                   margin="normal"
//                   error={touched.sender_id && Boolean(errors.sender_id)}
//                   helperText={touched.sender_id && errors.sender_id}
//                   InputLabelProps={{
//                     sx: {
//                       color: "#555", // Default label color
//                       fontSize: 12,
//                       transition: "color 0.3s ease",
//                       "&:hover": {
//                           color: "#333"
//                       }, // Label color on hover
//                       "&.Mui-focused": { 
//                           color: "#212121",
//                           textTransform:"uppercase",
//                           fontWeight:500
//                       }, // Label color on focus
//                     },
//                   }}
//                   inputProps={{
//                     sx: {
//                       fontSize: 10, // Field content size
//                       color: "#333", // Field content color
//                       "&::placeholder": {
//                         color: "#aaa", // Placeholder color
//                         fontSize: 12,
//                       },
//                     },
//                   }}
//                   sx={{
//                     '& .MuiOutlinedInput-root': {
//                       borderRadius: "2px",
//                       "&.Mui-focused fieldset": { 
//                           borderColor: "#212121",
//                           borderRadius:"2px"
//                       }, // Focus border
//                     },
//                     '& .MuiFormHelperText-root': {
//                       fontSize: 10, // Smaller font size for validation errors
//                       color: 'error.main', // Red color for errors
//                       textTransform:"capitalize"
//                     },
                  
//                   }}
//                 />
//               </Box>

//               <Box>
//                 <Field
//                   as={TextField}
//                   size="small"

//                   fullWidth
//                   variant="outlined"
//                   margin="normal"
//                   multiline
//                   rows={3}
//                   error={touched.description && Boolean(errors.description)}
//                   helperText={touched.description && errors.description}
//                   InputLabelProps={{
//                     sx: {
//                       color: "#555", // Default label color
//                       fontSize: 12,
//                       transition: "color 0.3s ease",
//                       "&:hover": {
//                           color: "#333"
//                       }, // Label color on hover
//                       "&.Mui-focused": { 
//                           color: "#212121",
//                           textTransform:"uppercase",
//                           fontWeight:500
//                       }, // Label color on focus
//                     },
//                   }}
//                   inputProps={{
//                     maxLength: 255,
//                     sx: {
//                       fontSize: 10, // Field content size
//                       color: "#333", // Field content color
//                       "&::placeholder": {
//                         color: "#aaa", // Placeholder color
//                         fontSize: 12,
//                       },
//                     },
//                   }}
//                   sx={{
//                     '& .MuiOutlinedInput-root': {
//                       borderRadius: "2px",
//                       "&.Mui-focused fieldset": { 
//                           borderColor: "#212121",
//                           borderRadius:"2px"
//                       }, // Focus border
//                     },
//                     '& .MuiFormHelperText-root': {
//                       fontSize: 10, // Smaller font size for validation errors
//                       color: 'error.main', // Red color for errors
//                       textTransform:"capitalize"
//                     },
                  
//                   }}
//                 />
//               </Box>
//             </DialogContent>

//             <DialogActions>
//               <Button  sx={{
//                   fontSize:12,
//                   color:"grey.700"
//                 }}
//                 onClick={()=>setOpenDialog(false)} 
//                 disabled={isSubmitting || isLoading}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 color="primary"
//                 variant="contained"
//                 disabled={isSubmitting || isLoading || !isValid}
//                 onClick={handleSubmit}
//                 sx={{
//                 borderRadius: "1px",
//                 textTransform: 'uppercase',
//                 // py: 1.5,
//                 fontSize: 12,
//                 // fontWeight:600,
//                 boxShadow:0,
//                 backgroundColor:"#D32F2F",                  
//                 "&:hover": {
//                     boxShadow: "none",
//                 },
//                 }}
//               >
//                 {isLoading ? (
//                   <>
//                     <CircularProgress size={24} sx={{ mr: 1 }} />
//                     Adding...
//                   </>
//                 ) : (
//                   'Add Sender ID'
//                 )}
//               </Button>
//             </DialogActions>
//           </Form>
//         )}
//       </Formik>
//     </Dialog>

//      {/* Snackbar for notifications */}
//       <Snackbar
//         open={openSnackbar}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//       >
//         <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
//           {snackbarMessage}
//         </Alert>
//       </Snackbar>

//     </Box>
//   )
// }

// export default ReqSenderId
