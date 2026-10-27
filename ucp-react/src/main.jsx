import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import "./styles/global.css";


import App from "./App.jsx";

import AdminAuthProvider from "./admin/context/AdminAuthContext";
import AdminThemeProvider from "./admin/context/AdminThemeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AdminThemeProvider>
        <AdminAuthProvider>
          <App />
          <Toaster position="top-right" />
        </AdminAuthProvider>
      </AdminThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);