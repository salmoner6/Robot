class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    move(x, y) {
        this.x = parseInt(this.x + x);
        this.y = parseInt(this.y + y);
    }
}

class Sprite {
    constructor(imgPath, insideDOM, id) {
        let obj = document.createElement("img"); 
        obj.setAttribute("src", imgPath);
        obj.setAttribute("id", id);
        insideDOM.appendChild(obj);
        this.DOM = document.getElementById(id);
        this.pos = new Point(this.DOM.style.left, this.DOM.style.top);
        this.speedX;
        this.speedY;
    }

    move(x, y) {
        this.pos.move(x, y);
        this.DOM.style.left = this.pos.x+"px";
        this.DOM.style.top = this.pos.y+"px";
    }

    moveNextFrame(duration) {
        let x = this.speedX*duration/1000;
        let y = this.speedY*duration/1000;
        this.move(x,y);
    }

}

const r2d2 = new Sprite("R2D2cropped.png", document.getElementById("playground"), "R2D2");
r2d2.move(500, 200);

const snake = new Sprite("snake.png", document.getElementById("playground"), "snake");
snake.move(0,0)
console.log(snake.pos.x, snake.pos.y);

snake.move(10,10)
console.log(snake.pos.x, snake.pos.y);

snake.speedX = 100;
snake.speedY = 100;
let interval = setInterval(function () {snake.moveNextFrame(100); }, 100);
setTimeout(function(){clearInterval(interval)},5000);

const gear = new Sprite("gear.png", document.getElementById("playground"), "gear");
gear.move(200, 200);

const lose = new Sprite("youlose.png", document.getElementById("playground"), "lose");
lose.DOM.style.visibility = "hidden";
const win = new Sprite("youwin.jpg", document.getElementById("playground"), "win");
win.DOM.style.visibility = "hidden";

const distance = 20;
const snakeDistance = 5;

