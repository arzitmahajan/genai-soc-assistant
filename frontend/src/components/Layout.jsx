import React, { useState } from "react";
import Sidebar from "./SideBar";
import { Outlet } from "react-router-dom";
import { FiMenu } from "react-icons/fi";

const Layout = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="mobile-header">
        <button onClick={() => setOpen(!open)}>
          <FiMenu size={22} />
        </button>
        <span>SOC Assistant</span>
      </header>

      <div className="app-container">
        <Sidebar mobileOpen={open} onClose={() => setOpen(false)} />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
      {open && <div className="backdrop" onClick={() => setOpen(false)} />}

    </>
  );
};

export default Layout;
