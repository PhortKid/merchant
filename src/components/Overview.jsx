import { AccountBalance, AccountBalanceWallet, BarChart as BarChartIcon ,  Mail as MailIcon, BarChartRounded, Drafts, Lock, MarkAsUnread, Pending, TaskAlt, Verified, Visibility, VisibilityOff, VpnKey } from '@mui/icons-material';
import { Alert, Box, FormControl, FormControlLabel, Grid,Chip, IconButton, InputAdornment, InputLabel, MenuItem, Paper, Select, Switch, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react'
import { fetchUserDetails, fetchUserTransactionsAndTransfers } from '../hooks/hooks.jsx';

import {
  LineChart,
  BarChart,
  Bar,
  Line,
  XAxis,
AreaChart,
  Area,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(isoWeek);


const getLatest31Transactions = (transactions) => {
  if (!transactions || transactions.length === 0) return [];
  
  // Sort transactions by date descending
  const sorted = [...transactions].sort((a, b) => 
    new Date(b.created_at) - new Date(a.created_at)
  );
  
  // Return only the first 31 entries
  return sorted.slice(0, 31);
};


const gradientColor = "#4CAF50"; // A vibrant green for the line
const gradientFillStart = "rgba(76, 175, 80, 0.5)"; // Semi-transparent version for the top of the fill
const gradientFillEnd = "rgba(76, 175, 80, 0)"; // Fully transparent for the bottom of the fill


const primaryChartColor = "#0DA580";


// Custom components
const StatCard = ({ icon, title, value, currency, percentage, trend }) => (
  <Paper sx={{ 
    p: 2, 
    borderRadius: 2, 
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)'
    }
  }}>
    <Box display="flex" alignItems="center" mb={1}>
      <Box sx={{ 
        bgcolor: 'rgba(221, 24, 73, 0.1)', 
        p: 1, 
        borderRadius: 1,
        mr: 1.5
      }}>
        {icon}
      </Box>
      <Typography variant="subtitle2" sx={{ 
        color: 'text.secondary', 
        fontWeight: 500,
        letterSpacing: 0.5
      }}>
        {title}
      </Typography>
    </Box>
    <Box display="flex" alignItems="baseline">
      <Typography variant="h5" sx={{ 
        fontWeight: 500, 
        color: 'text.primary',
        flexGrow: 1
      }}>
        {value} {currency}
      </Typography>
      {percentage && (
        <Chip 
          label={`${trend === 'up' ? '+' : '-'}${percentage}%`} 
          size="small"
          sx={{ 
            ml: 1, 
            bgcolor: trend === 'up' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
            color: trend === 'up' ? '#4CAF50' : '#F44336',
            fontWeight: 600
          }}
        />
      )}
    </Box>
  </Paper>
);

const groupByPeriod = (data, period) => {
  const map = {};

  data.forEach((item) => {
    const date = dayjs(item.created_at);
    let key = "";

    switch (period) {
      case "daily":
        key = date.format("YYYY-MM-DD");
        break;
      case "weekly":
        key = `Week ${date.isoWeek()} ${date.year()}`;
        break;
      case "monthly":
        key = date.format("MMM YYYY");
        break;
      case "yearly":
        key = date.format("YYYY");
        break;
      default:
        break;
    }

    if (!map[key]) map[key] = {};
    if (!map[key][item.type]) map[key][item.type] = 0;

    map[key][item.type] += item.amount;
  });

  let result = Object.entries(map).map(([label, types]) => ({
    label,
    ...types,
  }));

  if (period === "daily") {
    // Sort by date descending and take the latest 31 entries
    result = result
      .sort((a, b) => dayjs(b.label).unix() - dayjs(a.label).unix())
      .slice(0, 31)
      .sort((a, b) => dayjs(a.label).unix() - dayjs(b.label).unix()); // Sort back to chronological order
  }

  return result;
};

// const groupByPeriod = (data, period) => {
//   // First filter the data if needed
//   const dataToUse = period === "daily" 
//     ? getLatest31Transactions(data || []) 
//     : data || [];

//   const map = {};

//   dataToUse.forEach((item) => {
//     const date = dayjs(item.created_at);
//     let key = "";

//     switch (period) {
//       case "daily":
//         key = date.format("YYYY-MM-DD");
//         break;
//       case "weekly":
//         key = `Week ${date.isoWeek()} ${date.year()}`;
//         break;
//       case "monthly":
//         key = date.format("MMM YYYY");
//         break;
//       case "yearly":
//         key = date.format("YYYY");
//         break;
//       default:
//         break;
//     }

//     if (!map[key]) map[key] = {};
//     if (!map[key][item.type]) map[key][item.type] = 0;

