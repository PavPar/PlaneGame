'use strict'
var Container = document.getElementById("GameContainer");
var Container_offset = Container.getBoundingClientRect();
var can = document.getElementById("GameBody");
var score = 0;
var scorePrev = 0;

const canvas = can.getBoundingClientRect();
const imgSrc = 'IMG/Sample-2.jpg';
const imgSrc2 = 'IMG/Sample.jpg';

var scoreOut = document.getElementById('score')
const scoreText = 'Score : '
scoreOut.innerHTML = scoreText + score;
scoreOut.style.top = 50 + 'px';
scoreOut.style.width = '100%';
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

var BackGrnd = new BackGround(can, imgSrc, 0, 0 + canvas.height, canvas.width/4, canvas.height/4)
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
    let Obj = {
        name: undefined,
        mov_int: undefined,
        shot_int: undefined
    }

    let missle_enemy_temp = document.createElement('img');
    missle_enemy_temp.id = "missle-" + missle_id++;
    missle_enemy_temp.src = "IMG/missle-hostile.gif";
    missle_enemy_temp.className = 'missle-hostile';

    missle_enemy_temp.style.left = x + 'px';
    missle_enemy_temp.style.top = y + 'px';

    Obj.id = missle_enemy_temp.id;
    Obj.mov_int = setInterval(function () { missle_move_hostile(missle_enemy_temp, 3, 1) }, 4)
    Obj.name = missle_enemy_temp;
    ObjOnScreen.push(Obj);
    return missle_enemy_temp;
}
var missle_id = 0;

let missle_friendly_temp = document.createElement('img');
missle_friendly_temp.src = "IMG/missle-friendly.gif";
missle_friendly_temp.className = 'missle-friendly';
setInterval(function () { missle_move_friendly(missle_friendly_temp, 2, -1) }, 3)

function CreateMissleFriendly(x, y) {

    missle_friendly_temp.style.left = x + 'px';
    missle_friendly_temp.style.top = y + 'px';

    return missle_friendly_temp;
}


var shot = setInterval(function () { PlaneShoot() }, 2000)

function PlaneShoot() {
    let plane_offset = plane.getBoundingClientRect();
    Container.appendChild(CreateMissleFriendly(plane_offset.left + plane_offset.width / 3 - Container_offset.left, plane_offset.top - Container_offset.top));
}
function BomberShoot(target) {
    let plane_offset = target.getBoundingClientRect();
    Container.appendChild(CreateMissleEnemy(plane_offset.left + plane_offset.width / 3 - Container_offset.left, plane_offset.top + Container_offset.top));
}

function missle_move_hostile(target, step, reverse) {
    let target_offset = target.getBoundingClientRect()
    target.style.top = target_offset.top + step * reverse - Container_offset.top + 'px';

    hit_detection(target, plane)

    if (target_offset.top > Container_offset.height + target_offset.height) {
        ObjOnScreen.forEach((element) => {
            if (element.name.id == target.id) {
                if (element.shot_int !== undefined) {
                    clearInterval(element.shot_int);
                }
                clearInterval(element.mov_int);
                ObjOnScreen.splice(ObjOnScreen.indexOf(element), 1);

                Container.removeChild(target);
                if (target.id.split('-')[0] == 'bomber') {
                    Lost();
                }
                return;
            }
        })


    }
}

function missle_move_friendly(target, step, reverse) {
    let target_offset = target.getBoundingClientRect()
    target.style.top = target_offset.top + step * reverse - Container_offset.top + 'px';
    ObjOnScreen.forEach((element) => {
        if (element.name.id.split('-')[0] !== 'missle') {
            shot_detection(target, element)
        }
    })
    if (target_offset.top > Container_offset.height + target_offset.height || target_offset.top < 0 - target_offset.height) {

        Container.removeChild(target);
    }
}

function shot_detection(missle, victim) {
    let victim_offset = victim.name.getBoundingClientRect();
    let missle_offset = missle.getBoundingClientRect();


    if (
        missle_offset.top < victim_offset.top + missle_offset.height / 2
        &&
        missle_offset.left > victim_offset.left - missle_offset.width / 4 &&
        missle_offset.right < victim_offset.right + missle_offset.width / 4
        &&
        missle_offset.bottom < victim_offset.bottom + missle_offset.height / 2
    ) {
        clearInterval(ObjOnScreen[ObjOnScreen.indexOf(victim)].shot_int);
        clearInterval(ObjOnScreen[ObjOnScreen.indexOf(victim)].mov_int);
        ObjOnScreen.splice(ObjOnScreen.indexOf(victim), 1);
        score += scorepoints.bomber;
        Container.removeChild(victim.name);
        Container.removeChild(missle);
    } else {
        //ignore
    }
}
var bomber_id = 0;




