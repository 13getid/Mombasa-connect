import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import CustomerPortal from "./CustomerPortal";

const isCustomerPortal = location.pathname.replace(/\/+$/, "") === "/dashboard";
const styles = isCustomerPortal ? import("./portal.css") : import("./index.css");

styles.then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>{isCustomerPortal ? <CustomerPortal /> : <App />}</React.StrictMode>,
  );
});
