document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const context = canvas.getContext("2d");

    const paddleWidth = 100;
    const paddleHeight = 10;
    const paddleSpeed = 8;
    let paddleX = (canvas.width - paddleWidth) / 2;

    const ballRadius = 10;
    let ballX = canvas.width / 2;
    let ballY = canvas.height - paddleHeight - ballRadius - 1;
    let ballDX = 2;
    let ballDY = -2;
    let ballSpeedIncrease = 0.2;  // ボールの速度増加量

    const brickRowCount = 5;  // ブロックの行数を変更
    const brickColumnCount = 7;  // ブロックの列数を変更
    const brickWidth = 75;
    const brickHeight = 20;
    const brickPadding = 10;
    const brickOffsetTop = 30;
    const brickOffsetLeft = 30;
    const bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }

    let score = 0;

    let rightPressed = false;
    let leftPressed = false;

    function drawPaddle() {
        context.beginPath();
        context.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        context.fillStyle = "#0095DD";
        context.fill();
        context.closePath();
    }

    function drawBall() {
        context.beginPath();
        context.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
        context.fillStyle = "#0095DD";
        context.fill();
        context.closePath();
    }

    function drawBricks() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status === 1) {
                    const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                    const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    context.beginPath();
                    context.rect(brickX, brickY, brickWidth, brickHeight);
                    context.fillStyle = "#0095DD";
                    context.fill();
                    context.closePath();
                }
            }
        }
    }

    function drawScore() {
        context.font = "16px Arial";
        context.fillStyle = "#0095DD";
        context.fillText("Score: " + score, 8,20);
    }

    function collisionDetection() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                const brick = bricks[c][r];
                if (brick.status === 1) {
                    if (
                        ballX > brick.x &&
                        ballX < brick.x + brickWidth &&
                        ballY > brick.y &&
                        ballY < brick.y + brickHeight
                    ) {
                        ballDY = -ballDY;
                        brick.status = 0;
                        score++;
                        if (score === brickRowCount * brickColumnCount) {
                            alert("Congratulations! You win!");
                            restartGame();
                        }
                        // ボールの速度を上昇させる
                        ballDX += ballSpeedIncrease;
                        ballDY += ballSpeedIncrease;
                    }
                }
            }
        }
    }

    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        drawScore();
        collisionDetection();

        if (ballX + ballDX > canvas.width - ballRadius || ballX + ballDX < ballRadius) {
            ballDX = -ballDX;
        }
        if (ballY + ballDY < ballRadius) {
            ballDY = -ballDY;
        } else if (ballY + ballDY > canvas.height - ballRadius) {
            if (ballX > paddleX && ballX < paddleX + paddleWidth) {
                ballDY = -ballDY;
            } else {
                alert("Game Over");
                restartGame();
            }
        }

        if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += paddleSpeed;
        } else if (leftPressed && paddleX > 0) {
            paddleX -= paddleSpeed;
        }

        ballX += ballDX;
        ballY += ballDY;

        requestAnimationFrame(draw);
    }

    function keyDownHandler(event) {
        if (event.key === "Right" || event.key === "ArrowRight") {
            rightPressed = true;
        } else if (event.key === "Left" || event.key === "ArrowLeft") {
            leftPressed = true;
        }
    }

    function keyUpHandler(event) {
        if (event.key === "Right" || event.key === "ArrowRight") {
            rightPressed = false;
        } else if (event.key === "Left" || event.key === "ArrowLeft") {
            leftPressed = false;
        }
    }

    function restartGame() {
        score = 0;
        ballDX = 2;
        ballDY = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
        bricks.forEach(column => {
            column.forEach(brick => {
                brick.status = 1;
            });
        });
        draw();
    }

    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);

    draw();
});
