let canvas  = document.getElementById("graphics");
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
let context = canvas.getContext("2d");
let localFreq;

class Ball {
	constructor() {
		this.x = 40;
		this.y = 200;
		this.size = 100;
		this.radius = 30;
		this.colour = 'blue';
		this.velocity = 10;
	}
}

let ball = new Ball();

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
	if (globalFreq != null){localFreq = globalFreq[0];}
	//context.save();
	context.clearRect(0,0,canvas.width, canvas.height);
	if(ball.x + ball.velocity != canvas.width){
		ball.x += ball.velocity;
	}
	context.beginPath();
	context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
	context.fillStyle = ball.colour;
	context.fill();

	//context.restore();

	requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
