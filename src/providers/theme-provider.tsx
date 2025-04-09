"use client";
import React from "react";
import { ConfigProvider } from "antd";

function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#164863",
          borderRadius: 6,
        },
        components: {
          Button: {
            controlHeight: 40,
            colorPrimaryActive: "#164863",
            colorBorder: "#164863",
            boxShadow: "none",
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
            borderRadius: 4,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}

export default ThemeProvider;
