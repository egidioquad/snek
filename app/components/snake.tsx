"use client"

import React, { useEffect, useRef, useState } from "react";
import "../styles.css";
import Image from 'next/image';
import AppleLogo from "../eth.png";
import useInterval from "../hooks/useInterval";
import Dashboard from "./web3button";
import { useAppContext } from './AppContext';

const canvasX = 1000
const canvasY = 1000
const initialSnake = [[4, 10], [4, 10]]
const initialApple = [14, 10]
const scale = 50
const timeDelay = 100



const SnakeGame = () => {

	const { btcAddress, userHighscore, updateBtcAddress, updateUserHighscore } = useAppContext();

	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const [snake, setSnake] = useState(initialSnake)
	const [apple, setApple] = useState(initialApple)
	const [direction, setDirection] = useState([0, -1])
	const [delay, setDelay] = useState<number | null>(null)
	const [gameOver, setGameOver] = useState(false)
	const [score, setScore] = useState(0)
	const [highScore, setHighScore] = useState(userHighscore);


	useInterval(() => runGame(), delay)

	useEffect(
		() => {
			let fruit = document.getElementById("fruit") as HTMLCanvasElement
			if (canvasRef.current) {
				const canvas = canvasRef.current
				const ctx = canvas.getContext("2d")
				if (ctx) {
					ctx.setTransform(scale, 0, 0, scale, 0, 0)
					ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
					ctx.fillStyle = "#b88de0"
					ctx.fillRect(0, 0, canvasX, canvasY)
					ctx.fillStyle = "#933ae6"
					snake.forEach(([x, y]) => ctx.fillRect(x, y, 0.97, 0.97))
					ctx.drawImage(fruit, apple[0], apple[1], 1, 1)
				}
			}
		},
		[snake, apple, gameOver]
	)

	async function handleSetScore() {

		if (score > highScore) {
			setHighScore(score);
		}
	}



	function play() {
		setSnake(initialSnake)
		setApple(initialApple)
		setDirection([1, 0])
		setDelay(timeDelay)
		setScore(0)
		setGameOver(false)
	}

	function checkCollision(head: number[]) {
		for (let i = 0; i < head.length; i++) {
			if (head[i] < 0 || head[i] * scale >= canvasX) return true
		}
		for (const s of snake) {
			if (head[0] === s[0] && head[1] === s[1]) return true
		}
		return false
	}

	function appleAte(newSnake: number[][]) {
		let coord: number[];
		do {
			coord = apple.map(() => Math.floor(Math.random() * canvasX / scale));
		} while (newSnake.some(([x, y]) => x === coord[0] && y === coord[1]));

		if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
			let newApple = coord
			setScore(score + 1)
			setApple(newApple)
			return true
		}
		return false
	}
	async function putKO(highScore: number) {
		try {
			const response = await fetch(`/api/userDatas/${btcAddress}/btcAddress`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ highscore: highScore }),
			});

			if (!response.ok) {
				// handle error
			}
		} catch (error) {
			// handle error
		}
	}

	function runGame() {
		const newSnake = [...snake]
		const newSnakeHead = [newSnake[0][0] + direction[0], newSnake[0][1] + direction[1]]
		newSnake.unshift(newSnakeHead)
		if (checkCollision(newSnakeHead)) {
			setDelay(null)
			setGameOver(true)
			handleSetScore()
			putKO(highScore)

		}
		if (!appleAte(newSnake)) {
			newSnake.pop()
		}
		setSnake(newSnake)
	}

	function changeDirection(e: React.KeyboardEvent<HTMLDivElement>) {
		const key = e.key;
		const keyDirections: { [key: string]: number[] } = {
			ArrowLeft: [-1, 0],
			a: [-1, 0],
			ArrowUp: [0, -1],
			w: [0, -1],
			ArrowRight: [1, 0],
			d: [1, 0],
			ArrowDown: [0, 1],
			s: [0, 1],
		};
		const direction = keyDirections[key];

		if (direction) {
			const [currentX, currentY] = direction;
			const [prevX, prevY] = direction;
			const oppositeDirection = [-prevX, -prevY];

			// Get the head of the snake
			const [snakeHead] = snake;

			// Prevent changing to the opposite direction
			if (
				snake.length > 1 &&
				snakeHead[0] + currentX === snake[1][0] &&
				snakeHead[1] + currentY === snake[1][1]
			) {
				return;
			}

			setDirection(direction);
		}
	}


	return (
		<div >{
			<div onKeyDown={(e) => changeDirection(e)}>
				<img id="fruit" src={AppleLogo.src} alt="fruit" width="30" />
				<canvas className="playArea" ref={canvasRef} width={`${canvasX}px`} height={`${canvasY}px`} />
				{gameOver && <div className="gameOver">Game Over</div>}
				<button onClick={play} className="playButton" onKeyDown={(e) => e.key === ' ' && play()}>
					Play
				</button>
				<div className="scoreBox">
					<h2>Score: {score}</h2>
					<h2>High Score: {highScore}</h2>
				</div>
			</div>
		}</div>
	);
};


const SnakeGameExport = {
	SnakeGame: SnakeGame,
};

export default SnakeGame;
