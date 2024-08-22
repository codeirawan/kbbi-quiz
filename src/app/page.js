"use client"
import { useState, useEffect } from 'react';
import words from './words.json';

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

export default function Home() {
  const [isStarted, setIsStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [currentWord, setCurrentWord] = useState(0);
  const [isCorrect, setIsCorrect] = useState(null);
  const [choices, setChoices] = useState([]);
  const [timeLeft, setTimeLeft] = useState(10);
  const [timer, setTimer] = useState(null); // State to hold the timer interval
  const maxWords = 10;

  useEffect(() => {
    if (isStarted && currentWord < maxWords && currentWord < words.length) {
      setChoices(shuffle([words[currentWord].correct, words[currentWord].incorrect]));
      setTimer(setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime === 0) {
            handleAnswer(null); // Handle when time runs out without answer
            return prevTime;
          } else {
            return prevTime - 1;
          }
        });
      }, 1000));
    }
  }, [currentWord, isStarted]);

  useEffect(() => {
    return () => clearInterval(timer); // Clear the interval when component unmounts or timer is no longer needed
  }, [timer]);

  const handleAnswer = (answer) => {
    clearInterval(timer); // Clear the interval when handling answer
    if (answer === words[currentWord].correct) {
      setScore(score + 1);
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
    setTimeout(() => {
      setIsCorrect(null);
      setCurrentWord(currentWord + 1);
      setTimeLeft(10);
    }, 1000);
  };

  const startQuiz = () => {
    setIsStarted(true);
    setCurrentWord(0);
    setScore(0);
    setTimeLeft(10);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        {!isStarted ? (
          <>
            <h1 className="text-2xl font-bold mb-4">Kuis Kata Baku</h1>
            <button
              onClick={startQuiz}
              className="block w-full bg-blue-500 text-white py-2 px-4 rounded"
            >
              Mulai
            </button>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">Kuis Kata Baku</h1>
            {currentWord < maxWords && currentWord < words.length ? (
              <>
                <div className="mb-4">
                  Soal {currentWord + 1} dari {maxWords}
                </div>
                <div className="mb-4">
                  00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                </div>
                <div className="mb-4">
                  {isCorrect === null ? (
                    <>
                      <button
                        onClick={() => handleAnswer(choices[0])}
                        className="block w-full bg-blue-500 text-white py-2 px-4 rounded mb-2"
                      >
                        {choices[0]}
                      </button>
                      <button
                        onClick={() => handleAnswer(choices[1])}
                        className="block w-full bg-blue-500 text-white py-2 px-4 rounded"
                      >
                        {choices[1]}
                      </button>
                    </>
                  ) : isCorrect ? (
                    <div className="text-green-500">Benar!</div>
                  ) : (
                    <div className="text-red-500">
                      Waktu habis! Jawaban yang benar adalah "{words[currentWord].correct}".
                    </div>
                  )}
                </div>
              </>
            ) : (
              <h2 className="text-2xl font-bold">
                Skor akhir Anda: {score}/{maxWords}
              </h2>
            )}
          </>
        )}
      </div>
    </div>
  );
}
