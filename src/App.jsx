import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { HOST } from "./utils/contstants";
import { io } from "socket.io-client";

export const socket = io(HOST);
socket.on('connectedRoom',data=>console.log(data))
export default function App() {
  return (
    <>
      <Toaster position="bottom-center" />
      <Header />
      <Outlet />
    </>
  );
}