function CreateBomber(x, y) {
    let Obj = {
        id: undefined,
        name: undefined,
        mov_int: undefined,
        shot_int: undefined
    }
    let bomber = document.createElement('img');
    bomber.src = "IMG/enemy_bomber.png";
    bomber.className = 'bomber';
    bomber.id = 'bomber-' + bomber_id++
    bomber.style.left = x + 'px';
    bomber.style.top = y + 'px';
    Obj.id = bomber.id;
    Obj.mov_int = setInterval(function () { missle_move_hostile(bomber, 2, 1) }, 50)
    Obj.shot_int = setInterval(function () { BomberShoot(bomber) }, getRandomArbitrary(1500, 2500))
    Obj.name = bomber;

    ObjOnScreen.push(Obj);
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
    bomber: 2,
    bomber_max: 10
}
function RandomGenerator() {
    let ObjTypes = {}
    ObjTypes.bombers = [];
    ObjTypes.missles = [];

    ObjOnScreen.forEach(element => {
        let splitRes = element.name.id.split('-')
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

    if (scorePrev - score < -500) {
        diffic.bomber++;
        // diffic.missle++;
        scorePrev = score;
    }

    if (ObjTypes.bombers.length < diffic.bomber) {
        // let bomber = CreateBomber(getRandom(0 + Number(bomber_size.width.replace('px', '')), Container_offset.width - Number(bomber_size.width.replace('px', ''))), 0 - 2 * Number(bomber_size.height.replace('px', '')));
        let rand = getRandom(0 + Number(bomber_size.width.replace('px', '')), Container_offset.width - Number(bomber_size.width.replace('px', '')), 0 - Number(bomber_size.height.replace('px', '')), 0 - 2 * Number(bomber_size.height.replace('px', '')));
        let bomber = CreateBomber(rand.x, rand.y);
        Container.appendChild(bomber);
        // CheckDist(bomber)



    }


}

// setInterval(function () { ObjOnScreen.forEach(element => { CheckDist(element) }); }, 1)
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function Lost() {
    clearInterval(generator);
    clearInterval(BackInt);
    clearInterval(scoreCnt);
    clearInterval(shot);
    Container.removeEventListener('mousedown', mouseDown);
    Container.removeEventListener('mousemove', mouseMove);
    Container.onmouseup = null;
    document.body.style.backgroundColor = 'red';


    LosingMenu('You Failed Your Motherland');
    ObjOnScreen.forEach((element) => {
        if (element.shot_int !== undefined) {
            clearInterval(element.shot_int);
        }
        clearInterval(element.mov_int);
    })
}

function getRandom(minX, maxX, minY, maxY) {
    let genval = {};
    let genval_x = getRandomArbitrary(minX, maxX);
    let genval_y = getRandomArbitrary(minY, maxY);

    if (ObjOnScreen.length == 0) {
        return genval
    } else {
        ObjOnScreen.forEach(element => {
            let element_left = Number(element.name.style.left.replace('px', ''));

            let element_width = element.name.width;

            if ((genval_x > element_left && genval_x < element_left + element_width)) {
                if (element_left - Number(bomber_size.width.replace('px', '')) - 10 < 0) {
                    genval_x = element_left + 2 * element.name.width + 10;
                } else {
                    genval_x = element_left - element.name.width - 10;
                }
            }
        });
        let gen = {
        }
        gen.x = genval_x
        gen.y = genval_y
        console.log(gen);
        return gen
    }


}

function LosingMenu(text) {
    var msg = document.createElement('div');
    msg.id = 'MSG-lost'
    msg.style.top = Container_offset.height / 2 - 100 + 'px';
    msg.style.left = 0 + 'px';
    msg.style.fontSize = 25 + 'px'
    msg.innerHTML = text + '<br>' + 'Total Score: ' + score + `<br> Enter your name : <br> <input id='input-Name' type="text">`;

    Container.appendChild(msg)

    document.addEventListener('keypress', (event) => {

        if (event.keyCode == '13') {
            event.preventDefault();
            let UserScore = {
                name: undefined,
                score: undefined
            }
            UserScore.name = document.getElementById('input-Name').value;
            UserScore.score = score;
            console.log(UserScore);
            let json_dat = JSON.stringify(UserScore);
            localStorage.setItem("score", json_dat);

            window.location.href = "score-board.html";
        }
    })
}

// function CheckDist(target) {
//     ObjOnScreen.forEach(element => {
//         let element_height = element.name.height;
//         let element_top = Number(element.name.style.top.replace('px', ''));
//         let element_left = Number(element.name.style.left.replace('px', ''));
//         let element_width = element.name.width;

//         let target_top = Number(target.name.style.top.replace('px', '')) + element_height;
//         let target_left = Number(target.name.style.left.replace('px', ''));

//         if (element.name.id.split('-')[0] == target.id.split('-')[0] && target.id !== element.name.id && element.name.id.split('-')[1] !== '0') {
//             if (element_top - element_height < target_top && (target_left > element_left && target_left < element_left + element_width)) {
//                 target.name.style.top = element_top - element_height * 2 + 'px';
//             }
//         }
//     });
// }

// 

