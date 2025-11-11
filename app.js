import { useState, useEffect } from "react";
import confetti from "canvas-confetti";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, playerNames }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) return;

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "🪼" : "🐚";
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status = "";

  if (winner) {
    const winnerName =
      winner === "🪼" ? playerNames.playerX || "🪼" : playerNames.playerO || "🐚";
    status = "🏆 Winner: " + winnerName;
  } else {
    const nextName = xIsNext
      ? playerNames.playerX || "🪼"
      : playerNames.playerO || "🐚";
    status = "Next player: " + nextName;
  }

  // 🎉 confetti la câștig
  useEffect(() => {
    if (winner) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors:
          winner === "🪼"
            ? ["#a18aff", "#d7b0ff", "#c77dff", "#f3e5f5"]
            : ["#4fc3f7", "#81d4fa", "#0288d1", "#b3e5fc"],
      });
    }
  }, [winner]);

  return (
    <div>
      <h1 className="title">Tic Tac Sea 🪼🐚</h1>
      <div className="status">{status}</div>
      <div className="board">
        {[0, 3, 6].map((rowStart) => (
          <div className="board-row" key={rowStart}>
            <Square value={squares[rowStart]} onSquareClick={() => handleClick(rowStart)} />
            <Square value={squares[rowStart + 1]} onSquareClick={() => handleClick(rowStart + 1)} />
            <Square value={squares[rowStart + 2]} onSquareClick={() => handleClick(rowStart + 2)} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [playerNames, setPlayerNames] = useState({ playerX: "", playerO: "" });

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function goToPreviousMove() {
    if (currentMove > 0) setCurrentMove(currentMove - 1);
  }

  function restartGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.8 },
      colors: ["#81d4fa", "#b3e5fc", "#a18aff", "#d7b0ff"],
    });
  }

  return (
    <div className="game">
      {/* 🧍 Panou jucători */}
      <div className="player-info">
        <h2>Player Names</h2>
        <div className="input-group">
          <label>🪼 Player 1:</label>
          <input
            type="text"
            value={playerNames.playerX}
            onChange={(e) =>
              setPlayerNames({ ...playerNames, playerX: e.target.value })
            }
            placeholder="Enter name..."
          />
        </div>
        <div className="input-group">
          <label>🐚 Player 2:</label>
          <input
            type="text"
            value={playerNames.playerO}
            onChange={(e) =>
              setPlayerNames({ ...playerNames, playerO: e.target.value })
            }
            placeholder="Enter name..."
          />
        </div>
      </div>

      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          playerNames={playerNames}
        />
      </div>

      <div className="game-info">
        <h2>Actions</h2>
        <button onClick={goToPreviousMove} disabled={currentMove === 0}>
          Go to previous move
        </button>
        <button onClick={restartGame}>Restart Game</button>
      </div>
    </div>
  );
}

// 🧠 funcția care decide câștigătorul
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
