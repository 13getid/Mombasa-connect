import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import CustomerPortal from "./CustomerPortal";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {location.pathname === "/dashboard" ? <CustomerPortal /> : <App />}
  </React.StrictMode>,
);
