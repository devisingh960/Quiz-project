import React, { useState, useEffect, useMemo } from 'react';
import { Question, GameState, Difficulty, QuizResult } from './types';
import { getAllQuestions, shuffleArray } from './utils/quizData';
import WelcomeScreen from './components/WelcomeScreen';
import QuestionCard from './components/QuestionCard';
import ResultScreen from './components/ResultScreen';
import Spinner from './components/Spinner';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizHistory, setQuizHistory] = useState<QuizResult[]>([]);
  const [quizSettings, setQuizSettings] = useState<{ difficulty: Difficulty | 'all'; category: string }>({
    difficulty: 'all',
    category: 'All Categories',
  });

  useEffect(() => {
    const all = getAllQuestions();
    setAllQuestions(all);
    setIsLoading(false);

    try {
      const savedHistory = localStorage.getItem('quizHistory');
      if (savedHistory) {
        setQuizHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error("Failed to parse quiz history from localStorage", e);
      localStorage.removeItem('quizHistory');
    }
  }, []);

  useEffect(() => {
    if (gameState === GameState.FINISHED && quizQuestions.length > 0) {
      const newResult: QuizResult = {
        score,
        totalQuestions: quizQuestions.length,
        percentage: Math.round((score / quizQuestions.length) * 100),
        difficulty: quizSettings.difficulty,
        category: quizSettings.category,
        timestamp: Date.now(),
      };
      
      // Prevent adding duplicate results on re-renders
      if (!quizHistory.length || quizHistory[0].timestamp !== newResult.timestamp) {
         const updatedHistory = [newResult, ...quizHistory];
         setQuizHistory(updatedHistory);
         localStorage.setItem('quizHistory', JSON.stringify(updatedHistory));
      }
    }
  }, [gameState, score, quizQuestions.length, quizSettings, quizHistory]);

  const categories = useMemo(() => {
      const categorySet = new Set(allQuestions.map((q: Question) => q.category));
      return Array.from(categorySet).sort();
  }, [allQuestions]);

  const handleStartQuiz = (difficulty: Difficulty | 'all', category: string) => {
    setError(null);

    let filtered = allQuestions;

    if (difficulty !== 'all') {
      filtered = filtered.filter((q: Question) => q.difficulty === difficulty);
    }
    if (category !== 'All Categories') {
      filtered = filtered.filter((q: Question) => q.category === category);
    }

    if (filtered.length === 0) {
      setError('No questions found for the selected criteria. Please try different options.');
      return;
    }

    const shuffled = shuffleArray(filtered);
    setQuizSettings({ difficulty, category });
    setQuizQuestions(shuffled);
    setGameState(GameState.PLAYING);
  };

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;

    const correct = quizQuestions[currentQuestionIndex].correctAnswer === answer;
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    if (correct) {
      setScore((prevScore: number) => prevScore + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prevIndex: number) => prevIndex + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      setGameState(GameState.FINISHED);
    }
  };

  const handlePlayAgain = () => {
    setScore(0);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setQuizQuestions([]);
    setError(null);
    setGameState(GameState.START);
  };
  
  const handleClearHistory = () => {
    setQuizHistory([]);
    localStorage.removeItem('quizHistory');
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center h-full"><Spinner /></div>;
    }

    switch (gameState) {
      case GameState.START:
        return <WelcomeScreen onStart={handleStartQuiz} categories={categories} error={error} quizHistory={quizHistory} onClearHistory={handleClearHistory} />;
      case GameState.PLAYING:
        return (
          <QuestionCard
            question={quizQuestions[currentQuestionIndex]}
            onAnswer={handleAnswer}
            onNext={handleNextQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={quizQuestions.length}
            selectedAnswer={selectedAnswer}
            isCorrect={isCorrect}
          />
        );
      case GameState.FINISHED:
        return (
          <ResultScreen
            score={score}
            totalQuestions={quizQuestions.length}
            onPlayAgain={handlePlayAgain}
          />
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4 font-sans">
        <div className="w-full max-w-2xl mx-auto">
            {renderContent()}
        </div>
    </main>
  );
};

export default App;
