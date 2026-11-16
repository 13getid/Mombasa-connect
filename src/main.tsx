import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "./shared/theme/theme";
import "./shared/theme/theme.css";

const App = lazy(() => import("./public/App"));
const CustomerPortal = lazy(() => import("./customer/CustomerPortal"));
const GuidePortal = lazy(() => import("./guide/GuidePortal"));
const AdminPortal = lazy(() => import("./admin/AdminPortal"));

const pathname = location.pathname.replace(/\/+$/, "");
const isAdminPortal = pathname === "/admin";
const isCustomerPortal = pathname === "/dashboard";
const isGuidePortal = pathname === "/guide";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <Suspense fallback={null}>
        {isAdminPortal ? (
          <AdminPortal />
        ) : isCustomerPortal ? (
          <CustomerPortal />
        ) : isGuidePortal ? (
          <GuidePortal />
        ) : (
          <App />
        )}
      </Suspense>
    </ThemeProvider>
  </React.StrictMode>,
);