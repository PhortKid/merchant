// import { Box,} from '@mui/material'
// import React, { useState } from 'react'
// import HeaderNav from '../components/HeaderNav'
// import DashBoardSidebar from '../components/DashBoardSidebar';
// import Overview from './../components/Overview';
// import ApiKeys from './../components/ApiKeys';
// import ReqSenderId from './../components/ReqSenderId';
// import CreateNewApiKey from '../components/CreateNewApiKey';
// import SenderIds from '../components/SenderIds';

// const Dashboard = () => {
//   const [activeTab, setActiveTab] = useState('Overview');
//   const [showMegaMenu, setShowMegaMenu] = useState(false);

//   const renderTabContent = () => {
//       switch (activeTab) {
//         case 'Overview':
//           return <Overview />;
//         case 'Api keys list':
//           return <ApiKeys />;
//         case 'Create new api key':
//           return <CreateNewApiKey />;
//         case 'Sender ids list':
//           return <SenderIds />;
//         case 'Request sender id':
//           return <ReqSenderId />;
//         default:
//           return null;
//       }
//     };
//   return (
//     <Box component="main" sx={{height: '100vh', 
//       bgcolor:"grey.50",
//       width:"100%",
//       overflow: "auto", // or "scroll" or "visible"
//       }}> 
//        <HeaderNav
//           showMegaMenu={showMegaMenu}
//           setShowMegaMenu={setShowMegaMenu}
//       /> 
//       <DashBoardSidebar
//         showMegaMenu={showMegaMenu}
//         setShowMegaMenu={setShowMegaMenu}
//         activeTab={activeTab}
//         setActiveTab={setActiveTab}
//       />
//       {renderTabContent()}
//       </Box>
//   )
// }

// export default Dashboard


import { Box } from '@mui/material'
import React from 'react'
import Overview from '../components/Overview.jsx'

const Dashboard = () => {
  return (
      <Overview/>
  )
}

export default Dashboard
