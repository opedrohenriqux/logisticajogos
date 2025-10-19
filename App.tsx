
import React, { useState, useEffect, useCallback } from 'react';
import { GameState } from './types';
import type { Question } from './types';
import { generateQuizQuestions } from './services/geminiService';
import LoadingSpinner from './components/LoadingSpinner';
import QuestionCard from './components/QuestionCard';
import ScoreScreen from './components/ScoreScreen';

const TOTAL_QUESTIONS = 7;

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.LOADING);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [answerSelected, setAnswerSelected] = useState(false);

  const loadQuestions = useCallback(async () => {
    setGameState(GameState.LOADING);
    setError(null);
    setScore(0);
    setCurrentQuestionIndex(0);
    setQuestions([]);
    setAnswerSelected(false);

    try {
      const newQuestions = await generateQuizQuestions(TOTAL_QUESTIONS);
      if (newQuestions.length > 0) {
        setQuestions(newQuestions);
        setGameState(GameState.PLAYING);
      } else {
         throw new Error("Nenhuma pergunta foi gerada.");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocorreu um erro desconhecido.");
      }
      setGameState(GameState.ERROR);
    }
  }, []);

  useEffect(() => {
    loadQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    setAnswerSelected(true);
  };
  
  const handleNextQuestion = () => {
      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex < questions.length) {
          setCurrentQuestionIndex(nextIndex);
          setAnswerSelected(false);
      } else {
          setGameState(GameState.FINISHED);
      }
  };

  const renderContent = () => {
    switch (gameState) {
      case GameState.LOADING:
        return <LoadingSpinner />;
      case GameState.PLAYING:
        return questions.length > 0 && (
          <div className="w-full flex flex-col items-center space-y-6">
            <QuestionCard
              question={questions[currentQuestionIndex]}
              onAnswer={handleAnswer}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
            />
             {answerSelected && (
              <button
                onClick={handleNextQuestion}
                className="px-8 py-3 bg-[#FEC700] text-gray-900 font-bold rounded-lg hover:bg-yellow-400 transition-colors duration-300 animate-fade-in"
              >
                {currentQuestionIndex < questions.length - 1 ? 'Próxima Pergunta' : 'Ver Resultado'}
              </button>
            )}
          </div>
        );
      case GameState.FINISHED:
        return <ScoreScreen score={score} totalQuestions={questions.length} onRestart={loadQuestions} />;
      case GameState.ERROR:
        return (
          <div className="text-center p-8 bg-red-100 border border-red-300 rounded-lg">
            <h2 className="text-2xl font-bold text-red-800 mb-4">Oops! Algo deu errado.</h2>
            <p className="text-red-700 mb-6">{error}</p>
            <button onClick={loadQuestions} className="px-6 py-2 bg-[#FEC700] text-gray-900 font-semibold rounded-lg hover:bg-yellow-400">
              Tentar Novamente
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen w-full bg-gray-50 text-gray-800 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl flex flex-col items-center">
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Quiz de <span className="text-[#FEC700]">Logística Integrada</span>
          </h1>
          {gameState === GameState.PLAYING && (
            <div className="mt-4 text-2xl font-bold text-[#FEC700] bg-white/50 px-4 py-2 rounded-lg border border-gray-200">
                Pontuação: {score}
            </div>
          )}
        </header>
        <div className="w-full flex items-center justify-center">
            {renderContent()}
        </div>
      </div>
    </main>
  );
};

export default App;
