
import React from 'react';

interface ResultScreenProps {
  score: number;
  totalQuestions: number;
  onPlayAgain: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ score, totalQuestions, onPlayAgain }) => {
  const percentage = Math.round((score / totalQuestions) * 100);

  const getResultMessage = () => {
    if (percentage === 100) return "Perfect Score! You're a trivia master!";
    if (percentage >= 80) return "Excellent! You really know your stuff.";
    if (percentage >= 50) return "Not bad! A respectable score.";
    return "Better luck next time! Keep learning.";
  };

  return (
    <div className="text-center bg-gray-800 p-8 rounded-xl shadow-2xl animate-fade-in">
      <h2 className="text-3xl font-bold text-cyan-400 mb-4">Quiz Complete!</h2>
      <p className="text-xl text-gray-300 mb-2">You Scored</p>
      <p className="text-6xl font-extrabold text-white mb-4">{score} / {totalQuestions}</p>
      <p className="text-2xl font-bold text-cyan-400 mb-6">{percentage}%</p>
      <p className="text-lg text-gray-300 mb-8 italic">{getResultMessage()}</p>
      <button
        onClick={onPlayAgain}
        className="bg-cyan-500 text-white font-bold py-3 px-8 rounded-lg text-xl hover:bg-cyan-600 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-300"
      >
        Play Again
      </button>
    </div>
  );
};

export default ResultScreen;
