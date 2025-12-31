import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    FiGrid,
    FiUpload,
    FiBarChart2
} from "react-icons/fi";
import './SideBar.css';
const Sidebar = ({ mobileOpen, onClose }) => {
    return (
        <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
            <h2 className="logo">SOC Assistant</h2>
            <nav className="sidebar-nav" onClick={onClose}>
                <ul>
                    <li>
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) =>
                                `nav-item ${isActive ? "active" : ""}`
                            }
                        >
                            <FiGrid className="nav-icon" />
                            <span>Dashboard</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/upload"
                            className={({ isActive }) =>
                                `nav-item ${isActive ? "active" : ""}`
                            }
                        >
                            <FiUpload className="nav-icon" />
                            <span>Upload File</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/analysis"
                            className={({ isActive }) =>
                                `nav-item ${isActive ? "active" : ""}`
                            }
                        >
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