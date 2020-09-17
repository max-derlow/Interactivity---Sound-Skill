let canvas  = document.getElementById("graphics");
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
let context = canvas.getContext("2d");
let bigBallMod;
let ghostBallReset;
let bigBallArray = {
	"bigBall0": {'radius':(canvas.width/2), 'size':(canvas.width/2), 'colour':'orange', 'velocity':10, 'mass':10}
};
let ballArray = {
	"ball0": {'radius': 30,'size': 30, 'colour': 'red', 'velocity': 10, 'mass': 10},
	"ball1": {'radius': 60,'size': 60, 'colour': 'green', 'velocity': 6, 'mass': 10},
	"ball2": {'radius': 90,'size': 90, 'colour': 'cyan', 'velocity': 2, 'mass': 10},
};

//Fix so these are generated programatically instead.
let ghostBallArray = {};

class Ball {
	constructor(radius, size, colour, velocity, mass) {
		this.i = 0; //amount of times the ball has refreshed while in the air
		this.i2 = 0;
		this.r = 0; //friction;
		this.x = 40;
		this.y = 0;
		this.radius = radius; //mess around these
		this.size = size; //constant
		this.colour = colour;
		this.opacity = 1;
		this.velocity = velocity;
		this.mass = mass; // kg
	}

	exampleMethod(){} // Because I'm * and will forget if I don't write it here.
}

//let ball = new Ball();

// create all ball objects
function createBalls() {
	console.log(Object.keys(ballArray));
	for(let i = 0; i <= Object.keys(ballArray).length -1; i++){
		console.log(String(i));
		let ball = "ball" + String(i);
		let ballProp = ballArray["ball" + String(i)];
		window[ball] = new Ball(ballProp.radius, ballProp.size, ballProp.colour, ballProp.velocity, ballProp.mass);
	}
}

//create all ghost ball objects
function createGhostBalls(){
	console.log(Object.keys(ghostBallArray));
	for(let i = 0; i <= 30 -1; i++){
		let c1 = Math.floor(Math.random() * 255);
		let c2 = Math.floor(Math.random() * 255);
		let c3 = Math.floor(Math.random() * 255);
		//ghostBallArray["ghostBall" + String(i)] = {'radius': 20, 'colour': 'rgba(255, 0 , 255,', 'velocity': 10, 'mass': 10}; //predetermined
		ghostBallArray["ghostBall" + String(i)] = {'radius': 20, 'colour': 'rgba('+ c1 + ',' + c2 + ',' + c3 + ',', 'velocity': 10, 'mass': 10}; //random colour
		let ball = "ghostBall" + String(i);
		let ballProp = ghostBallArray["ghostBall" + String(i)];
		window[ball] = new Ball(ballProp.radius, ballProp.size, ballProp.colour, ballProp.velocity, ballProp.mass);
	}
}

