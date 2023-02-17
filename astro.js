const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext("2d");
const gameContainer = document.getElementById('game-container');


const buddyImg = new Image();
buddyImg.src = 'https://user-images.githubusercontent.com/93166959/219743759-b6c71f83-6f4e-4c41-a668-95ffec25d285.png';

const FLAP_SPEED = -5;
const BUDDY_WIDTH = 30;
const BUDDY_HEIGHT = 40;
const PIPE_WIDTH = 50;
const PIPE_GAP = 125;

let buddyX = 50;
let buddyY = 50;
let buddyVelocity = 0;
let buddyAcceleration = 0.3;


let pipeX = 400;
let pipeY = canvas.height - 200;

let scoreDiv = document.getElementById('score-display');
let score = 0;
let highScore = 0;

document.body.onkeyup = function(e) {
    if (e.code == 'Space') {
        buddyVelocity = FLAP_SPEED;
    }
}

/*
document.getElementById('restart-button').addEventListener('click', function() {
    hideEndMenu();
    resetGame();
    loop();
})
*/

function increaseScore() {
    if (buddyX > pipeX + PIPE_WIDTH && 
        (buddyY < pipeY + PIPE_GAP) ||
        buddyY + BUDDY_HEIGHT > pipeY + PIPE_GAP) {
            score++;
            scoreDiv.innerHTML = score;
        }
}


function collisionCheck() {
    //create bounding boxes for gibby and pipes
    const buddyBox = {
        x: buddyX,
        y: buddyY,
        width: BUDDY_WIDTH,
        height: BUDDY_HEIGHT,
    }

    const topPipeBox = {
        x: pipeX,
        y: pipeY - PIPE_GAP + BUDDY_WIDTH,
        width: PIPE_WIDTH,
        height: pipeY
    }

    const bottomPipeBox = {
        x: pipeX,
        y: pipeY + PIPE_GAP + BUDDY_HEIGHT,
        width: PIPE_WIDTH,
        height: canvas.height - pipeY - PIPE_GAP
    }

    // check for collision with upper pipe box
    if (buddyBox.x + buddyBox.width > topPipeBox.x &&
        buddyBox.x < topPipeBox.x + topPipeBox.width &&
        buddyBox.y < topPipeBox.y) {
            return true;
    }
    
    // check collision with lower pipe box
    if (buddyBox.x + buddyBox.width > bottomPipeBox.x &&
        buddyBox.x < bottomPipeBox.x + bottomPipeBox.width &&
        buddyBox.y + buddyBox.height > bottomPipeBox.y) {
            return true;
    }
    

    //check if buddy hits boundaries
    
    if (buddyY < 0 || buddyY + BUDDY_HEIGHT > canvas.height) {
        return true;
    }
    

    return false;
}

function hideEndMenu() {
    document.getElementById('end-menu').style.display = 'none';
    gameContainer.classList.remove('backdrop-blur');
}

function showEndMenu() {
    document.getElementById('end-menu').style.display = 'block';
    gameContainer.classList.add('backdrop-blur');
    document.getElementById('end-score').innerHTML = score;
    if (highScore < score) {
        highScore = score;
    }
    document.getElementById('best-score').innerHTML = highScore;
}


function resetGame() {
    buddyX = 50;
    buddyY = 50;
    buddyVelocity = 0;
    buddyAcceleration = 0.3;

    pipeX = 400;
    pipeY = canvas.height - 200;
    score = 0;
}


function endGame() {
    //alert("aw man!");
    showEndMenu();
}

function loop() {
    //reset ctx after every loop iteration
    ctx.clearRect(0,0,canvas.width,canvas.height);

    //Draw Gibby
    ctx.drawImage(buddyImg, buddyX, buddyY);

    //Draw Pipes
    ctx.fillStyle = '#333';
    ctx.fillRect(pipeX,-100,PIPE_WIDTH,pipeY);
    ctx.fillRect(pipeX,pipeY + PIPE_GAP,PIPE_WIDTH,canvas.height - pipeY);


    if(collisionCheck()) {
        endGame();
        return;
    }

    pipeX -= 5;
    if(pipeX < -50) {
        pipeX = 400;
        pipeY = Math.random() * (canvas.height - PIPE_GAP) + PIPE_WIDTH;
    }

    buddyVelocity+=buddyAcceleration;
    buddyY+=buddyVelocity;


    requestAnimationFrame(loop);
}

loop();
