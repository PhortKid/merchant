import axios from "axios";

const API_BASE_URL = "https://zenoapi.com/api"; // Change this based on your backend URL

export const IMG_BASE_URL = "https://zenoapi.com"; 

export const Register = async (newsData) => {
  const response = await axios.post(
    `${API_BASE_URL}/auth/register/`, 
    newsData,
    { 
        headers: {
             'Content-Type': 'application/json'
            }
    },
);
  return response.data;
};


export const LoginReq = async (newsData) => {
  const response = await axios.post(
    `${API_BASE_URL}/auth/login/`, 
    newsData,
    { 
        headers: {
             'Content-Type': 'application/json' 
            }
    },
);
  return response.data;
};

export const MNOSingleTransfer = async (newsData) => {
  const userDataString = localStorage.getItem('userData'); // <--- moved inside function
  const userData = JSON.parse(userDataString);
  const token = userData?.tokens?.access?.token; // safe chaining
  const response = await axios.post(
    `${API_BASE_URL}/payments/walletcashin/process/`, 
    newsData,
    { 
        headers: {
             'Content-Type': 'application/json',
             'Authorization': `Bearer ${token}`
            }
    },
);
  return response.data;
};


export const fetchUserTransactionsAndTransfers = async () => {
  const userDataString = localStorage.getItem('userData'); // <--- moved inside function
  const userData = JSON.parse(userDataString);
  const token = userData?.tokens?.access?.token; // safe chaining
  const response = await axios.get(
    `${API_BASE_URL}/payments/user/expenses/`, 
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
  });
  return response.data;
};

export const ApiKeyGen = async (newsData) => {
  const userDataString = localStorage.getItem('userData'); // <--- moved inside function
  const userData = JSON.parse(userDataString);
  const token = userData?.tokens?.access?.token; // safe chaining
  const response = await axios.post(
    `${API_BASE_URL}/auth/generate-api-key/`, 
    newsData,
    { 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
    },
);
  return response.data;
};

export const fetchUserApiKeys = async () => {
  const userDataString = localStorage.getItem('userData'); // <--- moved inside function
  const userData = JSON.parse(userDataString);
  const token = userData?.tokens?.access?.token; // safe chaining
  const response = await axios.get(
    `${API_BASE_URL}/sms/user-api-keys/`, 
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
  });
  return response.data;
};


export const fetchUserSenderIds = async () => {
  const userDataString = localStorage.getItem('userData'); // <--- moved inside function
  const userData = JSON.parse(userDataString);
  const token = userData?.tokens?.access?.token; // safe chaining
  const response = await axios.get(
    `${API_BASE_URL}/sms/sender-ids/`, 
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
  });
  return response.data;
};


// // Simulate API delay
// const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 3000));

// export const getSenderIds = async ({ page = 1, pageSize = 5, search = '', status  }) => {
//    // Filter data based on search term
//   await simulateDelay(); 
//   // Fetch the data first (await the function)
//   let filteredData = await fetchUserSenderIds();
//   if (search) {
//     const searchTerm = search.toLowerCase();
//     filteredData = fetchUserSenderIds?.filter(
//       sender => sender.sender_id.toLowerCase().includes(searchTerm)
//     );
//   }

    
//   if (status) {
//     filteredData = filteredData?.filter(sender => sender.verification_status === status);
//   }
  
//   // Paginate results
//   const startIndex = (page - 1) * pageSize;
//   const paginatedData = filteredData?.slice(startIndex, startIndex + pageSize);
  
//   return {
//     data: paginatedData,
//     total: filteredData?.length,
//     page,
//     pageSize,
//     totalPages: Math.ceil(filteredData?.length / pageSize)
//   };
// };


// Add a new sender ID
export const addSenderId = async (senderIdData) => {
  const userDataString = localStorage.getItem('userData'); // <--- moved inside function
  const userData = JSON.parse(userDataString);
  const token = userData?.tokens?.access?.token; // safe chaining
  const response = await axios.post(
    `${API_BASE_URL}/sms/sender-ids/ `, 
    senderIdData,
    { 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
    },
);
  return response.data;
};


