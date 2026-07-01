import { Toaster } from "react-hot-toast";

const GlobalToaster = () => {
  return (
    <Toaster 
      position="top-center"
      containerStyle={{ zIndex: 999999 }}
      toastOptions={{
        style: {
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(200, 200, 200, 0.3)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          color: '#1e293b', // Hardcoded to stay dark text on light bg in both themes
          borderRadius: '12px',
        },
        success: {
          iconTheme: { primary: '#10b981', secondary: '#fff' },
        },
        error: {
          iconTheme: { primary: '#ef4444', secondary: '#fff' },
        },
      }}
    />
  );
};

export default GlobalToaster;
