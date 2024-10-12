import { toast } from 'react-toastify';

// Function for Success Toast
export const successToast = (message) => {
  toast.success(message, {
    position: 'top-center',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    style: {
      background: 'linear-gradient(45deg, #6d28d9, #1c1132)',
      color: '#ffffff',
      borderRadius: '10px',
      boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.5)',
    },
    icon: false, // You can add an icon if desired
  });
};

// Function for Failure Toast
export const errorToast = (message) => {
  toast.error(message, {
    position: 'top-center',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    style: {
      background: 'linear-gradient(45deg, #d9534f, #1c1132)',
      color: '#ffffff',
      borderRadius: '10px',
      boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.5)',
    },
    icon: false, // You can add an icon if desired
  });
};
