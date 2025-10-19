
export interface Question {
  question: string;
  options: string[];
  answer: string;
}

export enum GameState {
  LOADING,
  PLAYING,
  FINISHED,
  ERROR,
}
