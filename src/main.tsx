import React from "react";
import ReactDOM from "react-dom/client";
import App from "./public/App";
import CustomerPortal from "./customer/CustomerPortal";
import GuidePortal from "./guide/GuidePortal";
import AdminPortal from "./admin/AdminPortal";
import { ThemeProvider } from "./shared/theme/theme";
import "./shared/theme/theme.css";

const pathname = location.pathname.replace(/\/+$/, "");
const isAdminPortal = pathname === "/admin";
const isCustomerPortal = pathname === "/dashboard";
const isGuidePortal = pathname === "/guide";
const styles = isAdminPortal
  ? import("./admin/admin.css")
  : isCustomerPortal
    ? import("./customer/portal.css")
    : isGuidePortal
      ? import("./guide/guide.css")
      : import("./public/index.css");

styles.then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <ThemeProvider>
        {isAdminPortal ? (
          <AdminPortal />
        ) : isCustomerPortal ? (
          <CustomerPortal />
        ) : isGuidePortal ? (
          <GuidePortal />
        ) : (
          <App />
        )}
      </ThemeProvider>
    </React.StrictMode>,
  );
});
