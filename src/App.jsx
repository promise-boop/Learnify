import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "styled-components";

import App from "./App";
import router from "./routes";
import theme from "./styles/theme";
import { GlobalStyles } from "./styles/GlobalStyles";
import { AuthProvider } from "./contexts/AuthContext";
import { SubjectsProvider } from "./contexts/SubjectsContext";
import { CreditsProvider } from "./contexts/CreditsContext";

import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AuthProvider>
        <SubjectsProvider>
          <CreditsProvider>
            <App />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 5000,
                style: {
                  borderRadius: '8px',
                  background: '#333',
                  color: '#fff',
                }
              }}
            />
          </CreditsProvider>
        </SubjectsProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);