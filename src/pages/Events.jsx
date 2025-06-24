import { useQuery } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react'
import { getEvents, IMG_BASE_URL } from '../hooks/hooks.jsx';
import { Alert, Avatar, Box, Grid, InputAdornment, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import { Search } from '@mui/icons-material';
import { format } from 'date-fns';


const dateOptions = [
  { label: "Last 30 days", value: 30 },
  { label: "Last 60 days", value: 60 },
  { label: "Last 90 days", value: 90 },
];

const Events = () => {
    const userDataString = localStorage.getItem('userData');
    const userData = JSON.parse(userDataString);
    const { 
      data:rows, 
      isLoading, 
      isError, 
      error,
      refetch 
    } = useQuery({
      queryKey: ['events'],
      queryFn: getEvents,
      retry: false,
      refetchOnWindowFocus: false,
      enabled: !!userData.tokens.access.token
    });

    const [search, setSearch] = useState("");
    const [days, setDays] = useState(30);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

  const filteredRows = useMemo(() => {
    const now = new Date();
    return rows?.results.filter((row) => {
      const matchSearch = row.name.toLowerCase().includes(search.toLowerCase())

    //   const matchStatus = status === "All" || row.status === status;
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
            <Alert severity="error">Failed to load events. Please try again.</Alert>
            {/* <Button onClick={handleRefresh} sx={{ mt: 2 }}>Retry</Button> */}
        </Box>
        );
    }
    
  return (
    <Box sx={{
      bgcolor:"#fff",
      margin:2,
      p:2,
      py:3,
    }}>
       <Typography gutterBottom variant="h4" sx={{ fontWeight: 600, color: "#212121", fontSize: 12, textTransform: "uppercase" }}>
             What’s Happening
      </Typography>
      <Typography variant="body1" sx={{ mb: 5, color: "text.secondary", fontSize: 12, textTransform: "capitalize" }}>
            Explore exciting events, from workshops to expos and everything in between.
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <TextField
            size="small"
            label="Search event by name..."
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

        {/* <Grid item xs={12} sm={3} md={3} lg={3}>
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
            }} key={option} value={option}>{option}</MenuItem>
            ))}
          </TextField>
        </Grid> */}

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
              <TableCell  size="small"    sx={{
                            fontSize:10,
                            fontWeight:600,
                            textTransform:"uppercase"
                        }}>name</TableCell>
              <TableCell  size="small"   sx={{
                            fontSize:10,
                            fontWeight:600,
                            textTransform:"uppercase"
                        }}>Price</TableCell>
              <TableCell  size="small"   sx={{
                            fontSize:10,
                            fontWeight:600,
                            textTransform:"uppercase"
                        }}>location</TableCell>
              <TableCell  size="small"   sx={{
                            fontSize:10,
                            fontWeight:600,
                            textTransform:"uppercase"
                        }}>description
              </TableCell>
              <TableCell  size="small"    sx={{
                            fontSize:10,
                            fontWeight:600,
                            textTransform:"uppercase"
                        }}>currency
              </TableCell>
              <TableCell  size="small"    sx={{
                            fontSize:10,
                            fontWeight:600,
                            textTransform:"uppercase"
                        }}>category</TableCell>
              <TableCell  size="small"    sx={{
                            fontSize:10,
                            fontWeight:600,
                            textTransform:"uppercase"
                        }}>capacity</TableCell>
              <TableCell  size="small"    sx={{
                            fontSize:10,
                            fontWeight:600,
                            textTransform:"uppercase"
                        }}>Date</TableCell>
              <TableCell  size="small"    sx={{
                            fontSize:10,
                            fontWeight:600,
                            textTransform:"uppercase"
                        }}>Time</TableCell>
              <TableCell  size="small"    sx={{
                            fontSize:10,
                            fontWeight:600,
                            textTransform:"uppercase"
                        }}>Event type</TableCell>
                        
              <TableCell  size="small"    sx={{
                            fontSize:10,
                            fontWeight:600,
                            textTransform:"uppercase"
                        }}>cover image</TableCell>
              <TableCell  size="small"    sx={{
                            fontSize:10,
                            fontWeight:600,
                            textTransform:"uppercase"
                        }}>created at</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows?.length> 0 ?(
              <>
               {filteredRows?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow key={row.id}
                 sx={{
                        backgroundColor: index % 2 === 0 ? 'white' : 'grey.100',
                      }}>
                  <TableCell size="small" 
                                sx={{
                                    fontSize:12,
                                }}>{row.name}</TableCell>
                  <TableCell size="small"  
                                sx={{
                                    fontSize:12,
                                }}>{row.price}</TableCell>
                  <TableCell size="small"  
                                sx={{
                                    fontSize:12,
                                }}>{row.location}</TableCell>
                  <TableCell size="small"  
                                sx={{
                                    fontSize:12,
                                }}>{row.description}</TableCell>
                  <TableCell size="small"  
                                sx={{
                                    fontSize:12,
                                }}>{row.currency}</TableCell>
                  <TableCell size="small"  
                                sx={{
                                    fontSize:12,
                                }}>{row.category}</TableCell>
                  <TableCell size="small"  
                                sx={{
                                    fontSize:12,
                                }}>{row.capacity}</TableCell>
                  <TableCell size="small"  
                                sx={{
                                    fontSize:12,
                                }}>{row.date}</TableCell>
                  <TableCell size="small"  
                                sx={{
                                    fontSize:12,
                                }}>{row.time}</TableCell>
                  <TableCell size="small"  
                                sx={{
                                    fontSize:12,
                                }}>{row.event_type}</TableCell>
                  <TableCell>
                                    <Avatar
                                    src={`${row.cover_image}`}  // Make sure asset_image returns a valid URL
                                    alt={row.name}
                                    style={{ width: 50, height: 50 }}
                                    />
                    </TableCell>
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
                  No event match your filter criteria Or You have not sent any event yet. Try adjusting your filters or search keywords
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

export default Events
