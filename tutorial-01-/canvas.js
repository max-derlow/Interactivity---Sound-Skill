let canvas  = document.getElementById("graphics");
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
let context = canvas.getContext("2d");
let localFreq;
//let audioCtx;
//let analyser;
let ampWindow;
let freqWindows;

class Ball {
	constructor() {
		this.i = 0; //amount of times the ball has refreshed while in the air
		this.i2 = 0;
		this.r = 0; //friction;
		this.x = 40;
		this.y = 0;
		//this.size = 0; -
		this.radius = 30;
		this.colour = 'blue';
		this.velocity = 10;
		this.mass = 10; //kg, let's say.
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
	//if (globalFreq !== null){localFreq = globalFreq[0];}
	//context.save();
	context.clearRect(0,0,canvas.width, canvas.height);
	if(ball.x + ball.radius !== canvas.width){
		ball.x += ball.velocity;
	}
/*
	if(ball.x + ball.radius > (canvas.width + 60)){
		ball.x = 0;
	}

 */
// the ball is bouncing left and right
	if(ball.x + ball.radius >= canvas.width || ball.x <= 0) {
		ball.velocity = (ball.velocity * -1);
		ball.r = (ball.r * -1);
	}

	// the ball is falling
	if(ball.y + ball.radius <= canvas.height) {
		ball.i -= 1;
		ball.y = ball.y - ball.i;
	}

	// if it hits the floor, stop falling
	else if(ball.y + ball.radius >= canvas.height){
		ball.y = canvas.height - ball.radius;
		ball.i = 0;
		//ball.r += 0.001;
		//ball.velocity = ball.velocity +- ball.r; doesn't work but fuck is that funny
	}
	// apply friction
	if(ball.velocity >= 0){
		ball.velocity -= ball.r;
	}
	// ensure we don't get negative velocity
	else if(Math.abs(ball.velocity) <= 0.8){
		ball.r = 0.5;
		ball.velocity = 1;
		console.log("killed dead");
	}

	context.beginPath();
	context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
	context.fillStyle = ball.colour;
	context.fill();

	//context.restore();

	requestAnimationFrame(draw);
}

function onResize() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}
requestAnimationFrame(draw);
