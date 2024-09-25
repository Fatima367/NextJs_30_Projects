"use client";
import { useState, useEffect, ChangeEvent } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface numberGuessingState {
  gameStarted: boolean;
  gameOver: boolean;
  paused: boolean;
  targetNumber: number;
  userGuess: number | string;
  attempts: number;
}

export default function NumberGuessingGame() {
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [paused, setPaused] = useState<boolean>(false);
  const [targetNumber, setTargetNumber] = useState<number>(0);
  const [userGuess, setUserGuess] = useState<string | number>("");
  const [attempts, setAttempts] = useState<number>(0);

  useEffect(() => {
    if (gameStarted && !paused) {
      const randomNumber: number = Math.floor(Math.random() * 10) + 1;
      setTargetNumber(randomNumber);
    }
  }, [gameStarted, paused]);

  const handleStartGame = (): void => {
    setGameStarted(true);
    setGameOver(false);
    setAttempts(0);
    setPaused(false);
  };

  const handlePauseGame = (): void => {
    setPaused(true);
  };

  const handleResumeGame = (): void => {
    setPaused(false);
  };

  const handleGuess = (): void => {
    if (typeof userGuess === "number" && userGuess === targetNumber) {
      setGameOver(true);
    } else {
      setAttempts(attempts + 1);
    }
  };

  const handleTryAgain = (): void => {
    setGameStarted(false);
    setGameOver(false);
    setUserGuess("");
    setAttempts(0);
  };

  const handleUserGuessChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setUserGuess(parseInt(e.target.value));
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen 
    bg-[url(./images/bgimg.jpg)] bg-cover">
      <div className="bg-white ring-8 ring-pink-200 ring-offset-8 ring-offset-slate-100
      font-serif rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2 text-blue-950">
          Number Guessing Game
        </h1>
        <p className="text-center text-black mb-4 bg-blue-50">
          Try to guess the number between 1 and 10!
        </p>
        {!gameStarted && (
          <div className="flex justify-center mb-4">
            <Button
              onClick={handleStartGame}
              className="bg-blue-950 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Start Game
            </Button>
          </div>
        )}
        {gameStarted && !gameOver && (
          <div>
            <div className="flex justify-center mb-4">
              {paused ? (
                <Button
                  onClick={handleResumeGame}
                  className="bg-blue-950 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                >
                  Resume
                </Button>
              ) : (
                <Button
                  onClick={handlePauseGame}
                  className="bg-blue-950 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                >
                  Pause
                </Button>
              )}
            </div>
            <div className="flex justify-center mb-4">
              <Input
                type="number"
                value={userGuess}
                onChange={handleUserGuessChange}
                className="bg-gray-100 border border-gray-300 rounded-lg py-2 px-4 w-full max-w-xs"
                placeholder="Enter your guess"
              />
              <Button
                onClick={handleGuess}
                className="bg-blue-950 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded ml-4"
              >
                Guess
              </Button>
            </div>
            <div className="text-center text-black bg-blue-50">
              <p >Attempts: {attempts}</p>
            </div>
          </div>
        )}
        {gameOver && (
          <div>
            <div className="text-center mb-4 text-black">
              <h2 className="text-2xl font-bold">Game Over!</h2>
              <p>You guessed the number in {attempts} attempts.</p>
            </div>
            <div className="flex justify-center">
              <Button
                onClick={handleTryAgain}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
