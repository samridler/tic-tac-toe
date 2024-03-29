import { useState } from "react";

function Square({ value, onSquareClick, highlight }) {
  const backgroundColor = highlight ? "lime" : "white";
  return (
    <button
      className="square"
      onClick={onSquareClick}
      style={{ background: backgroundColor }}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const [winner, winLine] = calculateWinner(squares);
  const draw = !winner && isBoardFull(squares);

  function handleClick(i) {
    if (winner || draw || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (draw) {
    status = "Draw";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const board = [0, 1, 2].map((i) => {
    const row = [0, 1, 2].map((j) => {
      const k = i * 3 + j;
      return (
        <Square
          key={k}
          value={squares[k]}
          onSquareClick={() => handleClick(k)}
          highlight={winLine.includes(k)}
        />
      );
    });
    return (
      <div key={i} className="board-row">
        {row}
      </div>
    );
  });

  return (
    <>
      <div className="status">{status}</div>
      {board}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return [null, []];
}

function isBoardFull(squares) {
  return squares.every((x) => x);
}
