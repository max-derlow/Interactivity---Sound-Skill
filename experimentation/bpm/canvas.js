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


function handleMouseMove(event){
    mouseX = event.pageX;
    mouseY = event.pageY;
    drawMouse(mouseX, mouseY);
}
