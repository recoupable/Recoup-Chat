"use client";

import Chat from "../Chat";
import Sidebar from "../Sidebar/Sidebar";

const LandingPage = () => (
  <div className="flex">
    <Sidebar />
    <Chat />
  </div>
);

export default LandingPage;