export const fetchUserDetails = async () => {
  const userDataString = localStorage.getItem('userData'); // <--- moved inside function
  const userData = JSON.parse(userDataString);
  const token = userData?.tokens?.access?.token; // safe chaining
  const response = await axios.get(
    `${API_BASE_URL}/sms/balance/`, 
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
  });
  return response.data;
};

export const sendSms = async (smsData) => {
  const userDataString = localStorage.getItem('userData'); // <--- moved inside function
  const userData = JSON.parse(userDataString);
  const token = userData?.tokens?.access?.token; // safe chaining
  const response = await axios.post(
    `${API_BASE_URL}/sms/send/`, 
    smsData,
    { 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
    },
);
  return response.data;
};

export const fetchUserSMSs = async () => {
  const userDataString = localStorage.getItem('userData'); // <--- moved inside function
  const userData = JSON.parse(userDataString);
  const token = userData?.tokens?.access?.token; // safe chaining
  const response = await axios.get(
    `${API_BASE_URL}/sms/messages/`, 
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
  });
  return response.data;
};

export const updatePin = async (pinData) => {
  const userDataString = localStorage.getItem('userData'); // <--- moved inside function
  const userData = JSON.parse(userDataString);
  const token = userData?.tokens?.access?.token; // safe chaining
  const response = await axios.post(
    `${API_BASE_URL}/sms/change-pin/`, 
    pinData,
    { 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
    },
);
  return response.data;
};

export const updatePassword = async (passData) => {
  const userDataString = localStorage.getItem('userData'); // <--- moved inside function
  const userData = JSON.parse(userDataString);
  const token = userData?.tokens?.access?.token; // safe chaining
  const response = await axios.post(
    `${API_BASE_URL}/sms/change-password/`, 
    passData,
    { 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
    },
);
  return response.data;
};

export const fetchUserInfo = async () => {
  const userDataString = localStorage.getItem('userData'); // <--- moved inside function
  const userData = JSON.parse(userDataString);
  const token = userData?.tokens?.access?.token; // safe chaining
  const response = await axios.get(
    `${API_BASE_URL}/sms/me/`, 
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
  });
  return response.data;
};


export const utilityPays = async (utilData) => {
  const userDataString = localStorage.getItem('userData'); // <--- moved inside function
  const userData = JSON.parse(userDataString);
  const token = userData?.tokens?.access?.token; // safe chaining
  const response = await axios.post(
    `${API_BASE_URL}/payments/utilitypayment/process/`, 
    utilData,
    { 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
    },
);
  return response.data;
};

export const addNewInvoice = async (invoiceData) => {
  const userDataString = localStorage.getItem('userData'); // <--- moved inside function
  const userData = JSON.parse(userDataString);
  const token = userData?.tokens?.access?.token; // safe chaining
  const response = await axios.post(
    `${API_BASE_URL}/payments/invoices/`, 
    invoiceData,
    { 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
    },
);
  return response.data;
};

export const fetchUserInvoices = async () => {
  const userDataString = localStorage.getItem('userData'); // <--- moved inside function
  const userData = JSON.parse(userDataString);
  const token = userData?.tokens?.access?.token; // safe chaining
  const response = await axios.get(
    `${API_BASE_URL}/payments/invoices/`, 
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
  });
  return response.data;
};

export const sendBulkSms = async (invoiceData) => {
  const userDataString = localStorage.getItem('userData'); // <--- moved inside function
  const userData = JSON.parse(userDataString);
  const token = userData?.tokens?.access?.token; // safe chaining
  const response = await axios.post(
    `${API_BASE_URL}/sms/bulk/`, 
    invoiceData,
    { 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
    },
);
  return response.data;
};