/*
//accès à l'aire de jeux 
const pg = document.getElementById('playground');
const cssPg = window.getComputedStyle(pg, null);
let pgh = parseInt(cssPg.getPropertyValue("height"));
let pgw = parseInt(cssPg.getPropertyValue("width"));

//accès au robot
const r2d2 = document.getElementById('R2D2');
const cssR2d2 = window.getComputedStyle(r2d2, null);
let r2h = parseInt(cssR2d2.getPropertyValue("height"));
let r2w = parseInt(cssR2d2.getPropertyValue("width"));
r2d2.style.top = ((pgh / 2) - (r2h / 2)) + "px";
r2d2.style.left = ((pgw / 2) - (r2w / 2)) + "px";

//accès au serpent 
const snake = document.getElementById('snake');
const cssSnake = window.getComputedStyle(snake, null);
let sh = parseInt(cssSnake.getPropertyValue("height"));
let sw = parseInt(cssSnake.getPropertyValue("width"));
snake.style.top = (sh / 2) + "px";
snake.style.left = (sw / 2) + "px";

//accès à la roue dentée
const gear = document.getElementById('gear');
const cssGear = window.getComputedStyle(gear, null);
let gh = parseInt(cssGear.getPropertyValue("height"));
let gw = parseInt(cssGear.getPropertyValue("width"));
gear.style.top = pgh / 3 + "px";
gear.style.left = pgw / 3 + "px";

//messages fin
const win = document.getElementById('win');
const cssWin = window.getComputedStyle(win, null);
let wh = parseInt(cssWin.getPropertyValue("height"));
let ww = parseInt(cssWin.getPropertyValue("width"));
win.style.top = ((pgh / 2) - (wh / 2)) + "px";
win.style.left = ((pgw / 2) - (ww / 2)) + "px";


const lose = document.getElementById('lose');
const cssLose = window.getComputedStyle(lose, null);
let lh = parseInt(cssLose.getPropertyValue("height"));
let lw = parseInt(cssLose.getPropertyValue("width"));
lose.style.top = ((pgh / 2) - (lh / 2)) + "px";
lose.style.left = ((pgw / 2) - (lw / 2)) + "px";

//initialisation score
let score = 0;
let snakeScore = 0;
var lblScore = document.getElementById('score');
lblScore.innerHTML = "Score: " + score + "... Snake score: " + snakeScore;

//le robot revient au centre de l'aire de jeux
r2d2.returnToCenter = function () {
    r2d2.style.top = ((pgh / 2) - (r2h / 2)) + "px";
    r2d2.style.left = ((pgw / 2) - (r2w / 2)) + "px";
}

//le robot va aux coordonnées spécifiées 
r2d2.moveTo = function (x, y) {
    r2d2.style.top = x + "px";
    r2d2.style.left = y + "px";
}

//renvoie les coordonnées actuelles du robot
r2d2.getPos = function () {
    x = parseInt(r2d2.style.top, 10)
    y = parseInt(r2d2.style.left, 10)
    return { x, y }
}

//renvoie les coordonnées actuelles de la roue dentée
gear.getPos = function () {
    x = parseInt(gear.style.top, 10)
    y = parseInt(gear.style.left, 10)
    return { x, y }
}

//renvoie les coordonnées actuelles du serpent
snake.getPos = function () {
    x = parseInt(snake.style.top, 10)
    y = parseInt(snake.style.left, 10)
    return { x, y }
}
//le robot se déplace de (x, y) pixels relativement à sa position courante
r2d2.moveRel = function (x, y) {
    t = r2d2.getPos().x + x
    l = r2d2.getPos().y + y
    r2d2.moveTo(t, l)
    hit(r2d2);
}

//le serpent se déplace de (x, y) pixels relativement à sa position courante
snake.moveRel = function (x, y) {
    t = snake.getPos().x + x;
    l = snake.getPos().y + y;
    snake.style.top = t + "px";
    snake.style.left = l + "px";
}

//regarde si le serpent touche le robot
function hitSnake() {
    let XVector = (snake.getPos().x + (sh / 2)) - (r2d2.getPos().x + (r2h / 2));
    let YVector = (snake.getPos().y + (sw / 2)) - (r2d2.getPos().y + (r2w / 2));
    let norm = Math.sqrt(XVector ** 2 + YVector ** 2);
    if (norm < sh / 2) {
        lose.style.visibility = "visible";
        clearInterval(snakeInterval);
        score = 0;
        lblScore.innerHTML = "Score: " + score + "... Snake score: " + snakeScore;
    }
}

//on déplace la roue dentée si le robot ou le serpent la touche et on ajoute 1 point 
function hit(obj) {
    hitSnake();
    const cssObj = window.getComputedStyle(obj, null);
    let oh = parseInt(cssObj.getPropertyValue("height"));
    let ow = parseInt(cssObj.getPropertyValue("width"));
    let XVector = (gear.getPos().x + (gh / 2)) - (obj.getPos().x + (oh / 2));
    let YVector = (gear.getPos().y + (gw / 2)) - (obj.getPos().y + (ow / 2));
    let norm = Math.sqrt(XVector ** 2 + YVector ** 2);
    if (norm < gh / 2) {
        gear.style.top = Math.floor(Math.random() * (pgh - gh)) + "px";
        gear.style.left = Math.floor(Math.random() * (pgw - gw)) + "px";
        if (obj == snake) {
            if (snakeScore === 9) {
                lose.style.visibility = "visible";
                clearInterval(snakeInterval);
            }
            ++snakeScore;
            lblScore.innerHTML = "Score: " + score + "... Snake score: " + snakeScore;
        } else if (obj == r2d2) {
            if (score === 9) {
                win.style.visibility = "visible";
                clearInterval(snakeInterval);
            }
            ++score;
            lblScore.innerHTML = "Score: " + score + "... Snake score: " + snakeScore;
        }
    }
}

//on déplace le robot avec le clavier de manière relative, d'une distance constante 
window.onkeydown = function (e) {
    if (lose.style.visibility != "visible" && win.style.visibility != "visible") {
        if (e.key == "ArrowLeft" && r2d2.getPos().y > 0) {
            r2d2.moveRel(0, -distance)
        } else if (e.key == "ArrowRight" && r2d2.getPos().y + distance < pgw - r2w) {
            r2d2.moveRel(0, distance)
        } else if (e.key == "ArrowUp" && r2d2.getPos().x - distance > 0) {
            r2d2.moveRel(-distance, 0)
        } else if (e.key == "ArrowDown" && r2d2.getPos().x + distance < pgh - r2h) {
            r2d2.moveRel(distance, 0)
        }
    }
}

snake.moveSnake = function () {
    let xTravelVector = (gear.getPos().x + (gh / 2)) - (snake.getPos().x + (sh / 2));
    let yTravelVector = (gear.getPos().y + (gw / 2)) - (snake.getPos().y + (sw / 2));
    let norm = Math.sqrt(xTravelVector ** 2 + yTravelVector ** 2);
    snake.moveRel(xTravelVector / norm * snakeDistance, yTravelVector / norm * snakeDistance)
    hit(snake);
}

const snakeInterval = setInterval(snake.moveSnake, 100);
*/