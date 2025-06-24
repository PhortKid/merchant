import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  ListSubheader,
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Logout,
  Analytics,
  PostAdd,
  Article,
  Drafts,
  SwapHoriz,
  ReceiptLong,
  Mail,
  ElectricalServices,
  Business,
  Lock,
  Password,
  ForwardToInbox,
  EventNote,
  EditNote,
  AccountTree,
  Receipt,
  EditCalendar,
  EventAvailable,
  PersonAddAlt,
  PersonAddAlt1,
  PeopleAlt,
} from "@mui/icons-material";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

const SideBar = ({ mobileOpen, handleDrawerToggle }) => {
  const location = useLocation(); // Get current route location
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { logout} = useAuth();

  return ( 
    <Drawer
      variant={isMobile ?"temporary" : "permanent"}
      open={mobileOpen}
      sx={{
        width: mobileOpen ? 240 : 60,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: mobileOpen ? 240 : 60,
          boxSizing: "border-box",
          transition: "width 0.3s",
          overflowX: "hidden",
        },
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" p={1}>
        {/* {mobileOpen && <Typography variant="h6" sx={{
                      fontSize:14,
                      fontWeight:600,
                      textTransform:"none",
                      color:"#d32f2f"
                    }}>Zenopay</Typography>} */}
        <IconButton onClick={handleDrawerToggle}>
          <MenuIcon />
        </IconButton>
      </Box>

       <List
      >
        <ListItem button            
            component={NavLink}
            to="/dashboard"
            onClick={isMobile ? handleDrawerToggle : undefined}
            style={({ isActive }) => ({
              // borderRadius:"2px",
              backgroundColor: isActive ? "#fde8e8" : "transparent",
              color: isActive ? "#d32f2f" : "inherit",
              textDecoration: "none",
              fontWeight:isActive ?600 : 400,
            })}
        >
          <ListItemIcon sx={{ color: "inherit" }}>
            <Analytics />
          </ListItemIcon>
          {mobileOpen && <ListItemText primary={
            <Typography sx={{
                  fontSize:12,
                  textTransform:"uppercase",
                  fontWeight: location.pathname === "/dashboard" ? "bold" : "normal",
            }}>
              Overview
            </Typography>
          }
           />}
        </ListItem>
      </List>

      <Divider />

      {/* 

      <Divider /> */}

      <List
        subheader={
          mobileOpen && <ListSubheader component="div">
             <Typography variant="subtitle1" sx={{
              fontSize:10,
              textTransform:"uppercase",
              color:"#bcbcbc",
              marginY:2,
              fontWeight:500
            }}>
              Api keys & sender ids
            </Typography>
          </ListSubheader>
        }
      >
        <ListItem button            
            component={NavLink}
            to="/api-key-list"
            onClick={isMobile ? handleDrawerToggle : undefined}
            style={({ isActive }) => ({
              // borderRadius:"2px",
              backgroundColor: isActive ? "#fde8e8" : "transparent",
              color: isActive ? "#d32f2f" : "inherit",
              textDecoration: "none",
              fontWeight:isActive ?600 : 400,
            })}>
          <ListItemIcon sx={{ color: "inherit" }}>
            <Article />
          </ListItemIcon>
          {mobileOpen && <ListItemText primary={
            <Typography sx={{
                  fontSize:12,
                  textTransform:"uppercase",
                  fontWeight: location.pathname === "/api-key-list" ? "bold" : "normal",
            }}>
              Api keys list
            </Typography>
          } />}
        </ListItem>
        <ListItem button            
            component={NavLink}
            to="/new-api-key"
            onClick={isMobile ? handleDrawerToggle : undefined}
            style={({ isActive }) => ({
              // borderRadius:"2px",
              backgroundColor: isActive ? "#fde8e8" : "transparent",
              color: isActive ? "#d32f2f" : "inherit",
              textDecoration: "none",
              fontWeight:isActive ?600 : 400,
            })}>
          <ListItemIcon sx={{ color: "inherit" }}>
            <PostAdd />
          </ListItemIcon>
          {mobileOpen && <ListItemText primary={
            <Typography sx={{
                  fontSize:12,
                  textTransform:"uppercase",
                  fontWeight: location.pathname === "/new-api-key" ? "bold" : "normal",
            }}>
              Create new api key
            </Typography>
          } />}
        </ListItem>
         <ListItem button            
            component={NavLink}
            to="/sender-ids-list"
            onClick={isMobile ? handleDrawerToggle : undefined}
            style={({ isActive }) => ({
              // borderRadius:"2px",
              backgroundColor: isActive ? "#fde8e8" : "transparent",
              color: isActive ? "#d32f2f" : "inherit",
              textDecoration: "none",
              fontWeight:isActive ?600 : 400,
            })}>
          <ListItemIcon sx={{ color: "inherit" }}>
            <AccountTree />
          </ListItemIcon>
          {mobileOpen && <ListItemText primary={
            <Typography sx={{
                  fontSize:12,
                  textTransform:"uppercase",
                  fontWeight: location.pathname === "/sender-ids-list" ? "bold" : "normal",
            }}>
              sender ids list
            </Typography>
          } />}
        </ListItem>
        <ListItem button            
            component={NavLink}
            to="/new-sender-id"
            onClick={isMobile ? handleDrawerToggle : undefined}
            style={({ isActive }) => ({
              // borderRadius:"2px",
              backgroundColor: isActive ? "#fde8e8" : "transparent",
              color: isActive ? "#d32f2f" : "inherit",
              textDecoration: "none",
              fontWeight:isActive ?600 : 400,
            })}>
          <ListItemIcon sx={{ color: "inherit" }}>
            <EditNote />
          </ListItemIcon>
          {mobileOpen && <ListItemText primary={
            <Typography sx={{
                  fontSize:12,
                  textTransform:"uppercase",
                  fontWeight: location.pathname === "/new-sender-id" ? "bold" : "normal",
            }}>
              Request new sender id
            </Typography>
          } />}
        </ListItem>
       
      </List>

      <Divider />
      <List
        subheader={mobileOpen && <ListSubheader component="div">
          <Typography variant="subtitle1" sx={{
              fontSize:10,
              textTransform:"uppercase",
              color:"#bcbcbc",
              marginY:2,
              fontWeight:500
            }}>
              Payments & Transfers
            </Typography>
          </ListSubheader>}
      >
        <ListItem button            
            component={NavLink}
            to="/utility-payments"
            onClick={isMobile ? handleDrawerToggle : undefined}
            style={({ isActive }) => ({
              // borderRadius:"2px",
              backgroundColor: isActive ? "#fde8e8" : "transparent",
              color: isActive ? "#d32f2f" : "inherit",
              textDecoration: "none",
              fontWeight:isActive ?600 : 400,
            })}>
          <ListItemIcon sx={{ color: "inherit" }}>
            <ElectricalServices/>
          </ListItemIcon>
          {mobileOpen && <ListItemText primary={
            <Typography sx={{
                  fontSize:12,
                  textTransform:"uppercase",
                  fontWeight: location.pathname === "/utility-payments" ? "bold" : "normal",
            }}>
              Utility Payments
            </Typography>
          } />}
        </ListItem>
        <ListItem button            
            component={NavLink}
            to="/receive-payments"
            onClick={isMobile ? handleDrawerToggle : undefined}
            style={({ isActive }) => ({
              // borderRadius:"2px",
              backgroundColor: isActive ? "#fde8e8" : "transparent",
              color: isActive ? "#d32f2f" : "inherit",
              textDecoration: "none",
              fontWeight:isActive ?600 : 400,
            })}>
          <ListItemIcon sx={{ color: "inherit" }}>
            <Receipt/>
          </ListItemIcon>
          {mobileOpen && <ListItemText primary={
            <Typography sx={{
                  fontSize:12,
                  textTransform:"uppercase",
                  fontWeight: location.pathname === "/receive-payments" ? "bold" : "normal",
            }}>
              Receive Payments
            </Typography>
          } />}
        </ListItem>
        <ListItem button            
            component={NavLink}
            to="/new-transfer"
            onClick={isMobile ? handleDrawerToggle : undefined}
            style={({ isActive }) => ({
              // borderRadius:"2px",
              backgroundColor: isActive ? "#fde8e8" : "transparent",
              color: isActive ? "#d32f2f" : "inherit",
              textDecoration: "none",
              fontWeight:isActive ?600 : 400,
            })}>
          <ListItemIcon sx={{ color: "inherit" }}>
            <SwapHoriz/>
          </ListItemIcon>
          {mobileOpen && <ListItemText primary={
            <Typography sx={{
                  fontSize:12,
                  textTransform:"uppercase",
                  fontWeight: location.pathname === "/new-transfer" ? "bold" : "normal",
            }}>
              New Transfer
            </Typography>
          } />}
        </ListItem>
        <ListItem button            
            component={NavLink}
            to="/transfer-history"
            onClick={isMobile ? handleDrawerToggle : undefined}
            style={({ isActive }) => ({
              // borderRadius:"2px",
              backgroundColor: isActive ? "#fde8e8" : "transparent",
              color: isActive ? "#d32f2f" : "inherit",
              textDecoration: "none",
              fontWeight:isActive ?600 : 400,
            })}>
          <ListItemIcon sx={{ color: "inherit" }}>
            <ReceiptLong/>
          </ListItemIcon>
          {mobileOpen && <ListItemText primary={
            <Typography sx={{
                  fontSize:12,
                  textTransform:"uppercase",
                  fontWeight: location.pathname === "/transfer-history" ? "bold" : "normal",
            }}>
              Transfer History
            </Typography>
          } />}
        </ListItem>
        <ListItem button            
            component={NavLink}
            to="/transaction-history"
            onClick={isMobile ? handleDrawerToggle : undefined}
            style={({ isActive }) => ({
              // borderRadius:"2px",
              backgroundColor: isActive ? "#fde8e8" : "transparent",
              color: isActive ? "#d32f2f" : "inherit",
              textDecoration: "none",
              fontWeight:isActive ?600 : 400,
            })}>
          <ListItemIcon sx={{ color: "inherit" }}>
            <EventNote/>
          </ListItemIcon>
          {mobileOpen && <ListItemText primary={
            <Typography sx={{
                  fontSize:12,
                  textTransform:"uppercase",
                  fontWeight: location.pathname === "/transaction-history" ? "bold" : "normal",
            }}>
              Transaction History
            </Typography>
          } />}
        </ListItem>
      </List>
{/*  */}
<Divider />

      <List
        subheader={
          mobileOpen && <ListSubheader component="div">
            <Typography variant="subtitle1" sx={{
              fontSize:10,
              textTransform:"uppercase",
              color:"#bcbcbc",
              marginY:2,
              fontWeight:500
            }}>
              Cards
            </Typography>
            </ListSubheader>
        }
      >
        <ListItem button            
            component={NavLink}
            to="/new-cardholder"
            onClick={isMobile ? handleDrawerToggle : undefined}
            style={({ isActive }) => ({
              // borderRadius:"2px",
              backgroundColor: isActive ? "#fde8e8" : "transparent",
              color: isActive ? "#d32f2f" : "inherit",
              textDecoration: "none",
              fontWeight:isActive ?600 : 400,
            })}>
          <ListItemIcon sx={{ color: "inherit" }}>
            <PersonAddAlt1/>
          </ListItemIcon>
          {mobileOpen && <ListItemText primary={
            <Typography sx={{
                  fontSize:12,
                  textTransform:"uppercase",
                  fontWeight: location.pathname === "/new-cardholder" ? "bold" : "normal",
            }}>
              New cardholder
            </Typography>
          } />}
        </ListItem>
        <ListItem button            
            component={NavLink}
            to="/cardholders"
            onClick={isMobile ? handleDrawerToggle : undefined}
            style={({ isActive }) => ({
              // borderRadius:"2px",
              backgroundColor: isActive ? "#fde8e8" : "transparent",
              color: isActive ? "#d32f2f" : "inherit",
              textDecoration: "none",
              fontWeight:isActive ?600 : 400,
            })}>
          <ListItemIcon sx={{ color: "inherit" }}>
            <PeopleAlt/>
          </ListItemIcon>
          {mobileOpen && <ListItemText primary={
            <Typography sx={{
                  fontSize:12,
                  textTransform:"uppercase",
                  fontWeight: location.pathname === "/cardholders" ? "bold" : "normal",
            }}>
              Cardholders
            </Typography>
          } />}
        </ListItem>
        {/* <ListItem button            
            component={NavLink}
            to="/messages"
            onClick={isMobile ? handleDrawerToggle : undefined}
            style={({ isActive }) => ({
              // borderRadius:"2px",
              backgroundColor: isActive ? "#fde8e8" : "transparent",
              color: isActive ? "#d32f2f" : "inherit",
              textDecoration: "none",
              fontWeight:isActive ?600 : 400,
            })}>
          <ListItemIcon sx={{ color: "inherit" }}>
            <ForwardToInbox/>
          </ListItemIcon>
          {mobileOpen && <ListItemText primary={
            <Typography sx={{
                  fontSize:12,
                  textTransform:"uppercase",
                  fontWeight: location.pathname === "/messages" ? "bold" : "normal",
            }}>
              Messages
            </Typography>
          } />}
        </ListItem> */}
        {/* <ListItem button            
            component={NavLink}
            to="/add-new-subcategory"
            onClick={isMobile ? handleDrawerToggle : undefined}
            style={({ isActive }) => ({
              // borderRadius:"2px",
              backgroundColor: isActive ? "#fde8e8" : "transparent",
              color: isActive ? "#d32f2f" : "inherit",
              textDecoration: "none",
              fontWeight:isActive ?600 : 400,
            })}>
          <ListItemIcon sx={{ color: "inherit" }}>
            <PlaylistAdd/>
          </ListItemIcon>
          {mobileOpen && <ListItemText primary={
            <Typography sx={{
                  fontSize:12,
                  textTransform:"uppercase",
                  fontWeight: location.pathname === "/add-new-subcategory" ? "bold" : "normal",
            }}>
              Add Subcategory
            </Typography>
          } />} 
        </ListItem>   */}
      </List>
      <Divider />

      <List
        subheader={
          mobileOpen && <ListSubheader component="div">
            <Typography variant="subtitle1" sx={{
              fontSize:10,
              textTransform:"uppercase",
              color:"#bcbcbc",
              marginY:2,
              fontWeight:500
            }}>
              Sms
            </Typography>
            </ListSubheader>
        }
      >
        <ListItem button            
            component={NavLink}
            to="/bulk-sms"
            onClick={isMobile ? handleDrawerToggle : undefined}
            style={({ isActive }) => ({
              // borderRadius:"2px",
              backgroundColor: isActive ? "#fde8e8" : "transparent",
              color: isActive ? "#d32f2f" : "inherit",
              textDecoration: "none",
              fontWeight:isActive ?600 : 400,
            })}>
          <ListItemIcon sx={{ color: "inherit" }}>
            <Drafts/>
          </ListItemIcon>
          {mobileOpen && <ListItemText primary={
            <Typography sx={{
                  fontSize:12,
                  textTransform:"uppercase",
                  fontWeight: location.pathname === "/bulk-sms" ? "bold" : "normal",
            }}>
              Bulk sms
            </Typography>
          } />}
        </ListItem>
        <ListItem button            
            component={NavLink}
            to="/1-to-1-SMS"
            onClick={isMobile ? handleDrawerToggle : undefined}
            style={({ isActive }) => ({
              // borderRadius:"2px",
              backgroundColor: isActive ? "#fde8e8" : "transparent",
              color: isActive ? "#d32f2f" : "inherit",
              textDecoration: "none",
              fontWeight:isActive ?600 : 400,
            })}>
          <ListItemIcon sx={{ color: "inherit" }}>
            <Mail/>
          </ListItemIcon>
          {mobileOpen && <ListItemText primary={
            <Typography sx={{
                  fontSize:12,
                  textTransform:"uppercase",
                  fontWeight: location.pathname === "/1-to-1-SMS" ? "bold" : "normal",
            }}>
              1-to-1 SMS
            </Typography>
          } />}
        </ListItem>
        <ListItem button            
            component={NavLink}
            to="/messages"
            onClick={isMobile ? handleDrawerToggle : undefined}
            style={({ isActive }) => ({
              // borderRadius:"2px",
              backgroundColor: isActive ? "#fde8e8" : "transparent",
              color: isActive ? "#d32f2f" : "inherit",
              textDecoration: "none",
              fontWeight:isActive ?600 : 400,
            })}>
          <ListItemIcon sx={{ color: "inherit" }}>
            <ForwardToInbox/>
          </ListItemIcon>
          {mobileOpen && <ListItemText primary={
            <Typography sx={{
                  fontSize:12,
                  textTransform:"uppercase",
                  fontWeight: location.pathname === "/messages" ? "bold" : "normal",
            }}>
              Messages
            </Typography>
          } />}
        </ListItem>
        {/* <ListItem button            
            component={NavLink}
            to="/add-new-subcategory"
            onClick={isMobile ? handleDrawerToggle : undefined}
            style={({ isActive }) => ({
              // borderRadius:"2px",
              backgroundColor: isActive ? "#fde8e8" : "transparent",
              color: isActive ? "#d32f2f" : "inherit",
              textDecoration: "none",
              fontWeight:isActive ?600 : 400,
            })}>
          <ListItemIcon sx={{ color: "inherit" }}>
            <PlaylistAdd/>
          </ListItemIcon>
          {mobileOpen && <ListItemText primary={
            <Typography sx={{
                  fontSize:12,
                  textTransform:"uppercase",
                  fontWeight: location.pathname === "/add-new-subcategory" ? "bold" : "normal",
            }}>
              Add Subcategory
            </Typography>
          } />} 
        </ListItem>   */}
      </List>
      <Divider />
      <List
        subheader={
          mobileOpen && <ListSubheader component="div">
             <Typography variant="subtitle1" sx={{
              fontSize:10,
              textTransform:"uppercase",
              color:"#bcbcbc",
              marginY:2,
              fontWeight:500
            }}>
              EVENTS
            </Typography>
          </ListSubheader>
        }
      >
        <ListItem button            
            component={NavLink}
            to="/new-event"
            onClick={isMobile ? handleDrawerToggle : undefined}
            style={({ isActive }) => ({
              // borderRadius:"2px",
              backgroundColor: isActive ? "#fde8e8" : "transparent",
              color: isActive ? "#d32f2f" : "inherit",
              textDecoration: "none",
              fontWeight:isActive ?600 : 400,
            })}>
          <ListItemIcon sx={{ color: "inherit" }}>
            <EditCalendar />
          </ListItemIcon>
          {mobileOpen && <ListItemText primary={
            <Typography sx={{
                  fontSize:12,
                  textTransform:"uppercase",
                  fontWeight: location.pathname === "/new-event" ? "bold" : "normal",
            }}>
              New Event
            </Typography>
          } />}
        </ListItem>
        <ListItem button            
            component={NavLink}
            to="/events"
            onClick={isMobile ? handleDrawerToggle : undefined}
            style={({ isActive }) => ({
              // borderRadius:"2px",
              backgroundColor: isActive ? "#fde8e8" : "transparent",
              color: isActive ? "#d32f2f" : "inherit",
              textDecoration: "none",
              fontWeight:isActive ?600 : 400,
            })}>
          <ListItemIcon sx={{ color: "inherit" }}>
            <EventAvailable />
          </ListItemIcon>
          {mobileOpen && <ListItemText primary={
            <Typography sx={{
                  fontSize:12,
                  textTransform:"uppercase",
                  fontWeight: location.pathname === "/events" ? "bold" : "normal",
            }}>
              Events
            </Typography>
          } />}
        </ListItem>
       
      </List>

      <Divider />

      <List
        subheader={
          mobileOpen && <ListSubheader component="div">
            <Typography variant="subtitle1" sx={{
              fontSize:10,
              textTransform:"uppercase",
              color:"#bcbcbc",
              marginY:2,
              fontWeight:500
            }}>
              Setting
            </Typography>
            </ListSubheader>
        }
      >
        <ListItem button            
            component={NavLink}
            to="/business-info"
            onClick={isMobile ? handleDrawerToggle : undefined}
            style={({ isActive }) => ({
              // borderRadius:"2px",
              backgroundColor: isActive ? "#fde8e8" : "transparent",
              color: isActive ? "#d32f2f" : "inherit",
              textDecoration: "none",
              fontWeight:isActive ?600 : 400,
            })}>
          <ListItemIcon sx={{ color: "inherit" }}>
            <Business/>
          </ListItemIcon>
          {mobileOpen && <ListItemText primary={
            <Typography sx={{
                  fontSize:12,
                  textTransform:"uppercase",
                  fontWeight: location.pathname === "/business-info" ? "bold" : "normal",
            }}>
              Business info
            </Typography>
          } />}
        </ListItem>
        <ListItem button            
            component={NavLink}
            to="/change-password"
            onClick={isMobile ? handleDrawerToggle : undefined}
            style={({ isActive }) => ({
              // borderRadius:"2px",
              backgroundColor: isActive ? "#fde8e8" : "transparent",
              color: isActive ? "#d32f2f" : "inherit",
              textDecoration: "none",
              fontWeight:isActive ?600 : 400,
            })}>
          <ListItemIcon sx={{ color: "inherit" }}>
            <Password/>
          </ListItemIcon>
          {mobileOpen && <ListItemText primary={
            <Typography sx={{
                  fontSize:12,
                  textTransform:"uppercase",
                  fontWeight: location.pathname === "/change-password" ? "bold" : "normal",
            }}>
              Change Password
            </Typography>
          } />}
        </ListItem>
        <ListItem button            
            component={NavLink}
            to="/change-pin"
            onClick={isMobile ? handleDrawerToggle : undefined}
            style={({ isActive }) => ({
              // borderRadius:"2px",
              backgroundColor: isActive ? "#fde8e8" : "transparent",
              color: isActive ? "#d32f2f" : "inherit",
              textDecoration: "none",
              fontWeight:isActive ?600 : 400,
            })}>
          <ListItemIcon sx={{ color: "inherit" }}>
            <Lock />
          </ListItemIcon>
          {mobileOpen && <ListItemText primary={
            <Typography sx={{
                  fontSize:12,
                  textTransform:"uppercase",
                  fontWeight: location.pathname === "/change-pin" ? "bold" : "normal",
            }}>
              Change Pin
            </Typography>
          } />}
        </ListItem>
        {/* 
        
        <ListItem button            
            component={NavLink}
            to="/add-new-subcategory"
            onClick={isMobile ? handleDrawerToggle : undefined}
            style={({ isActive }) => ({
              // borderRadius:"2px",
              backgroundColor: isActive ? "#fde8e8" : "transparent",
              color: isActive ? "#d32f2f" : "inherit",
              textDecoration: "none",
              fontWeight:isActive ?600 : 400,
            })}>
          <ListItemIcon sx={{ color: "inherit" }}>
            <PlaylistAdd/>
          </ListItemIcon>
          {mobileOpen && <ListItemText primary={
            <Typography sx={{
                  fontSize:12,
                  textTransform:"uppercase",
                  fontWeight: location.pathname === "/add-new-subcategory" ? "bold" : "normal",
            }}>
              Add Subcategory
            </Typography>
          } />} 
        </ListItem>  */}
      </List>

      <Divider />

      <List
        // subheader={
        //   mobileOpen && <ListSubheader component="div">
        //     <Typography variant="subtitle1" sx={{
        //       fontSize:10,
        //       textTransform:"uppercase",
        //       color:"#bcbcbc",
        //       marginY:2,
        //       fontWeight:500
        //     }}>
        //       Sms
        //     </Typography>
        //     </ListSubheader>
        // }
      >
        <ListItem button      
            onClick={()=>logout()}
            sx={{
              // borderRadius:"2px",
              backgroundColor:"transparent",
              color:"inherit",
              textDecoration: "none",
              fontWeight: 400,
            }}>
          <ListItemIcon sx={{ color: "inherit" }}>
            <Logout/>
          </ListItemIcon>
          {mobileOpen && <ListItemText primary={
            <Typography sx={{
                  fontSize:12,
                  textTransform:"uppercase",
            }}>
              Logout
            </Typography>
          } />}
        </ListItem>
        {/* 
        <ListItem button            
            component={NavLink}
            to="/subcategories"
            onClick={isMobile ? handleDrawerToggle : undefined}
            style={({ isActive }) => ({
              // borderRadius:"2px",
              backgroundColor: isActive ? "#fde8e8" : "transparent",
              color: isActive ? "#d32f2f" : "inherit",
              textDecoration: "none",
              fontWeight:isActive ?600 : 400,
            })}>
          <ListItemIcon sx={{ color: "inherit" }}>
            <Segment />
          </ListItemIcon>
          {mobileOpen && <ListItemText primary={
            <Typography sx={{
                  fontSize:12,
                  textTransform:"uppercase",
                  fontWeight: location.pathname === "/subcategories" ? "bold" : "normal",
            }}>
              SubCategories
            </Typography>
          } />}
        </ListItem>
        <ListItem button            
            component={NavLink}
            to="/add-new-subcategory"
            onClick={isMobile ? handleDrawerToggle : undefined}
            style={({ isActive }) => ({
              // borderRadius:"2px",
              backgroundColor: isActive ? "#fde8e8" : "transparent",
              color: isActive ? "#d32f2f" : "inherit",
              textDecoration: "none",
              fontWeight:isActive ?600 : 400,
            })}>
          <ListItemIcon sx={{ color: "inherit" }}>
            <PlaylistAdd/>
          </ListItemIcon>
          {mobileOpen && <ListItemText primary={
            <Typography sx={{
                  fontSize:12,
                  textTransform:"uppercase",
                  fontWeight: location.pathname === "/add-new-subcategory" ? "bold" : "normal",
            }}>
              Add Subcategory
            </Typography>
          } />} 
        </ListItem>  */}
      </List>

      

      {/* <List>
        {[{ text: "Home", icon: <Home/> },
          { text: "About", icon: <Info/> },
          { text: "Settings", icon: <Settings /> },
          { text: "Logout", icon: <Logout /> }].map(({ text, icon }) => (
          <ListItem button key={text}>
            <ListItemIcon>{icon}</ListItemIcon>
            {mobileOpen && <ListItemText primary={text} />}
          </ListItem>
        ))}
      </List> */}
    </Drawer>
  )
}

export default SideBar


// import { Box, Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material';
// import React from 'react'
// import AnalyticsIcon from '@mui/icons-material/Analytics';
// import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
// import FolderIcon from '@mui/icons-material/Folder';
// import AssignmentIcon from '@mui/icons-material/Assignment';
// import { NavLink, useLocation } from "react-router-dom";
// import MenuIcon from '@mui/icons-material/Menu';
// import SubCategories from './SubCategories';



// const menuItems = [
//   { text: "Overview", icon: <AnalyticsIcon/>, path: "/overview" },
//   { text: "Categories", icon: <FolderIcon />, path: "/categories-manager" },
//   { text: "Products", icon: <ShoppingBagIcon />, path: "/products" },
//   { text: "Orders", icon: <AssignmentIcon/>, path: "/orders" },
// ];

// const SideBar = ({ mobileOpen, handleDrawerToggle }) => {
  // const location = useLocation(); // Get current route location
  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

//   const drawerWidth = mobileOpen ? 240 : 60;

//   const drawer = (
//     <Box 
//       sx={{
//         height: "100%",
//         p: 2,
//       }}>

        
//       <Toolbar />
//        <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
//         {/* {open && 
//         <Typography variant="h6">My App</Typography>} */}
//         <IconButton onClick={handleDrawerToggle}>
//           <MenuIcon/>
//         </IconButton>
//       </Box>
//       {/* <Divider /> */}
//       <List>
//         {menuItems.map((item) => (
//           <ListItem
//             button
//             key={item.text}
            // component={NavLink}
            // to={item.path}
            // onClick={isMobile ? handleDrawerToggle : undefined}
            // style={({ isActive }) => ({
            //   borderRadius:"2px",
            //   backgroundColor: isActive ? "#fde8e8" : "transparent",
            //   color: isActive ? "#d32f2f" : "inherit",
            //   textDecoration: "none",
            //   fontWeight:isActive ?600 : 400,
            // })}
//           >
//             <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
//             <ListItemText primary={
//                 <Typography variant='body2'
//                  sx={{
                    // fontSize:12,
                    // textTransform:"uppercase",
                    // fontWeight: location.pathname === item.path ? "bold" : "normal",
//                 }}>{item.text}</Typography>
//                 } />
//           </ListItem>
//         ))}
//       </List>
//     </Box>
//   );

//   return (
//    <>
//       {/* Mobile Drawer */}
//       <Drawer
//         variant="temporary"
//         open={mobileOpen}
//         onClose={handleDrawerToggle}
//         ModalProps={{
//           keepMounted: true,
//         }}
//         sx={{
//           display: { xs: "block", sm: "none" },
//           flexShrink: 0,

//           "& .MuiDrawer-paper": { 
//             width: drawerWidth,
//             boxSizing: "border-box",
//             // px:2,
//         },
//         }}
//       >
//         {drawer}
//       </Drawer>

//       {/* Desktop Drawer */}
//       <Drawer
//         variant="permanent"
//         sx={{
//           display: { xs: "none", sm: "block" },     
//           flexShrink: 0,

//           "& .MuiDrawer-paper": { 
//             width: drawerWidth,
//             boxSizing: "border-box", 
//             // px:2
//           },
//         }}
//         open
//       >
//         {drawer}
//       </Drawer>
//     </>
//   )
// }

// export default SideBar