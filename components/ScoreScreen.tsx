
import React from 'react';

interface ScoreScreenProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
}

const ScoreScreen: React.FC<ScoreScreenProps> = ({ score, totalQuestions, onRestart }) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  let message = '';
  if (percentage === 100) {
    message = 'Impressionante! Você é um mestre da logística!';
  } else if (percentage >= 70) {
    message = 'Muito bem! Você conhece o caminho do sucesso logístico!';
  } else if (percentage >= 40) {
    message = 'Bom trabalho! Continue aprimorando seus conhecimentos.';
  } else {
    message = 'Não desanime! Cada desafio é um passo no aprendizado.';
  }

  return (
    <div className="flex flex-col items-center text-center p-8 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-2xl animate-fade-in">
      <h2 className="text-4xl font-bold text-gray-900 mb-2">Quiz Finalizado!</h2>
      <p className="text-gray-700 text-lg mb-6">{message}</p>
      <div className="bg-white/50 rounded-full p-6 mb-8 shadow-inner">
        <p className="text-6xl font-bold text-[#FEC700]">{percentage}%</p>
        <p className="text-gray-600">Você acertou {score} de {totalQuestions} perguntas</p>
      </div>
      <button
        onClick={onRestart}
        className="px-8 py-3 bg-[#FEC700] text-gray-900 font-bold rounded-lg hover:bg-yellow-400 transition-colors duration-300 transform hover:scale-105"
      >
        Jogar Novamente
      </button>
    </div>
  );
};

export default ScoreScreen;
