import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
  const [point, setPoint] = useState('');
  const [numbers, setNumbers] = useState([]);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [clickedNumbers, setClickedNumbers] = useState([]);
  const [message, setMessage] = useState('');
  const [hasPointChanged, setHasPointChanged] = useState(false);

  const startGame = () => {
    if (point > 0) {
      const numArray = Array.from({ length: point }, (_, i) => ({
        number: i + 1,
        position: getPosition(i + 1),
        isClicked: false,
      }));

      setNumbers(numArray);
      setClickedNumbers([]);
      setIsPlaying(true);
      setTime(0);
      setMessage('');
      setHasPointChanged(false);
    }
  };

  const restartGame = () => {
    if (hasPointChanged) {
      startGame();
    } else {
      setTime(0);
      setIsPlaying(false);
      setMessage('');
    }
  };

  const getPosition = (number) => {
    const container = document.querySelector('.rectangle');
    const rect = container.getBoundingClientRect();
    const size = 50; 
    const maxX = rect.width - size;
    const maxY = rect.height - size;

    const centralFactor = 1 - number / point; 
    const centralX = (rect.width / 2) + centralFactor * (Math.random() - 0.5) * rect.width;
    const centralY = (rect.height / 2) + centralFactor * (Math.random() - 0.5) * rect.height;

    const positionX = Math.max(0, Math.min(maxX, centralX));
    const positionY = Math.max(0, Math.min(maxY, centralY));

    return { x: positionX, y: positionY };
  };

  const handleNumberClick = (number) => {
    if (clickedNumbers.length === number - 1) {
      const updatedNumbers = numbers.map((num) =>
        num.number === number ? { ...num, isClicked: true } : num
      );
      setNumbers(updatedNumbers);
      setClickedNumbers([...clickedNumbers, number]);

      setTimeout(() => {
        setNumbers((prevNumbers) =>
          prevNumbers.filter((n) => n.number !== number)
        );
        if (number === point) {
          setMessage('All clear!');
          setIsPlaying(false);
        }
      }, 2000); 
    } else {
      setMessage('Game Over');
      setIsPlaying(false);
    }
  };

  const handlePointChange = (e) => {
    const newPoint = parseInt(e.target.value);
    setPoint(newPoint);
    setHasPointChanged(true); 
  };

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setTime((prevTime) => parseFloat((prevTime + 0.1).toFixed(1)));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const getMessageColor = () => {
    if (message === 'All clear!') {
      return 'green';
    } else if (message === 'Game Over') {
      return 'red';
    }
    return 'black';
  };

  return (
    <div className="App">
      <h1 style={{ color: getMessageColor() }}>{message ? message : "LET'S PLAY"}</h1>
      <div className='bar'>
        <div className="input-container">
          <label>Point: </label>
          <input
            type="number"
            value={point}
            onChange={handlePointChange}
            disabled={isPlaying}
          />
        </div>
      </div>
      <div className='bar'>
        <div className="time-container">
          <label>Time: </label>
          <span>{time}s</span>
        </div>
      </div>
      <div className='btn'>
        {!isPlaying && <button onClick={startGame}>Play</button>}
        {isPlaying && <button onClick={restartGame}>Restart</button>}
      </div>
      <div className="rectangle">
        {numbers.map(({ number, position, isClicked }) => (
          <div
            key={number}
            className={`circle ${isClicked ? 'fade-out' : ''}`}
            style={{
              top: `${position.y}px`,
              left: `${position.x}px`,
              zIndex: point - number, 
            }}
            onClick={() => handleNumberClick(number)}
          >
            {number}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
