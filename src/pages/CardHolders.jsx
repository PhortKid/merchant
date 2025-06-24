import { useQuery } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react'
import { fetchUserCardHolders } from '../hooks/hooks.jsx';
import { Alert, Box, Grid, InputAdornment, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import { Search } from '@mui/icons-material';
import { format } from 'date-fns';

const dateOptions = [
  { label: "Last 30 days", value: 30 },
  { label: "Last 60 days", value: 60 },
  { label: "Last 90 days", value: 90 },
];


const CardHolders = () => {
  const userDataString = localStorage.getItem('userData');
  const userData = JSON.parse(userDataString);
  const { 
    data:rows, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['userTransactions'],
    queryFn: fetchUserCardHolders,
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!userData.tokens.access.token
  });
  // console.log(rows?.cardholders)
  // console.log(error)
    const [days, setDays] = useState(30);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [search, setSearch] = useState("");

    const filteredRows = useMemo(() => {
        const now = new Date();
        if (!Array.isArray(rows?.cardholders)) return [];
        
        return rows?.cardholders.filter((row) => {
          const matchSearch = row.card_holder_id.toLowerCase().includes(search.toLowerCase()) || 
                              row.address.toLowerCase().includes(search.toLowerCase())|| 
                              row.last_name.toLowerCase().includes(search.toLowerCase())|| 
                              row.first_name.toLowerCase().includes(search.toLowerCase());
    
          // const matchStatus = status === "All" || row.status === status;
          const matchDate =
            new Date(row.created_at) >= new Date(now.setDate(now.getDate() - days));
    
          return matchSearch && matchDate;
        });
      }, [rows, search, days]);

      const handleChangePage = (_, newPage) => setPage(newPage);
        const handleChangeRowsPerPage = (event) => {
          setRowsPerPage(+event.target.value);
          setPage(0);
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
            <Alert severity="error">Failed to load cardholders list. Please try again.</Alert>
          </Box>
        );
      }
  return (
      <Box sx={{
        margin:2,
        p:2,
      }}>
        
        <Typography gutterBottom variant="h4" sx={{ fontWeight: 600, color: "#212121", fontSize: 12, textTransform: "uppercase" }}>
                Cardholders
        </Typography>
        <Typography variant="body1" sx={{ mb: 5, color: "text.secondary", fontSize: 12, textTransform: "capitalize" }}>
          View and manage all registered cardholders in one place.
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <TextField
              size="small"
              label="Search here..."
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
                          }}>cardholder id</TableCell>
                <TableCell   sx={{
                              fontSize:10,
                              fontWeight:600,
                              textTransform:"uppercase"
                          }}>first name</TableCell>
                <TableCell   sx={{
                              fontSize:10,
                              fontWeight:600,
                              textTransform:"uppercase"
                          }}>last name</TableCell>
                <TableCell   sx={{
                              fontSize:10,
                              fontWeight:600,
                              textTransform:"uppercase"
                          }}>phone</TableCell>
                <TableCell   sx={{
                              fontSize:10,
                              fontWeight:600,
                              textTransform:"uppercase"
                          }}>email</TableCell>
                <TableCell   sx={{
                              fontSize:10,
                              fontWeight:600,
                              textTransform:"uppercase"
                          }}>address</TableCell>
                <TableCell   sx={{
                              fontSize:10,
                              fontWeight:600,
                              textTransform:"uppercase"
                          }}>country</TableCell>
                <TableCell   sx={{
                              fontSize:10,
                              fontWeight:600,
                              textTransform:"uppercase"
                          }}>state</TableCell>
                <TableCell   sx={{
                              fontSize:10,
                              fontWeight:600,
                              textTransform:"uppercase"
                          }}>city</TableCell>
                <TableCell   sx={{
                              fontSize:10,
                              fontWeight:600,
                              textTransform:"uppercase"
                          }}>documentType</TableCell>
                <TableCell   sx={{
                              fontSize:10,
                              fontWeight:600,
                              textTransform:"uppercase"
                          }}>documentNumber</TableCell>
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
                 {filteredRows?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow key={row.transid}
                  sx={{
                        backgroundColor: index % 2 === 0 ? 'white' : 'grey.100',
                      }}>
                  <TableCell size="small" 
                                sx={{
                                    fontSize:12,
                                }}>{row.card_holder_id}</TableCell>
                    <TableCell size="small" 
                                  sx={{
                                      fontSize:12,
                                  }}>{row.first_name}</TableCell>
                    <TableCell size="small" 
                                  sx={{
                                      fontSize:12,
                                  }}>{row.last_name}</TableCell>
                    <TableCell size="small"  
                                  sx={{
                                      fontSize:12,
                                  }}>{row.phone}</TableCell>
                    <TableCell size="small" 
                                  sx={{
                                      fontSize:12,
                                  }}>{row.email}</TableCell>
                    <TableCell size="small"  
                                  sx={{
                                      fontSize:12,
                                  }}>{row.address}</TableCell>
                    <TableCell size="small" 
                                  sx={{
                                      fontSize:12,
                                  }}>{row.country}</TableCell>
                    <TableCell size="small"  
                                  sx={{
                                      fontSize:12,
                                  }}>{row.state}</TableCell>
                    <TableCell size="small" 
                                  sx={{
                                      fontSize:12,
                                  }}>{row.city}</TableCell>
                    <TableCell size="small"  
                                  sx={{
                                      fontSize:12,
                                  }}>{row.document_type}</TableCell>
                    <TableCell size="small" 
                                  sx={{
                                      fontSize:12,
                                  }}>{row.document_number}</TableCell>
                    <TableCell size="small"  
                                  sx={{
                                      fontSize:12,
                                  }}>{format(new Date(row.created_at), 'MMM d, yyyy HH:mm')}</TableCell>
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
                    No cardholder match your filter criteria Or You have not made any cardholder yet. Try adjusting your filters or search keywords or add new cardholder
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
      </Box>
  )
}

export default CardHolders