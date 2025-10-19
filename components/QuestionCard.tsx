
import React, { useState, useEffect } from 'react';
import type { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
  questionNumber: number;
  totalQuestions: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer, questionNumber, totalQuestions }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    setSelectedAnswer(null);
    setIsAnswered(false);
  }, [question]);

  const handleAnswerClick = (option: string) => {
    if (isAnswered) return;
    
    const isCorrect = option === question.answer;
    setSelectedAnswer(option);
    setIsAnswered(true);
    onAnswer(isCorrect);
  };
  
  const getButtonClass = (option: string) => {
    const baseClasses = "border";
    if (!isAnswered) {
      return `${baseClasses} bg-white hover:bg-yellow-100 border-gray-300 text-gray-800`;
    }
    if (option === question.answer) {
      return `${baseClasses} bg-green-500 text-white border-green-500 scale-105`; // Correct answer
    }
    if (option === selectedAnswer && option !== question.answer) {
      return `${baseClasses} bg-red-500 text-white border-red-500`; // Incorrectly selected answer
    }
    return `${baseClasses} bg-gray-200 text-gray-500 opacity-70 border-gray-200`; // Other options
  };

  return (
    <div className="w-full max-w-2xl p-6 md:p-8 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-2xl animate-fade-in">
      <div className="mb-6 text-center">
        <p className="text-[#FEC700] font-semibold">Questão {questionNumber} de {totalQuestions}</p>
        <h2 className="mt-2 text-2xl md:text-3xl font-bold text-gray-900">{question.question}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerClick(option)}
            disabled={isAnswered}
            className={`p-4 rounded-lg text-left font-medium transition-all duration-300 ease-in-out transform hover:shadow-lg disabled:cursor-not-allowed ${getButtonClass(option)}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
