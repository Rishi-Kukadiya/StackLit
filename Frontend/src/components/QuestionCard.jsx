import React from 'react';
import { ChevronUp, ChevronDown, Tag, User, MessageSquare, Clock } from 'lucide-react';
import styles from '../styles/components.module.css';
import ComponentBackground from './ComponentBackground';

const QuestionCard = ({ question }) => {
  const { title, excerpt, votes, answers, tags, author, date } = question;

  return (
    <ComponentBackground numIcons={3}>
      <div className={styles.questionCard}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className={styles.voteButtons}>
            <button aria-label="Upvote">
              <ChevronUp size={20} />
            </button>
            <span>{votes}</span>
            <button aria-label="Downvote">
              <ChevronDown size={20} />
            </button>
          </div>
          
          <div style={{ flex: 1 }}>
            <div className={styles.questionHeader}>
              <h2 className={styles.questionTitle}>{title}</h2>
              <p>{excerpt}</p>
            </div>

            <div className={styles.tags}>
              {tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  <Tag size={14} />
                  {tag}
                </span>
              ))}
            </div>

            <div className={styles.questionMeta}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={14} />
                <span>{author}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <MessageSquare size={14} />
                  <span>{answers} answers</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={14} />
                  <span>{date}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ComponentBackground>
  );
};

export default QuestionCard;
