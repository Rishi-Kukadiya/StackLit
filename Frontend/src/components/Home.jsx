import React from "react";
import Navbar from "./Navbar";
import CanvasBackground from "../CanvasBackground";
import Sidebar from "./Sidebar";
export default function Home() {
  return (
    <>
      <CanvasBackground />
      <div className="relative min-h-screen">
        <Navbar />
        <Sidebar />
      </div>
    </>
  );
}
