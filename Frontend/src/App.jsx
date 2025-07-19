
import React, { useState } from 'react';
import Layout from './components/Layout';
import QuestionList from './components/QuestionList';
import { 
  Code, 
  Binary, 
  Database, 
  FileCode, 
  GitBranch, 
  Terminal, 
  Globe, 
  Server 
} from 'lucide-react';
import './styles/globals.css';
import styles from './styles/App.module.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const icons = [
    { component: Code, color: '#C8ACD6' },      // Theme highlight color
    { component: Binary, color: '#6B5CA5' },    // Lighter accent
    { component: Database, color: '#433D8B' },  // Theme accent
    { component: FileCode, color: '#2E236C' },  // Secondary bg
    { component: GitBranch, color: '#C8ACD6' }, // Theme highlight
    { component: Terminal, color: '#6B5CA5' },  // Lighter accent
    { component: Globe, color: '#433D8B' },     // Theme accent
    { component: Server, color: '#2E236C' }     // Secondary bg
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={styles.appWrapper}>
      <div className={styles.backgroundAnimation}>
        {Array.from({ length: 20 }).map((_, index) => {
          const icon = icons[index % icons.length];
          return (
            <div
              key={index}
              className={styles.floatingIcon}
              style={{
                '--delay': `${Math.random() * 25}s`,
                '--duration': `${Math.random() * 25 + 35}s`,
                '--scale': `${Math.random() * 0.5 + 0.8}`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                color: icon.color
              }}
            >
              <icon.component size={100} strokeWidth={1} />
            </div>
          );
        })}
      </div>
      <Layout sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar}>
        <QuestionList />
      </Layout>
    </div>
  );
}

export default App;
