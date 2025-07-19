import React, { useState } from 'react';
import { Library, Search, LogIn, UserPlus, Menu } from 'lucide-react';
import styles from '../styles/components.module.css';

const Navbar = ({ toggleSidebar }) => {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <nav className={styles.navbar}>
      <button className={styles.menuButton} onClick={toggleSidebar} aria-label="Toggle menu">
        <Menu size={24} />
      </button>

      <div className={styles.logo}>
        <Library size={24} />
        <span>StackLit</span>
      </div>

      <div className={styles.searchBar}>
        <Search size={20} />
        <input
          type="text"
          placeholder="Search..."
          className={styles.searchInput}
          aria-label="Search"
        />
      </div>

      {showSearch && (
        <div className={styles.searchBarMobile}>
          <Search size={20} />
          <input
            type="text"
            placeholder="Search..."
            className={styles.searchInput}
            aria-label="Search"
          />
        </div>
      )}

      <div className={styles.authButtons}>
        <button className={styles.authButton}>
          <LogIn size={20} />
          <span>Sign In</span>
        </button>
        <button className={styles.authButton}>
          <UserPlus size={20} />
          <span>Sign Up</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
