import React from 'react';
import Sidebar from './SideBar';
import { Outlet } from 'react-router-dom';


const Layout = () => {
    return (
        <div className="app-container">
            <Sidebar />
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};


export default Layout;