function draw() {
	//Clear the canvas
	context.clearRect(0,0,canvas.width, canvas.height);

	for(let i = 0; i <= Object.keys(ballArray).length -1; i++){
		let ball = window["ball" + String(i)];

		if(ball.x <= 0){
			ball.x = 0 + ball.radius;
			ball.velocity = ball.velocity * -1;
			console.log("changing direction");
		} else if (ball.x >= canvas.width){
			ball.x = canvas.width - ball.radius;
			ball.velocity = ball.velocity * -1;
		} else {
			ball.x += ball.velocity;
		}
		/*
		//Move the ball - the ball gets funky sometimes so still needs tweaking
		if(ball.x + (ball.radius) < canvas.width && ball.x - (ball.radius) > 0){
			ball.x += ball.velocity;
		} else { //change direction if out of bounds
			ball.velocity = ball.velocity * -1;
			ball.x += ball.velocity;
		}
*/
		if(ball.velocity >= 20){
			ball.velocity = 20;
			console.log(ball.velocity);
		} else if(ball.velocity <= -20){
			ball.velocity = -20;
		}

	// the ball is bouncing left and right
		if(ball.x + ball.radius >= canvas.width || ball.x <= 0) {

			//ball.r = (ball.r * -1);
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
		else if(Math.abs(ball.velocity) <= 0.05){
			ball.r = 0.5;
			ball.velocity = 0.5;
			//console.log("killed dead");
		}

		context.beginPath();
		context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
		context.fillStyle = ball.colour;
		context.fill();
	}
	requestAnimationFrame(draw);
	//requestAnimationFrame(drawBigBall);
	requestAnimationFrame(drawGhostBalls);
}

//Handles the 'runCounter' which affects the opacity of ghost balls. Real fokkin' spaghetti code but w/e.
let runCounter = 100;
// let runDirection = '+';
function handleRunCounter(){
	let addBpm;
	if(avgBpm){
		if(isFinite(avgBpm) && avgBpm !== null && avgBpm !== 0 && !isNaN(avgBpm)){
			addBpm = avgBpm/50;
			console.log("adding bpm");
		}
	} else {
		console.log("Value is crazeyyy");
		addBpm = 0;
	}
//necessary error handling for a nasty bug
	if(isNaN(runCounter)){
		console.log(runCounter);
		console.log(avgBpm);
		runCounter = 0;

	}

	if(runCounter <= 0) {
		runCounter = 100;
		ghostBallReset = true;
	} else {
		runCounter -= (1 + addBpm);
		ghostBallReset = false;
	}
/*
	if(runDirection === '+' && runCounter < 100){
		runCounter += (1 + addBpm);
	} else if(runDirection === '+'&& runCounter >= 100){
		runCounter -= (1 + addBpm);
		runDirection = '-';
	}
	if(runDirection === '-' && runCounter > 0){
		runCounter -= (1 + addBpm);
	} else if(runDirection === '-'&& runCounter <= 0){
		runCounter += (1 + addBpm);
		runDirection = '+';
	}
*/
}

//handle velocity - maybe or maybe not. doesn't seem optimal.
function handleVelocity(ball, velocityDelta){
	if(ball.velocity > 0) {
		ball.velocity += velocityDelta;
		ball.x += ball.velocity;
	} else if (ball.velocity < 0) {
		ball.velocity -= velocityDelta;
		ball.x -= ball.velocity;
	}
}

function drawBigBall(){
	let ball = bigBallArray.bigBall0;
	context.beginPath();
	context.arc((canvas.width - (ball.radius/4)), (canvas.height - ball.radius/2), (canvas.height/2), 0, 2 * Math.PI, false);
	context.fillStyle = "orange";
	context.fill();
}


function drawGhostBalls(){
	handleRunCounter();
	let opacity = runCounter/100;

	for(let i = 0; i <= Object.keys(ghostBallArray).length -1; i++) {
		console.log("isRunning");
		let ball = window["ghostBall" + String(i)];
		if(ghostBallReset === true){
			ball.x = Math.floor(Math.random() * canvas.width);
			ball.y = Math.floor(Math.random() * canvas.height);
		}
		context.beginPath();
		context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
		context.fillStyle = ball.colour + opacity + ")";
		context.fill();
	}
}


function onResize() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

function handleBehaviour(ball, behaviour, intensity){
	switch (behaviour){
		case "jumping": //BPM is j
			behaviour = "jumping";
			ball.i += intensity;
			break;
		case "velocity": //Amplitude threshhold - velocity
			behaviour = "velocity";
			ball.velocity += intensity;
			break;
		case "radius": // Amplitude sustained - size
			behaviour = "radius";
			ball.radius += intensity;
			break;
		case "opacity": //BPM is opacity - when looking at ghost balls
			behaviour = "opacity";
			ball.opacity += intensity;
			break;
		case "colour": //Somewhere
			behaviour = "colour";
			ball.colour += intensity;
			break;
		case "position": //Somewhere
			behaviour = "position";
			ball.colour += intensity;
			break;
	}
}

createBalls();
createGhostBalls();
requestAnimationFrame(draw);
