// Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import "../style-css/style-sidebar.css";

const Layout = () => {
  return (
    <>
    <div>
      <Sidebar />
      <section className="home">
      <Outlet />
      </section>
      </div>
    </>
  );
};

export default Layout;
