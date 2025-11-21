
export enum Difficulty {
    EASY = 'easy',
    MEDIUM = 'medium',
    HARD = 'hard',
}

export interface Question {
    category: string;
    difficulty: Difficulty;
    question: string;
    correctAnswer: string;
}

export enum GameState {
    START = 'start',
    PLAYING = 'playing',
    FINISHED = 'finished',
}

export interface QuizResult {
    score: number;
    totalQuestions: number;
    percentage: number;
    difficulty: Difficulty | 'all';
    category: string;
    timestamp: number;
}
