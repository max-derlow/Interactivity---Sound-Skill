const canvas = document.getElementById("graphics"); //circle 1
canvas.width = document.documentElement.clientWidth; //
canvas.height = document.documentElement.clientHeight;
const ctx = canvas.getContext("2d");

//declare global vars
let pulse;
let mouseX;
let mouseY;
//Set listeners
//document.addEventListener("mousedown", handleMouseDown, false);
//document.addEventListener("mouseup", handleMouseUp, false);
document.addEventListener("mousemove", handleMouseMove, false);

function drawMouse(x, y)//document.addEventListener("keypress", handleKeyPress, false);
{
    pulse = bpmArray[0];
    ctx.clearRect(0, 0, 9999, 9999);
    ctx.beginPath();
    ctx.arc(x, y, pulse, 0, 2 * Math.PI); //pulsate the radius- wtf is angle?
    ctx.stroke();
}

function animate() {
    reqAnimFrame =  window.mozRequestAnimationFrame    || //get framerate
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame     ||
        window.oRequestAnimationFrame
    ;
    reqAnimFrame(animate);


    if(radius <= 200) {
        radius +=3;
    } //increase size by 1 per frame

    draw();
}

function draw() {
    var canvas  = document.getElementById("ex1");
    var context = canvas.getContext("2d");

    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI, false);
    context.fillStyle = 'green';
    context.fill();
}


function handleMouseMove(event){
    mouseX = event.pageX;
    mouseY = event.pageY;
    drawMouse(mouseX, mouseY);
}
