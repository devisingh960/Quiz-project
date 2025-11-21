import React, { useState } from 'react';
import { Difficulty, QuizResult } from '../types';

interface WelcomeScreenProps {
  onStart: (difficulty: Difficulty | 'all', category: string) => void;
  categories: string[];
  error: string | null;
  quizHistory: QuizResult[];
  onClearHistory: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, categories, error, quizHistory, onClearHistory }) => {
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all');
  const [category, setCategory] = useState('All Categories');

  const handleStart = () => {
    onStart(difficulty, category);
  };

  const formatDifficulty = (diff: Difficulty | 'all') => {
    if (diff === 'all') return 'Any';
    if (diff === 'medium') return 'Normal';
    return diff.charAt(0).toUpperCase() + diff.slice(1);
  };

  return (
    <>
      <div className="text-center bg-gray-800 p-8 rounded-xl shadow-2xl animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-4">Welcome to Smart Quiz!</h1>
        <p className="text-lg text-gray-300 mb-8">Customize your challenge and test your knowledge.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label htmlFor="difficulty" className="block text-left text-sm font-medium text-gray-400 mb-2">Difficulty</label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty | 'all')}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-cyan-500 focus:border-cyan-500 appearance-none"
            >
              <option value="all">Any Difficulty</option>
              <option value={Difficulty.EASY}>Easy</option>
              <option value={Difficulty.MEDIUM}>Normal</option>
              <option value={Difficulty.HARD}>Hard</option>
            </select>
          </div>
          <div>
            <label htmlFor="category" className="block text-left text-sm font-medium text-gray-400 mb-2">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-cyan-500 focus:border-cyan-500 appearance-none"
            >
              <option value="All Categories">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
        
        <button
          onClick={handleStart}
          className="bg-cyan-500 text-white font-bold py-3 px-8 rounded-lg text-xl hover:bg-cyan-600 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-300"
        >
          Start Quiz
        </button>

        {error && <p className="text-red-400 mt-4 text-sm animate-fade-in">{error}</p>}
      </div>

      {quizHistory.length > 0 && (
        <div className="mt-12 w-full animate-fade-in">
          <div className="flex justify-between items-center mb-4 px-2">
            <h2 className="text-2xl font-bold text-cyan-400">Quiz History</h2>
            <button
              onClick={onClearHistory}
              className="bg-red-500/80 text-white font-semibold py-1 px-3 rounded-md text-sm hover:bg-red-600/80 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              Clear History
            </button>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto p-2 rounded-lg bg-gray-800/50">
            {quizHistory.map((result) => (
              <div key={result.timestamp} className="bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center gap-4">
                <div className="flex-grow">
                  <p className="font-bold text-white truncate" title={result.category}>{result.category}</p>
                  <p className="text-sm text-gray-400">
                    {formatDifficulty(result.difficulty)} &middot; {new Date(result.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-cyan-400">{result.percentage}%</p>
                  <p className="text-sm text-gray-400">{result.score}/{result.totalQuestions}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default WelcomeScreen;
