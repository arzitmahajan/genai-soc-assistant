import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    FiGrid,
    FiUpload,
    FiBarChart2
} from "react-icons/fi";
import './SideBar.css';
const Sidebar = () => {
    return (
        <aside className="sidebar">
            <h2 className="logo">SOC Assistant</h2>
            <nav className="sidebar-nav">
                <ul>
                    <li>
                        <NavLink to="/" end className="nav-item">
                            <FiGrid className="nav-icon" />
                            <span>Dashboard</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/upload" className="nav-item">
                            <FiUpload className="nav-icon" />
                            <span>Upload File</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/analysis" className="nav-item">
                            <FiBarChart2 className="nav-icon" />
                            <span>Analysis</span>
                        </NavLink>
                    </li>
                </ul>
            </nav>

        </aside>
    );
};

export default Sidebar;