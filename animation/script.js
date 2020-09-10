x=200;
y=200;
size=100;
radius=30;
/*
function animate() {
    reqAnimFrame =  window.mozRequestAnimationFrame    || //get framerate
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame     ||
        window.oRequestAnimationFrame
    ;
    reqAnimFrame(animate);


    if(radius <= 300) {
        radius +=3;
    } //increase size by 1 per frame

    draw();
}
*/
function draw() {
    let canvas  = document.getElementById("ex1");
    let context = canvas.getContext("2d");

    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI, false);
    context.fillStyle = 'green';
    context.fill();
}

draw();
