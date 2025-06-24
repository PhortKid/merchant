import { Box, Button, Card, CardContent, Container, FormControlLabel, Paper, Radio, RadioGroup, Typography, useMediaQuery, useTheme } from '@mui/material'
import React, { useState } from 'react'
import MobileTransfer from '../components/MobileTransfer.jsx';
import ZenopayTransfer from '../components/ZenopayTransfer.jsx';
import WalletToFloat from '../components/WalletToFloat.jsx';
import BankTransfer from '../components/BankTransfer.jsx';

const transferOptions = [
  {
    value: 'bank',
    title: 'Transfer to Bank account',
    description: 'Send money directly from your Zenopay account wallet to one or more bank accounts instantly.',
  },
  {
    value: 'mobile',
    title: 'Transfer to Mobile money',
    description: 'Send money to a mobile phone number seamlessly using Mobile Money Transfer. Bulk transfer options also available.',
  },
  {
    value: 'zenopay',
    title: 'Transfer to ZenoPay Account',
    description: 'Send money in any currency from one zenopay account to another using a merchant ID.',
  },
  {
    value: 'float',
    title: 'Transfer from wallet balance to float balance',
    description: 'Send money in any currency from wallet balance to float balance using a merchant ID.',
  },
  {
    value: 'currency',
    title: 'Transfer Between Currency Balances',
    description: 'This type of transfer allows you to send money between your Zenopay balances.',
  },
];

const NewTransfer = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));    const [selectedOption, setSelectedOption] = useState('bank');
  const [showScreen, setShowScreen] = useState(false);

  // const handleChange = (event) => {
  //   setSelectedOption(event.target.value);
  // };
   const handleChange = (event) => {
    setSelectedOption(event.target.value);
    setShowScreen(false); // reset screen when user changes option
  };

  const handleStartTransfer = () => {
    setShowScreen(true); // show new screen after clicking Start Transfer
  };
  return (
    <Box sx={{
        mt:2,
        p:2
    }}>
    {!showScreen ? (
      <Container maxWidth="md">
        <Typography sx={{ mb: 3 }} variant="h5" align="center" gutterBottom>
          How Should We Process Your Transfer?
        </Typography>

        <RadioGroup value={selectedOption} onChange={handleChange}>
          <Box
            display="flex"
            flexDirection={isSmallScreen ? 'column' : 'row'}
            flexWrap={isSmallScreen ? 'nowrap' : 'wrap'}
            // justifyContent="center"
            alignItems="center"
            gap={2}

            sx={{  width:"100%" }}
          >
            {transferOptions.map((option, index) => (
              <Card
              variant="outlined"
              sx={{
                borderColor: selectedOption === option.value ? '#D32F2F' : 'grey.300',
                borderRadius: "1px",
                borderWidth:"2px",
                maxWidth:400
              }}
            >
              <CardContent>
                <FormControlLabel
                  value={option.value}
                  control={
                    <Radio
                      sx={{
                        '&.Mui-checked': { color: '#D32F2F' },
                      }}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontSize: 14, color: "#212121" }} fontWeight="bold">
                        {option.title}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: 12, color: "#616161", fontWeight: 400 }}>
                        {option.description}
                      </Typography>
                    </Box>
                  }
                  sx={{ width: '100%', alignItems: 'flex-start' }}
                />
              </CardContent>
            </Card>
            ))}
          </Box>

        </RadioGroup>

        <Box mt={4} textAlign="center">
          <Button
            onClick={handleStartTransfer}
            sx={{
              borderRadius: "2px",
              textTransform: "uppercase",
              fontSize: 12,
              fontWeight: 600,
              boxShadow: 0,
              backgroundColor: "#D32F2F",
              "&:hover": { boxShadow: "none" },
            }}
            variant="contained"
          >
            Start transfer
          </Button>
        </Box>
      </Container>
    ) : (
      // Screen that changes based on selected option
      <Box 
      // sx={{ mt: 5, textAlign: 'center' }}
      >
        {/* Back Button */}
        
        {selectedOption === 'bank' && (
          <BankTransfer
          setShowScreen = {setShowScreen}/>
        )}
        {selectedOption === 'mobile' && (
          <MobileTransfer
          setShowScreen = {setShowScreen}
          />
        )}
        {selectedOption === 'zenopay' && (
          <ZenopayTransfer
          setShowScreen = {setShowScreen}
          />
        )}
        {selectedOption === 'float' && (
          <WalletToFloat
          setShowScreen = {setShowScreen}
          />
        )}
        {selectedOption === 'currency' && (
          <>
            <Typography variant="h5" gutterBottom>Transfer Between Currency Balances</Typography>
            <Typography>Form or content for Currency Balance Transfer goes here...</Typography>
          </>
        )}

      </Box>
    )}

      
    </Box>
  )
}
export default NewTransfer
