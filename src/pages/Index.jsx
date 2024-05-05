import { Box, Button, Container, useToast } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";

const gridSize = 20;
const gridCount = gridSize * gridSize;

const Index = () => {
  const [snake, setSnake] = useState([2, 1, 0]);
  const [direction, setDirection] = useState("RIGHT");
  const [food, setFood] = useState(5);
  const [speed, setSpeed] = useState(200);
  const toast = useToast();

  const createFood = () => {
    let newFood;
    do {
      newFood = Math.floor(Math.random() * gridCount);
    } while (snake.includes(newFood));
    setFood(newFood);
  };

  const moveSnake = useCallback(() => {
    setSnake((prevSnake) => {
      let newSnake = [...prevSnake];
      let head = newSnake[0];

      switch (direction) {
        case "RIGHT":
          head = head % gridSize === gridSize - 1 ? head - gridSize + 1 : head + 1;
          break;
        case "LEFT":
          head = head % gridSize === 0 ? head + gridSize - 1 : head - 1;
          break;
        case "DOWN":
          head = head + gridSize >= gridCount ? head % gridSize : head + gridSize;
          break;
        case "UP":
          head = head - gridSize < 0 ? gridCount - (gridSize - head) : head - gridSize;
          break;
        default:
          break;
      }

      if (newSnake.includes(head) || head < 0 || head >= gridCount) {
        toast({
          title: "Game Over",
          description: `Your score: ${newSnake.length}`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return [2, 1, 0]; // Reset snake
      }

      if (head === food) {
        newSnake = [head, ...newSnake];
        createFood();
      } else {
        newSnake = [head, ...newSnake.slice(0, -1)];
      }

      return newSnake;
    });
  }, [direction, food, toast]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const keyMap = {
        ArrowUp: "UP",
        ArrowDown: "DOWN",
        ArrowLeft: "LEFT",
        ArrowRight: "RIGHT",
      };
      const newDirection = keyMap[e.key];
      if (newDirection) {
        setDirection(newDirection);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const gameInterval = setInterval(moveSnake, speed);

    return () => clearInterval(gameInterval);
  }, [moveSnake, speed]);

  return (
    <Container maxW="container.md" centerContent>
      <Box w="400px" h="400px" bg="black" position="relative">
        {Array.from({ length: gridCount }).map((_, i) => (
          <Box key={i} w="5%" h="5%" bg={snake.includes(i) ? "green.500" : i === food ? "red.500" : "transparent"} position="absolute" left={`${(i % gridSize) * 5}%`} top={`${Math.floor(i / gridSize) * 5}%`} />
        ))}
      </Box>
      <Button mt={4} onClick={() => setSpeed((prev) => (prev > 50 ? prev - 50 : prev))}>
        Increase Speed
      </Button>
    </Container>
  );
};

export default Index;
