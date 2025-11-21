
import React from 'react';
import { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: string) => void;
  onNext: () => void;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  isCorrect: boolean | null;
}

const DifficultyBadge: React.FC<{ difficulty: string }> = ({ difficulty }) => {
    const colorClasses = {
        easy: 'bg-green-500/20 text-green-300 border-green-400',
        medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-400',
        hard: 'bg-red-500/20 text-red-300 border-red-400',
    };
    const difficultyKey = difficulty as keyof typeof colorClasses;
    return (
        <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${colorClasses[difficultyKey] || 'bg-gray-500/20 text-gray-300 border-gray-400'}`}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </span>
    );
};

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswer,
  onNext,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  isCorrect
}) => {
  const getButtonClass = (option: 'True' | 'False') => {
    if (!selectedAnswer) {
      return 'bg-gray-700 hover:bg-cyan-700';
    }
    if (option === selectedAnswer) {
      return isCorrect ? 'bg-green-600' : 'bg-red-600';
    }
    if (option === question.correctAnswer) {
      return 'bg-green-600';
    }
    return 'bg-gray-700 opacity-50';
  };

  return (
    <div className="bg-gray-800 p-6 md:p-8 rounded-xl shadow-2xl w-full animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <p className="text-cyan-400 font-bold">Question {questionNumber} / {totalQuestions}</p>
        <DifficultyBadge difficulty={question.difficulty} />
      </div>
      <p className="text-sm text-gray-400 mb-4">{question.category}</p>
      <h2 className="text-xl md:text-2xl font-semibold mb-6 min-h-[6rem] flex items-center">{question.question}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => onAnswer('True')}
          disabled={!!selectedAnswer}
          className={`w-full text-lg font-bold py-4 px-6 rounded-lg transition-all duration-300 ${getButtonClass('True')}`}
        >
          True
        </button>
        <button
          onClick={() => onAnswer('False')}
          disabled={!!selectedAnswer}
          className={`w-full text-lg font-bold py-4 px-6 rounded-lg transition-all duration-300 ${getButtonClass('False')}`}
        >
          False
        </button>
      </div>

      {selectedAnswer && (
        <div className="text-center mt-4 animate-fade-in">
           <button
            onClick={onNext}
            className="bg-cyan-500 text-white font-bold py-2 px-10 rounded-lg hover:bg-cyan-600 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-300"
          >
            {questionNumber === totalQuestions ? 'Finish Quiz' : 'Next Question'}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
