import React from 'react';
import { Box, Code, Terminal, GitBranch, Star, Heart, Zap, Award, Crown } from 'lucide-react';
import styles from './AnimatedBackground.module.css';

const AnimatedBackground = ({ children }) => {
  const icons = [Box, Code, Terminal, GitBranch, Star, Heart, Zap, Award, Crown];
  
  return (
    <div className={styles.backgroundWrapper}>
      <div className={styles.backgroundContent}>
        {Array.from({ length: 30 }).map((_, index) => {
          const IconComponent = icons[index % icons.length];
          return (
            <div key={index} className={styles.floatingIcon} style={{
              '--delay': `${Math.random() * 15}s`,
              '--duration': `${Math.random() * 15 + 20}s`,
              '--scale': `${Math.random() * 0.8 + 0.5}`,
              '--start-x': `${Math.random() * 100}%`,
              '--start-y': `${Math.random() * 100}%`,
            }}>
              <IconComponent
                size={60}
                style={{
                  opacity: 0.5,
                  color: '#FF69B4',
                  transform: `rotate(${Math.random() * 360}deg)`,
                  filter: 'drop-shadow(0 0 15px rgba(255, 105, 180, 0.6))',
                }}
              />
            </div>
          );
        })}
      </div>
      <div className={styles.contentWrapper}>
        {children}
      </div>
    </div>
  );
};

export default AnimatedBackground;
