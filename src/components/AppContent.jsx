import {
    Routes,
    Route,
    useLocation,
  } from 'react-router-dom';
  import { useState } from 'react';
  import {
    Box,
    IconButton,
    Typography,
    useMediaQuery,
    useTheme,
  } from '@mui/material';
  import {Menu} from "@mui/icons-material";
  import SideBar from './SideBar.jsx';
  import Login from '../pages/Login.jsx';
  import Registration from '../pages/Registration.jsx';
  import ProtectedRoute from './ProtectedRoute.jsx';
  import Dashboard from '../pages/Dashboard.jsx';
  import ApiKeysList from '../pages/ApiKeysList.jsx';
  import NewApiKey from '../pages/NewApiKey.jsx';
  import BulSmsSend from '../pages/BulSmsSend.jsx';
  import NewTransfer from '../pages/NewTransfer.jsx';
  import TransferHistory from '../pages/TransferHistory.jsx';
  import SendSms from '../pages/SendSms.jsx';
  import UtilityPayments from './../pages/UtilityPayments.jsx';
  import Business from '../pages/Business.jsx';
  import Password from '../pages/Password.jsx';
  import Pin from '../pages/Pin.jsx';
  import SentMessages from '../pages/SentMessages.jsx';
  import TransactionHistory from './../pages/TransactionHistory.jsx';
  import ReqSenderId from '../pages/ReqSenderId.jsx';
  import SenderIds from '../pages/SenderIds.jsx';
  import ReceivePayments from '../pages/ReceivePayments.jsx';
  import NewEvent from '../pages/NewEvent.jsx';
  import Events from '../pages/Events.jsx';
  import ForgotPassword from '../pages/ForgotPassword.jsx';
  import CreateCardHolder from '../pages/CreateCardHolder.jsx';
  import CardHolders from '../pages/CardHolders.jsx';
  
  function AppContent() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const location = useLocation(); // ✅ now safe here
  
    const handleDrawerToggle = () => {
      setMobileOpen(!mobileOpen);
    };
  
    const noSidebarRoutes = ['/login', '/registration','/forgot-password'];
    const shouldShowSidebar = !noSidebarRoutes.includes(location.pathname);
  
    const drawerWidth = mobileOpen ? 240 : 60;
  
    return (
      <Box sx={{ display: "flex" }}>
        {shouldShowSidebar && (
          <SideBar
            mobileOpen={mobileOpen}
            handleDrawerToggle={handleDrawerToggle}
          />
        )}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
          //   p: 3,
            width: shouldShowSidebar
              ? { sm: `calc(100% - ${drawerWidth}px)` }
              : "100%",
            ml: shouldShowSidebar ? { sm: `20px` } : 0,
            boxSizing: 'border-box' // Ensures padding is included in width calculation
          }}
        >
          
          {isMobile && shouldShowSidebar && !mobileOpen && (
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              px={2}
            >
              {/* <Typography
                variant="h6"
                sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  textTransform: "none",
                  color: "#d32f2f",
                }}
              >
                ShopQik
              </Typography> */}
              <IconButton onClick={handleDrawerToggle}>
                <Menu/>
              </IconButton>
            </Box>
          )}
          <Routes>
            <Route path="/login" element={<Login/>} />
            <Route path="/registration" element={<Registration/>} />
            <Route path="/forgot-password" element={<ForgotPassword/>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/api-key-list" element={<ProtectedRoute><ApiKeysList/></ProtectedRoute>} />
            <Route path="/new-api-key" element={<ProtectedRoute><NewApiKey /></ProtectedRoute>} />
            <Route path="/bulk-sms" element={<ProtectedRoute><BulSmsSend /></ProtectedRoute>} />
            <Route path="/new-transfer" element={<ProtectedRoute><NewTransfer /></ProtectedRoute>} />
            <Route path="/transfer-history" element={<ProtectedRoute><TransferHistory/></ProtectedRoute>} />
            <Route path="/1-to-1-SMS" element={<ProtectedRoute><SendSms/></ProtectedRoute>} />
            <Route path="/utility-payments" element={<ProtectedRoute><UtilityPayments/></ProtectedRoute>} />
            <Route path="/business-info" element={<ProtectedRoute><Business/></ProtectedRoute>} />
            <Route path="/change-password" element={<ProtectedRoute><Password/></ProtectedRoute>} />
            <Route path="/change-pin" element={<ProtectedRoute><Pin/></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><SentMessages/></ProtectedRoute>} />
            <Route path="/transaction-history" element={<ProtectedRoute><TransactionHistory/></ProtectedRoute>} />
            <Route path="/new-sender-id" element={<ProtectedRoute><ReqSenderId/></ProtectedRoute>} />
            <Route path="/sender-ids-list" element={<ProtectedRoute><SenderIds/></ProtectedRoute>} />
            <Route path="/receive-payments" element={<ProtectedRoute><ReceivePayments/></ProtectedRoute>} />
            <Route path="/new-event" element={<ProtectedRoute><NewEvent /></ProtectedRoute>} />
            <Route path="/events" element={<ProtectedRoute><Events/></ProtectedRoute>} />
            <Route path="/new-cardholder" element={<ProtectedRoute><CreateCardHolder/></ProtectedRoute>} />
            <Route path="/cardholders" element={<ProtectedRoute><CardHolders/></ProtectedRoute>} />
            {/* 
            <Route path="/add-new-category" element={<ProtectedRoute><AddNewCategory /></ProtectedRoute>} />
            <Route path="/subcategories" element={<ProtectedRoute><SubCategories /></ProtectedRoute>} />
            <Route path="/add-new-subcategory" element={<ProtectedRoute><AddNewSubCategory /></ProtectedRoute>} />
            <Route path="/products" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Categories /></ProtectedRoute>} /> */}
            <Route path="*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          </Routes>
        </Box>
      </Box>
    );
  }
  
  export default AppContent;
  