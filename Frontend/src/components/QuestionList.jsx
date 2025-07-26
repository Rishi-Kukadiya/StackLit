import React from 'react';
import QuestionCard from './QuestionCard';

export default function QuestionList({ questions }) {
  return (
    <div className="space-y-4">
      {questions.map((question , index) => (
        <QuestionCard key={index} question={question} />
      ))}
    </div>
  );
}
