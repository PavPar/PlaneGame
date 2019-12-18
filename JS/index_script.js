'use strict'
var Container = document.getElementById("GameContainer");
var Container_offset = Container.getBoundingClientRect();
var can = document.getElementById("GameBody");
var score = 0;
var scorePrev = 0;

const canvas = can.getBoundingClientRect();
const imgSrc = 'IMG/Sample.jpg';
var scoreOut = document.getElementById('score')
const scoreText = 'Score : '
scoreOut.innerHTML = scoreText + score;

const bomber_size = window.getComputedStyle(document.getElementById('bomber-sample'));
const missle_size = window.getComputedStyle(document.getElementById('missle-sample'));

var plane = document.getElementById("plane");

var scoreCnt = setInterval(function () { score++; scoreOut.innerHTML = scoreText + score; }, 1000)
const scorepoints = {
    bomber: 100
}
class BackGround {
    cnvs
    image
    CurrCoords
    loop
    imgScale
    constructor(obj, imgSrc, posX, posY, imgScale_x, imgScale_y) {
        this.cnvs = obj.getContext('2d');
        this.image = new Image()
        this.image.src = imgSrc;
        this.CurrCoords = {};
        this.CurrCoords.x = posX;
        this.CurrCoords.y = posY;
        this.loop = false;

        this.imgScale = {}
        this.imgScale.x = imgScale_x;
        this.imgScale.y = imgScale_y;

        this.ShiftUp(1);
    }
    ShiftUp(val) {
        this.MoveBackground(0, val * -1)
    }
    ShiftLeft(val) {
        this.MoveBackground(val * -1, 0)
    }
    ShiftRight(val) {
        this.MoveBackground(val, 0)
    }
    ShiftDown(val) {
        this.MoveBackground(0, val)
    }
    Loop() {
        this.loop = !this.loop;
    }
    MoveBackground(x, y) {
        this.cnvs.clearRect(0, 0, canvas.width, canvas.height);
        this.CurrCoords.x += x;
        this.CurrCoords.y += y;
        if (this.loop) {
            if (this.CurrCoords.y < 0) { this.CurrCoords.y = this.image.height - this.imgScale.y }
            if (this.CurrCoords.y > this.image.height - this.imgScale.y) { this.CurrCoords.y = 0 }
        }
        this.cnvs.drawImage(this.image, this.CurrCoords.x, this.CurrCoords.y, this.imgScale.x, this.imgScale.y, 0, 0, canvas.width, canvas.height)

    }
}

var BackGrnd = new BackGround(can, imgSrc, 0, 0, canvas.width / 2, canvas.height / 2)
BackGrnd.Loop();
var BackInt = window.setInterval(function () { BackGrnd.ShiftUp(0.01) }, 10)






Container.addEventListener('mousedown', mouseDown)
var Shift = {}
var WindowShift = {}
WindowShift.x = window.innerWidth;
WindowShift.y = window.innerWidth;



function mouseDown(event) {
    event.preventDefault();
    if (event.target.id == plane.id) {
        Container_offset = Container.getBoundingClientRect();
        Shift.x = event.clientX - plane.getBoundingClientRect().left;
        Shift.y = event.clientY - plane.getBoundingClientRect().top;

        //TODO LITLE SHIFT

        plane.style.left = event.clientX - Shift.x - Container_offset.left + 'px';
        plane.style.top = event.clientY - Shift.y - Container_offset.top + 'px';

        Container.addEventListener('mousemove', mouseMove);
        Container.onmouseup = function () {
            Container.removeEventListener('mousemove', mouseMove);
            Container.onmouseup = null;
        };

    }

}

function mouseMove() {


    plane.style.left = event.clientX - Shift.x - Container_offset.left + 'px';
    plane.style.top = event.clientY - Shift.y - Container_offset.top + 'px';
}


var ObjOnScreen = [];

function CreateMissleEnemy(x, y) {
    let missle = document.createElement('img');
    missle.id = "missle-" + missle_id++;
    missle.src = "IMG/missle-hostile.gif";
    missle.className = 'missle-hostile';
    missle.style.left = x + 'px';
    missle.style.top = y + 'px';
    ObjOnScreen.push(missle);
    setInterval(function () { missle_move_hostile(missle, 3, 1) }, 4)
    return missle;
}
var missle_id = 0;
function CreateMissleFriendly(x, y) {
    let missle = document.createElement('img');

    missle.src = "IMG/missle-friendly.gif";
    missle.className = 'missle-friendly';
    missle.style.left = x + 'px';
    missle.style.top = y + 'px';
    setInterval(function () { missle_move_friendly(missle, 2, -1) }, 1)
    return missle;
}


var shot = setInterval(function () { PlaneShoot() }, 2000)

function PlaneShoot() {
    let plane_offset = plane.getBoundingClientRect();
    Container.appendChild(CreateMissleFriendly(plane_offset.left + plane_offset.width / 3 - Container_offset.left, plane_offset.top - Container_offset.top));
}


