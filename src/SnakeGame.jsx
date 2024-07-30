import { useEffect, useRef, useState } from "react";

const Game_Size = 15;
const Game_Grid = Array.from({ length: Game_Size }, () => {
  return new Array(Game_Size).fill("");
});
const generateFood = () => {
  const x = Math.floor(Math.random() * Game_Size);
  const y = Math.floor(Math.random() * Game_Size);
  return [x, y];
};
export default function SnakeGame() {
  const [snakeBody, setSnakeBody] = useState([[0, 5]]);
  const direcRef = useRef([1, 0]);
  const food = useRef(generateFood());
  const isSnakeBodyDiv = (x, y) => {
    return snakeBody.some(([xc, yc]) => xc === x && yc === y);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setSnakeBody((prevSnakeBody) => {
        const newHead = [
          prevSnakeBody[0][0] + direcRef.current[0],
          prevSnakeBody[0][1] + direcRef.current[1],
        ];
        if (
          newHead[0] < 0 ||
          newHead[0] >= Game_Size ||
          newHead[1] < 0 ||
          newHead[1] >= Game_Size ||
          prevSnakeBody.some(
            ([xc, yc]) => xc === newHead[0] && yc === newHead[1]
          )
        ) {
          direcRef.current = [1, 0];
          return [[0, 5]];
        }
        const copySnakeBody = prevSnakeBody.map((arr) => [...arr]);
        if (newHead[0] === food.current[0] && newHead[1] === food.current[1]) {
          food.current = generateFood();
        } else {
          copySnakeBody.pop();
        }

        copySnakeBody.unshift(newHead);

        return copySnakeBody;
      });
    }, 200);
    const handleDirection = (e) => {
      const key = e.key;
      if (key == "ArrowUp" && direcRef.current[1] != 1) {
        direcRef.current = [0, -1];
      } else if (key == "ArrowDown" && direcRef.current[1] != -1) {
        direcRef.current = [0, 1];
      } else if (key == "ArrowLeft" && direcRef.current[0] != 1) {
        direcRef.current = [-1, 0];
      } else if (key == "ArrowRight" && direcRef.current[0] != -1) {
        direcRef.current = [1, 0];
      }
    };
    window.addEventListener("keyup", handleDirection);
    return () => {
      clearInterval(interval);
      window.removeEventListener("keyup", handleDirection);
    };
  }, []);
  return (
    <div className="container">
      {Game_Grid.map((row, y) => {
        return row.map((cell, x) => (
          <div
            key={`${x}${y}`}
            className={`cell ${isSnakeBodyDiv(x, y) && "snake"}
            ${food.current[0] == x && food.current[1] == y ? "food" : ""}`}
          ></div>
        ));
      })}
    </div>
  );
}