//     map[key][item.type] += item.amount;
//   });

//   return Object.entries(map).map(([label, types]) => ({
//     label,
//     ...types,
//   }));
// };

const Overview = () => {
  const userDataString = localStorage.getItem('userData');
  const userData = JSON.parse(userDataString);
    const { 
      data:rows, 
      isLoading:rowsIsLoading, 
      isError:rowsIsError, 
      error:rowsError,
      refetch:rowsRefetch
    } = useQuery({
      queryKey: ['userTransactions'],
      queryFn: fetchUserTransactionsAndTransfers,
      retry: false,
      refetchOnWindowFocus: false,
      enabled: !!userData.tokens.access.token
    });

  const { 
    data, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['userDetails'],
    queryFn: fetchUserDetails,
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!userData.tokens.access.token
  });
  
  const [selectedCurrency, setSelectedCurrency] = useState("TZS");

  const handleCurrencyChange = (event) => {
    setSelectedCurrency(event.target.value);
  };
  const [pin, setPin] = useState(userData.user.pin);// Default PIN (replace with real data)
  const [showPin, setShowPin] = useState(false);

  const togglePinVisibility = () => {
    setShowPin(!showPin);
  };
  const [period, setPeriod] = useState("daily");
  const [chartType, setChartType] = useState("line");

  const filteredData = useMemo(
    () => groupByPeriod(rows?.expenses || [], period),
    [period, rows?.expenses]
  );
  const uniqueTypes = Array.from(new Set(rows?.expenses?.map((e) => e.type)));

     if (isLoading || rowsIsLoading) {
        return (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <Typography>loading....</Typography>
          </Box>
        );
      }
    
      if (isError || rowsIsError) {
        return (
          <Box sx={{ p: 3 }}>
            <Alert severity="error">Failed to load user details. Please try again.</Alert>
            {/* <Button onClick={handleRefresh} sx={{ mt: 2 }}>Retry</Button> */}
          </Box>
        );
      }

  return (
    <Box sx={{
      // bgcolor:"#fff",
      margin:2,
      p:2,
      py:3
    }}>
     <Box sx={{
      bgcolor:"#fff",
      p:2,
      // py:3
    }}>
      {/* Currency Selector */}
      <FormControl
        sx={{
          mb:2,
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
        }}>
        <InputLabel
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
          }}>Currency</InputLabel>
        <Select value={selectedCurrency} label="Currency" onChange={handleCurrencyChange}  
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
          }}>
          {Object.keys(data?.float_balance || {}).map((currency) => (
            <MenuItem key={currency} value={currency}
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
              }}>
              {currency}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={{ xs:12, sm:6, md:3 }}>
          {/* Float Balance */}
        <StatCard 
            icon={<AccountBalance sx={{ color: 'rgb(221, 24, 73)' }} />}
            title="Float Balance"
            value={
            Number(
                (data?.float_balance?.[selectedCurrency] || "0").replace(",", "")
            ).toLocaleString()
          }
           currency={selectedCurrency}
          // percentage="2.5"
          // trend="up"
          />
        
        </Grid>
        <Grid item size={{ xs:12, sm:6, md:3 }}>
          {/* Wallet Balance */}
          <StatCard 
            icon={<AccountBalanceWallet sx={{ color: 'rgb(221, 24, 73)' }} />}
            title="Wallet Balance"
            value={Number(data?.wallet_balance?.[selectedCurrency] || "0").toLocaleString()}
           
            currency={selectedCurrency}
          />
        
        </Grid>
        <Grid item size={{ xs:12, sm:6, md:3 }}>
          {/* Wallet Balance */}
           <StatCard 
            icon={<BarChartIcon sx={{ color: 'rgb(221, 24, 73)' }} />}
            title="Total Value"
            value={Number(data?.total_value_wallet_balance?.[selectedCurrency] || "0").toLocaleString()}
           
            currency={selectedCurrency}
          />
           
          </Grid>
          <Grid item size={{ xs:12, sm:6, md:3 }}>

            <StatCard 
            icon={<MailIcon sx={{ color: 'rgb(221, 24, 73)' }} />}
            title="SMS Balance"
            value={Number(data?.sms_balance).toLocaleString()}
           
            // currency={selectedCurrency}
          />

            
            {/* SMS Balance */}
         
        </Grid>
      </Grid>

    
    </Box>

      <Box  sx={{
      bgcolor:"#fff",
      p:2,
      py:3
    }}>
      {/* Title + Filters */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={2}>
          <Typography variant="h6" sx={{ fontSize:12,textTransform:"uppercase", fontWeight: 600 }}>
            Expenses Over Time ({period.charAt(0).toUpperCase() + period.slice(1)})
          </Typography>
          <Box display="flex" gap={2}>
            <FormControl size="small"
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
                }
              }}>
              <InputLabel>Filter</InputLabel>
              <Select value={period} label="Filter" onChange={(e) => setPeriod(e.target.value)}
              MenuProps={{
                PaperProps: {
                  style: {
                    borderRadius: "1px",
                    maxHeight: 200,
                    marginTop: 8,
                    boxShadow: 'none',
                    border: '1px solid #e0e0e0',
                    fontSize: 12
                  }
                }
              }}
              sx={{
                fontSize: 10,
                color: "#333",
                "& .MuiSelect-select": {
                  padding: "8px 14px"
                }
              }}
                >
                {["daily", "weekly", "monthly", "yearly"].map((value) => (
                    <MenuItem
                      key={value}
                      value={value}
                      sx={{
                        fontSize: 12,
                        fontWeight: 500,
                        textTransform: "capitalize",
                        padding: '8px 16px',
                        '&:hover': {
                          backgroundColor: 'rgb(255, 184, 190)',
                        },
                        '&.Mui-selected': {
                          backgroundColor: 'rgb(221, 24, 73)',
                          color: 'white'
                        }
                      }}
                    >
                      {value}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <ToggleButtonGroup
              value={chartType}
              exclusive
              onChange={(e, newType) => newType && setChartType(newType)}
              size="small"
              sx={{
                backgroundColor: '#f5f5f5',
                borderRadius: '2px',
                '& .MuiToggleButton-root': {
                  fontSize: 12,
                  fontWeight: 500,
                  textTransform: 'capitalize',
                  color: '#555',
                  borderColor: '#e0e0e0',
                  padding: '4px 12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgb(255, 184, 190)',
                    color: '#000',
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'rgb(221, 24, 73)',
                    color: '#fff',
                    borderColor: 'rgb(221, 24, 73)',
                    '&:hover': {
                      backgroundColor: 'rgb(200, 20, 66)'
                    }
                  },
                  '&.Mui-disabled': {
                    color: '#aaa'
                  }
                }
              }}
            >
              <ToggleButton value="line">Line</ToggleButton>
              <ToggleButton value="bar">Bar</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        {/* Chart */}
       
        <ResponsiveContainer width="100%" height={400}>
  {chartType === "line" ? (
    <AreaChart
      data={filteredData}
      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
    >
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
      <XAxis dataKey="label" axisLine={false} tickLine={false} />
      <YAxis
        axisLine={false}
        tickLine={false}
        allowDecimals={false}
        tickFormatter={(value) => value.toLocaleString()} // Ensures full number is shown with commas
        padding={{ top: 10, bottom: 10 }}
        width={100} // Give extra space for large numbers like 123,000,000
      />
      <Tooltip />
      <Legend />

      <defs>
        {uniqueTypes.map((type, i) => {
          const isWalletCashin = type === "wallet_cashin";
          const color = isWalletCashin ? primaryChartColor : "#ff4d4f"; // red
          return (
            <linearGradient key={`colorUv-${i}`} id={`colorUv-${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.8} />
              <stop offset="95%" stopColor={color} stopOpacity={0.0} />
            </linearGradient>
          );
        })}
      </defs>

      {uniqueTypes.map((type, i) => {
        const isWalletCashin = type === "wallet_cashin";
        const color = isWalletCashin ? primaryChartColor : "#ff4d4f";
        return (
          <Area
            key={type}
            type="monotone"
            dataKey={type}
            stroke={color}
            fillOpacity={1}
            fill={`url(#colorUv-${i})`}
            activeDot={{ r: 9 }}
            isAnimationActive={true}
            dot={false}
            animationDuration={800}
            animationBegin={100}
          />
        );
      })}
    </AreaChart>
  ) : (
    <BarChart data={filteredData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="label" axisLine={false} tickLine={false}  />
      <YAxis
        axisLine={false}
        tickLine={false}
        allowDecimals={false}
        tickFormatter={(value) => value.toLocaleString()} // Ensures full number is shown with commas
        padding={{ top: 10, bottom: 10 }}
        width={100} // Give extra space for large numbers like 123,000,000
      />
      <Tooltip />
      <Legend />
      {uniqueTypes.map((type) => {
        const isWalletCashin = type === "wallet_cashin";
        const color = isWalletCashin ? primaryChartColor : "#ff4d4f";
        return (
          <Bar
            key={type}
            dataKey={type}
            fill={color}
            isAnimationActive={true}
            animationDuration={800}
            animationBegin={100}
          />
        );
      })}
    </BarChart>
  )}
</ResponsiveContainer>

    </Box>
    </Box>
  )
}

export default Overview