function missle_move_hostile(target, step, reverse) {
    let target_offset = target.getBoundingClientRect()
    target.style.top = target_offset.top + step * reverse - Container_offset.top + 'px';

    hit_detection(target, plane)

    if (target_offset.top > Container_offset.height + target_offset.height || target_offset.top < 0 - target_offset.height) {
        ObjOnScreen.splice(ObjOnScreen.indexOf(target), 1);
        Container.removeChild(target);
    }
}

function missle_move_friendly(target, step, reverse) {
    let target_offset = target.getBoundingClientRect()
    target.style.top = target_offset.top + step * reverse - Container_offset.top + 'px';
    ObjOnScreen.forEach((element) => {
        if (element.id.split('-')[0] !== 'missle') {
            shot_detection(target, element)
        }
    })
    if (target_offset.top > Container_offset.height + target_offset.height || target_offset.top < 0 - target_offset.height) {

        Container.removeChild(target);
    }
}

function shot_detection(missle, victim) {
    let victim_offset = victim.getBoundingClientRect();
    let missle_offset = missle.getBoundingClientRect();


    if (
        missle_offset.top < victim_offset.top + missle_offset.height / 2
        &&
        missle_offset.left > victim_offset.left - missle_offset.width / 4 &&
        missle_offset.right < victim_offset.right + missle_offset.width / 4
        &&
        missle_offset.bottom < victim_offset.bottom + missle_offset.height / 2
    ) {
        ObjOnScreen.splice(ObjOnScreen.indexOf(victim), 1);
        score += scorepoints.bomber;
        Container.removeChild(victim);
        Container.removeChild(missle);
    } else {
        //ignore
    }
}
var bomber_id = 0;

function CreateBomber(x, y) {
    let bomber = document.createElement('img');
    bomber.id = 'bomber-' + bomber_id++
    bomber.src = "IMG/enemy_bomber.png";
    bomber.className = 'bomber';
    bomber.style.left = x + 'px';
    bomber.style.top = y + 'px';
    setInterval(function () { missle_move_hostile(bomber, 2, 1) }, 100)
    ObjOnScreen.push(bomber);
    return bomber;
}



function hit_detection(missle, target) {
    let target_offset = target.getBoundingClientRect();
    let missle_offset = missle.getBoundingClientRect();
    if (
        missle_offset.top > target_offset.top - missle_offset.height / 2 &&
        missle_offset.left > target_offset.left - missle_offset.width / 4 &&
        missle_offset.right < target_offset.right + missle_offset.width / 4 &&
        missle_offset.bottom < target_offset.bottom + missle_offset.height / 2
    ) {
        Lost()
        ObjOnScreen.splice(ObjOnScreen.indexOf(missle), 1);
        Container.removeChild(missle);
    } else {
        //ignore
    }
}

var generator = setInterval(function () { RandomGenerator() }, 10);
var diffic = {
    missle: 0,
    missle_max: 10,
    bomber: 1,
    bomber_max: 10
}
function RandomGenerator() {
    let ObjTypes = {}
    ObjTypes.bombers = [];
    ObjTypes.missles = [];

    ObjOnScreen.forEach(element => {
        let splitRes = element.id.split('-')
        switch (splitRes[0]) {
            case 'bomber': {
                ObjTypes.bombers.push(element);
                break;
            }
            case 'missle': {
                ObjTypes.missles.push(element);
                break;
            }
        }
    })

    if (scorePrev - score < -1000) {
        diffic.bomber++;
        diffic.missle++;
        scorePrev = score;
    }

    if (ObjTypes.bombers.length < diffic.bomber) {
        let bomber = CreateBomber(getRandomArbitrary(0 + Number(bomber_size.width.replace('px', '')), Container_offset.width - Number(bomber_size.width.replace('px', ''))), 0 - Number(bomber_size.height.replace('px', '')));
        Container.appendChild(bomber);

    }
    if (ObjTypes.missles.length < diffic.missle) {
        Container.appendChild(CreateMissleEnemy(getRandomArbitrary(0 + missle_size.width.replace('px', ''), Container_offset.width - missle_size.width.replace('px', '')), getRandomArbitrary(0, 5)));
    }
    // console.log(ObjTypes);
}
// function createExplosion(x, y) {
//     let explosion = document.createElement('img');
//     explosion.src = "IMG/explosion.gif";
//     explosion.className = 'missle-friendly';
//     explosion.style.left = x - Container_offset.left + 'px';
//     explosion.style.top = y - Container_offset.top + 'px';
//     Container.appendChild(explosion)
// }
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function Lost() {
    clearInterval(generator);
    clearInterval(BackInt);
    clearInterval(scoreCnt);
    clearInterval(shot);
    Container.removeEventListener('mousedown', mouseDown);
    document.body.style.backgroundColor = 'red';
    scoreOut.innerHTML = 'You Failed Your Motherland<br>';
    scoreOut.style.fontSize = 50 + 'px'
}

function getRandom(min, max) {
    getRandomArbitrary(min,max);
}