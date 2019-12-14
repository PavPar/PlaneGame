'use strict'
var Container = document.getElementById("GameContainer");
var Container_offset = Container.getBoundingClientRect();
var can = document.getElementById("GameBody");
const canvas = can.getBoundingClientRect();
const imgSrc = 'IMG/Sample.jpg';


var plane = document.getElementById("plane");
// var missle = document.getElementById("missle");

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
window.setInterval(function () { BackGrnd.ShiftUp(0.01) }, 10)


document.addEventListener('keypress', (event) => {
    switch (event.key) {
        case 'w': {
            BackGrnd.ShiftUp(1);
            break;
        }
        case 's': {
            BackGrnd.ShiftDown(1);
            break;
        }
        case 'a': {
            BackGrnd.ShiftLeft(1);
            break;
        }
        case 'd': {
            BackGrnd.ShiftRight(1);
            break;
        }
    }
})



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


let missle_hostile = document.getElementById('missle-hostile');

setInterval(function () { missle_move(missle_hostile, 0.001) }, 10)

function missle_move(target, step) {
    target.style.top = target.getBoundingClientRect().top + step + 'px';

}