import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import CustomerPortal from "./CustomerPortal";
import { ThemeProvider } from "./theme";
import "./theme.css";

const isCustomerPortal = location.pathname.replace(/\/+$/, "") === "/dashboard";
const styles = isCustomerPortal ? import("./portal.css") : import("./index.css");

styles.then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <ThemeProvider>{isCustomerPortal ? <CustomerPortal /> : <App />}</ThemeProvider>
    </React.StrictMode>,
  );
});
