import React from 'react';
import QuestionCard from './QuestionCard';
import { mockQuestions } from '../data/mockData';
import styles from '../styles/components.module.css';

const QuestionList = () => {
  return (
    <div className={styles.questionList}>
      {mockQuestions.map((question) => (
        <QuestionCard key={question.id} question={question} />
      ))}
    </div>
  );
};

export default QuestionList;
