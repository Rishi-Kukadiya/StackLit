import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import styles from '../styles/components.module.css';

const Layout = ({ children, sidebarOpen, toggleSidebar }) => {
  return (
    <div className={styles.layout}>
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
