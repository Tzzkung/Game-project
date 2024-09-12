// เริ่มสร้าง

// ตั้งค่าหน้าจอ
let board;
let boardWidth = 800;
let boardHeight = 300;
let context;

// ตั้งค่าตัวละครเกม
let playerWidth = 70;
let playerHeight = 185;
let playerX = 200;
let playerY = 130;
let playerImg;
let player = {
    x: playerX,
    y: playerY,
    width: playerWidth,
    height: playerHeight
}
let gameOver = false;
let score = 0;
let time = 0;

// สร้างอุปสรรค
let boxImg;
let boxWidth = 50;
let boxHeight = 50;
let boxX = 700;
let boxY = 250;

// setting อุปสรรค
let boxesArray = [];
let boxSpeed = -3;
let boxCreationInterval = 2000; // เวลาที่เริ่มต้นในการสร้างอุปสรรค
let boxCreationTimer;

// Gravity & Velocity
let velocityY = 0;
let gravity = 0.25;

// กำหนดเหตุการณ์การเริ่มเกม
let lives = 3; // จำนวนชีวิตเริ่มต้น
let lifeText = "Lives: " + lives; // ข้อความจำนวนชีวิต

window.onload = function () {
    // Display
    board = document.getElementById('board');
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext('2d');

    // player
    playerImg = new Image();
    playerImg.src = "purple.png";
    playerImg.onload = function () {
        context.drawImage(playerImg, player.x, player.y, player.width, player.height);
    }

    // request animation frame
    requestAnimationFrame(update);

    // การดักจับการกระโดด
    document.addEventListener("keydown", retryagin);
    document.addEventListener("keydown", movePlayer);

    // สร้าง box อุปสรรค
    boxImg = new Image();
    boxImg.src = "crying.png";
    createBox(); // เรียกใช้งานครั้งแรก
}

// function update
function update() {
    requestAnimationFrame(update); // update animation ตลอดเวลา

    if (gameOver) { // ตรวจสอบว่าเกม Over หรือไม่
        return;
    }

    context.clearRect(0, 0, board.width, board.height); // เคลียร์ภาพซ้อน
    velocityY += gravity;

    // create player object
    player.y = Math.min(player.y + velocityY, playerY);
    context.drawImage(playerImg, player.x, player.y, player.width, player.height);

    // Create Array Box
    for (let i = 0; i < boxesArray.length; i++) {
        let box = boxesArray[i];
        box.x += boxSpeed;
        context.drawImage(box.img, box.x, box.y, box.width, box.height);

        // ตรวจสอบเงื่อนไขการชนของอุปสรรค
        if (onCollision(player, box)) {
           if(lives <= 1) {
                gameOver = true;
                context.font = "normal bold 40px Arial";
                context.textAlign = "center";
                context.fillText("Game Over!", boardWidth / 2, boardHeight / 2);
                context.font = "normal bold 30px Arial";
                context.fillText("Score : " + score, boardWidth / 2, 200);
            } else {
                context.font = "normal bold 40px Arial";
                context.textAlign = "center";
                context.fillText("Fail!", boardWidth / 2, boardHeight / 2);
                context.font = "normal bold 30px Arial";
                context.fillText("Score : " + score, boardWidth / 2, 200);
                context.fillText("F to retry", boardWidth / 2, 250);
                gameOver = true;
            }
            lives--; // ลดจำนวนชีวิต
            lifeText = "Lives: " + lives;
        }
    }

    // นับคะแนน
    score++;
    context.font = "normal bold 20px Arial";
    context.textAlign = "left";
    context.fillText("Score : " + score, 10, 30);

    // นับเวลา
    time += 0.01;
    context.font = "normal bold 20px Arial";
    context.textAlign = "right";
    context.fillText("Time : " + (time.toFixed(2)), 765, 30);

    // ตรวจสอบเวลา
    if (time >= 60) {
        gameOver = true;
        context.font = "normal bold 40px Arial";
        context.textAlign = "center";
        context.fillText("Time's Up!", boardWidth / 2, boardHeight / 2);
        context.font = "normal bold 30px Arial";
        context.fillText("Score : " + score, boardWidth / 2, 200);
    }

    // แสดงข้อความชีวิตที่เหลืออยู่
    context.font = "normal bold 20px Arial";
    context.textAlign = "center";
    context.fillText(lifeText, boardWidth / 2, 50);
}

// function เคลื่อนตัวละคร
function movePlayer(e) {
    if (gameOver) {
        return;
    }

    if (e.code == "Space" && player.y == playerY) {
        velocityY = -10;
    }
}

function createBox() {
    if (gameOver) {
        return;
    }

    let box = {
        img: boxImg,
        x: boxX,
        y: boxY,
        width: boxWidth,
        height: boxHeight
    }

    boxesArray.push(box);

    if (boxesArray.length > 5) {
        boxesArray.shift();
    }

    // สุ่มเวลาในการสร้างอุปสรรคครั้งถัดไป
    let randomTime = Math.floor(Math.random() * 2000) + 1000; // เวลาระหว่าง 1 ถึง 3 วินาที
    boxCreationTimer = setTimeout(createBox, randomTime);
}

function onCollision(obj1, obj2) {
    return obj1.x < (obj2.x + obj2.width) &&
        (obj1.x + obj1.width) > obj2.x // ชนกันในแนวนอน
        &&
        obj1.y < (obj2.y + obj2.height) &&
        (obj1.y + obj1.height) > obj2.y // ชนกันแนวตั้ง
}


function retryagin(e) {
    if(e.code == "KeyF" && gameOver == true && lives > 0 && time < 60){
        boxesArray = [];
        player.x = playerX;
        player.y = playerY;
        velocityY = 0;
        score = 0;
        time = 0;
        gameOver = false;
    }
}
// restart game
function restartGame() {
    location.reload();
}