import { createRoot } from "react-dom/client";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>,
);
