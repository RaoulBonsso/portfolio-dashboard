"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#112240",
          color: "#e6f1ff",
          border: "1px solid rgba(100, 255, 218, 0.1)",
          borderRadius: "0.75rem",
          padding: "0.75rem 1rem",
        },
        success: {
          iconTheme: {
            primary: "#64ffda",
            secondary: "#112240",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#112240",
          },
        },
      }}
    />
  );
}

export { toast } from "react-hot-toast";
