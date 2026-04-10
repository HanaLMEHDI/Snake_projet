        const boardSize = 20;
        const Board = document.getElementById('board');
        const scoreEl = document.getElementById('score');
        const highScoreEl = document.getElementById('high-score');
        const overlay = document.getElementById('overlay');
        const overlayTitle = document.getElementById('overlay-title');
        const overlayDesc = document.getElementById('overlay-desc');
        const startBtn = document.getElementById('start-btn');

        let snake = [];
        let food = {};
        let direction = 'right';
        let nextDirection = 'right';
        let score = 0;
        let highScore = localStorage.getItem('HighScore') || 0;
        let gameInterval;
        let speed = 4000;
        
        highScoreEl.innerText = highScore;

        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.id = `cell-${row}-${col}`;
                Board.appendChild(cell);
            }
        }

        function initGame() {
            snake = [
                { row: 10, col: 6 },
                { row: 10, col: 5 },
                { row: 10, col: 4 }
            ];
            direction = 'right';
            nextDirection = 'right';
            score = 0;
            speed = 130;
            scoreEl.innerText = score;
            
            overlay.classList.add('hidden');

            document.querySelectorAll('.cell').forEach(cell => {
                cell.className = 'cell'; 
            });

            placeFood();
            drawSnake();

            if (gameInterval) clearInterval(gameInterval);
            gameInterval = setInterval(gameLoop, speed);
        }

        function gameLoop() {
            direction = nextDirection;
            const head = { ...snake[0] };

            if (direction === 'up') head.row--;
            else if (direction === 'down') head.row++;
            else if (direction === 'left') head.col--;
            else if (direction === 'right') head.col++;

            if (head.row < 0 || head.row >= boardSize || head.col < 0 || head.col >= boardSize) {
                return gameOver();
            }

            if (snake.some(segment => segment.row === head.row && segment.col === head.col)) {
                return gameOver();
            }

            snake.unshift(head);

            if (head.row === food.row && head.col === food.col) {
                score += 10;
                scoreEl.innerText = score;
                
                if (score % 50 === 0 && speed > 150) {
                    speed -= 50;
                }

                clearInterval(gameInterval);
                gameInterval = setInterval(gameLoop, speed);

                placeFood();
            } else {
                const tail = snake.pop();
                const tailCell = document.getElementById(`cell-${tail.row}-${tail.col}`);
                if (tailCell) tailCell.classList.remove('snake', 'snake-head');
            }

            drawSnake();
        }

        function drawSnake() {
            if (snake.length > 1) {
                const oldHead = snake[1];
                const oldHeadCell = document.getElementById(`cell-${oldHead.row}-${oldHead.col}`);
                if (oldHeadCell) oldHeadCell.classList.remove('snake-head');
            }

            snake.forEach((segment, index) => {
                const cell = document.getElementById(`cell-${segment.row}-${segment.col}`);
                if (cell) {
                    cell.classList.add('snake');
                    if (index === 0) cell.classList.add('snake-head'); // Explicit styling for head
                }
            });
        }

        function placeFood() {
            const oldFoodCell = document.getElementById(`cell-${food.row}-${food.col}`);
            if (oldFoodCell) oldFoodCell.classList.remove('food');

            while (true) {
                food = {
                    row: Math.floor(Math.random() * boardSize),
                    col: Math.floor(Math.random() * boardSize)
                };
                
                const isOnSnake = snake.some(s => s.row === food.row && s.col === food.col);
                if (!isOnSnake) break;
            }

            const newFoodCell = document.getElementById(`cell-${food.row}-${food.col}`);
            if (newFoodCell) newFoodCell.classList.add('food');
        }

        function gameOver() {
            clearInterval(gameInterval); 
            
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('neoSnakeHighScore', highScore);
                highScoreEl.innerText = highScore;
            }

            overlayTitle.innerText = "Game Over!";
            overlayTitle.style.color = "#ef4444"; // Aggressive red
            overlayDesc.innerText = `Final Score: ${score}`;
            startBtn.innerText = "Play Again";
            overlay.classList.remove('hidden');
        }

        window.addEventListener('keydown', e => {
            if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].indexOf(e.key) > -1) {
                e.preventDefault();
            }
            
            if (e.key === 'ArrowUp' && direction !== 'down') nextDirection = 'up';
            else if (e.key === 'ArrowDown' && direction !== 'up') nextDirection = 'down';
            else if (e.key === 'ArrowLeft' && direction !== 'right') nextDirection = 'left';
            else if (e.key === 'ArrowRight' && direction !== 'left') nextDirection = 'right';
        });
