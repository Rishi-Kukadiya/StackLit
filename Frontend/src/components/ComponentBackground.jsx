import React from 'react';
import { Heart, Star, Sparkle } from 'lucide-react';
import styles from './ComponentBackground.module.css';

const ComponentBackground = ({ children, numIcons = 5 }) => {
  const icons = [Heart, Star, Sparkle];
  
  return (
    <div className={styles.componentBackground}>
      <div className={styles.floatingIconsContainer}>
        {Array.from({ length: numIcons }).map((_, index) => {
          const IconComponent = icons[index % icons.length];
          return (
            <div
              key={index}
              className={styles.miniFloatingIcon}
              style={{
                '--delay': `${Math.random() * 5}s`,
                '--duration': `${Math.random() * 10 + 10}s`,
                '--scale': `${Math.random() * 0.3 + 0.2}`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            >
              <IconComponent
                size={40}
                style={{
                  opacity: 0.6,
                  color: '#FF69B4',
                  filter: 'drop-shadow(0 0 15px rgba(255, 105, 180, 0.8))',
                }}
              />
            </div>
          );
        })}
      </div>
      <div className={styles.componentContent}>
        {children}
      </div>
    </div>
  );
};

export default ComponentBackground;
