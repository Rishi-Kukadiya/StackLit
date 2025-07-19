import React from 'react';
import { Home, MessageCircle, Tag, Users, Plus } from 'lucide-react';
import styles from '../styles/components.module.css';
import ComponentBackground from './ComponentBackground';

const Sidebar = ({ isOpen }) => {
  const navItems = [
    { icon: <Home size={20} />, label: 'Home' },
    { icon: <MessageCircle size={20} />, label: 'Questions' },
    { icon: <Tag size={20} />, label: 'Tags' },
    { icon: <Users size={20} />, label: 'Users' },
    { icon: <Plus size={20} />, label: 'Ask Question' },
  ];

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
      <ComponentBackground numIcons={4}>
        <nav>
          {navItems.map((item) => (
            <a
              key={item.label}
              href="#"
              className={styles.navItem}
              aria-label={item.label}
            >
              {item.icon}
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </ComponentBackground>
    </aside>
  );
};

export default Sidebar;
