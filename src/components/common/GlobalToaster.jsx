import { Toaster } from "react-hot-toast";

const GlobalToaster = () => {
  return (
    <Toaster 
      position="top-right"
      containerStyle={{ zIndex: 999999, top: 24, right: 24 }}
      toastOptions={{
        className: '',
        style: {
          background: '#ffffff',
          color: '#1e293b',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          borderRadius: '6px',
          padding: '12px 16px',
          fontSize: '0.875rem', // 14px
          fontWeight: '500',
          maxWidth: '400px'
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
