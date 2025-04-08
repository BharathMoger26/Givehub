"use client";
import React from "react";
import { ConfigProvider } from "antd";

function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#164863",
          borderRadius: 2,
        },
        components: {
          Button: {
            controlHeight: 40,
            boxShadow: "none",
            controlOutline: "none",
            colorPrimaryActive: "#164863",
            colorBorder: "#164863",
            borderColorDisabled: "transparent",
          },
          Input: {
            controlHeight: 40,
            activeBorderColor: "#164863",
            hoverBorderColor: "#164863",
            activeShadow: "none",
          },
          Select: {
            controlHeight: 40,
            controlOutline: "none",
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}

export default ThemeProvider;
