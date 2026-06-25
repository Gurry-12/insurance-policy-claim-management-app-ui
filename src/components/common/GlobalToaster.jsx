import { Toaster } from "react-hot-toast";

const GlobalToaster = () => {
  return (
    <Toaster 
      position="top-center"
      toastOptions={{
        style: {
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.4)',
          boxShadow: 'var(--ss-shadow)',
          color: 'var(--ss-text-primary)',
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