export const createCardHolder = async (Data) => {
  const userDataString = localStorage.getItem('userData'); // <--- moved inside function
  const userData = JSON.parse(userDataString);
  const token = userData?.tokens?.access?.token; // safe chaining
  const response = await axios.post(
    `${API_BASE_URL}/payments/cardholders/`, 
    Data,
    { 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
    },
);
  return response.data;
};

export const fetchUserCardHolders = async () => {
  const userDataString = localStorage.getItem('userData'); // <--- moved inside function
  const userData = JSON.parse(userDataString);
  const token = userData?.tokens?.access?.token; // safe chaining
  const response = await axios.get(
    `${API_BASE_URL}/payments/my_cardholders/`,

    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
  });
  return response.data;
};
// https://zenoapi.com/api/sms/sender-ids/ 

export const initiateTransfer = async (data) => {
  const userDataString = localStorage.getItem('userData'); // <--- moved inside function
  const userData = JSON.parse(userDataString);
  const token = userData?.tokens?.access?.token; // safe chaining
  const res = await axios.post(
    `${API_BASE_URL}/payments/float-transfer/initiate/`,
     data,
    { 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
    },
  );
  return res.data;
};

export const confirmTransfer = async (data) => {
  const userDataString = localStorage.getItem('userData'); // <--- moved inside function
  const userData = JSON.parse(userDataString);
  const token = userData?.tokens?.access?.token; // safe chaining
  const res = await axios.post(
    `${API_BASE_URL}/payments/float-transfer/confirm/`, 
    data,
    { 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
    },
  );
  return res.data;
};

export const walletToFloat = async (data) => {
  const userDataString = localStorage.getItem('userData'); // <--- moved inside function
  const userData = JSON.parse(userDataString);
  const token = userData?.tokens?.access?.token; // safe chaining
  const res = await axios.post(
    `${API_BASE_URL}/sms/transfer-balance/`, 
    data,
    { 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
    },
  );
  return res.data;
};


export const bankTransfer = async (data) => {
  const userDataString = localStorage.getItem('userData'); // <--- moved inside function
  const userData = JSON.parse(userDataString);
  const token = userData?.tokens?.access?.token; // safe chaining
  const res = await axios.post(
    `${API_BASE_URL}/payments/wallet-to-bank/`, 
    data,
    { 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
    },
  );
  return res.data;
};

export const receivePayments = async (data) => {
  const userDataString = localStorage.getItem('userData'); // <--- moved inside function
  const userData = JSON.parse(userDataString);
  const token = userData?.tokens?.access?.token; // safe chaining
  const res = await axios.post(
    `${API_BASE_URL}/payments/mobile_money_tanzania`, 
    data,
    { 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
    },
  );
  return res.data;
};

export const eventCreate = async (data) => {
  const userDataString = localStorage.getItem('userData'); // <--- moved inside function
  const userData = JSON.parse(userDataString);
  const token = userData?.tokens?.access?.token; // safe chaining
  const res = await axios.post(
    `${API_BASE_URL}/payments/event-create/`, 
    data,
    { 
        headers: {
        // Do NOT set Content-Type manually when sending FormData
        'Content-Type': 'multipart/form-data' ,
        'Authorization': `Bearer ${token}`
      }
    },
  );
  return res.data;
};

// https://zenoapi.com/api/payments/event-create/


export const getEvents = async () => {
  const userDataString = localStorage.getItem('userData'); // <--- moved inside function
  const userData = JSON.parse(userDataString);
  const token = userData?.tokens?.access?.token; // safe chaining
  const response = await axios.get(
    `${API_BASE_URL}/payments/events-list/`, 
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
  });
  return response.data;
};

export const forgotPassword = async (data) => {
  const userDataString = localStorage.getItem('userData'); // <--- moved inside function
  const userData = JSON.parse(userDataString);
  const token = userData?.tokens?.access?.token; // safe chaining
  const res = await axios.post(
    `${API_BASE_URL}/password-reset-request/`, 
    data,
    { 
        headers: {
            'Content-Type': 'application/json',
            
          }
    },
  );
  return res.data;
};

