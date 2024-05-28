import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <h3> user layout</h3>
      <div>{children}</div>
    </div>
  );
}
