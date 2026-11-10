import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import CustomerPortal from "./CustomerPortal";
import GuidePortal from "./GuidePortal";
import { ThemeProvider } from "./theme";
import "./theme.css";

const pathname = location.pathname.replace(/\/+$/, "");
const isCustomerPortal = pathname === "/dashboard";
const isGuidePortal = pathname === "/guide";
const styles = isCustomerPortal
  ? import("./portal.css")
  : isGuidePortal
    ? import("./guide.css")
    : import("./index.css");

styles.then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <ThemeProvider>
        {isCustomerPortal ? <CustomerPortal /> : isGuidePortal ? <GuidePortal /> : <App />}
      </ThemeProvider>
    </React.StrictMode>,
  );
});
